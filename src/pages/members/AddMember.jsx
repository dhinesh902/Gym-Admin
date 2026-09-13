import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, User, Activity, CreditCard, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { membersApi, plansApi, trainersApi, toCollection } from '../../services/api';
import { getApiErrorMessage } from '../../services/apiClient';

const AddMember = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();

  const { data: plansData } = useQuery({ queryKey: ['plans'], queryFn: plansApi.list });
  const { data: trainersData } = useQuery({ queryKey: ['trainers'], queryFn: trainersApi.list });
  const plans = toCollection(plansData, ['plans', 'items']);
  const trainers = toCollection(trainersData, ['trainers', 'items']);

  const { data: memberData, isLoading: isLoadingMember } = useQuery({
    queryKey: ['member', id],
    queryFn: () => membersApi.get(id),
    enabled: isEdit,
  });

  React.useEffect(() => {
    if (memberData) {
      reset({
        fullName: memberData.fullname,
        email: memberData.email,
        phone: memberData.phone,
        dob: memberData.dateofbirth,
        gender: memberData.gender,
        emergencyContact: memberData.emergency,
        address: memberData.address,
        height: memberData.height,
        weight: memberData.weight,
        bloodGroup: memberData.bloodgroup,
        goal: memberData.fitnessgoal,
        trainerId: memberData.assignedtrainer,
        planId: memberData.membershipplanid,
        joiningDate: memberData.joiningdate,
        status: memberData.status,
      });
    }
  }, [memberData, reset]);

  const saveMember = useMutation({
    mutationFn: (payload) => isEdit ? membersApi.update({ id, ...payload }) : membersApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      if (isEdit) queryClient.invalidateQueries({ queryKey: ['member', id] });
      toast.success(isEdit ? 'Member updated successfully!' : 'Member added successfully!');
      navigate('/members');
    },
    onError: (error) => toast.error(getApiErrorMessage(error, isEdit ? 'Unable to update member.' : 'Unable to add member.')),
  });

  const onSubmit = (data) => {
    const payload = {
      fullname: data.fullName,
      email: data.email,
      password: data.password,
      phone: data.phone,
      dateofbirth: data.dob,
      gender: data.gender,
      emergency: data.emergencyContact,
      address: data.address,
      height: data.height,
      weight: data.weight,
      bloodgroup: data.bloodGroup,
      fitnessgoal: data.goal,
      assignedtrainer: data.trainerId,
      membershipplanid: data.planId,
      joiningdate: data.joiningDate,
      status: data.status || 'active',
      profilephoto: data.profilephoto
    };
    saveMember.mutate(payload);
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://localhost:3000${path.startsWith('/') ? path : `/${path}`}`;
  };

  const profilePhotoObj = watch('profilephoto');
  const existingPhoto = isEdit && memberData?.profilephoto;
  
  let photoPreview = null;
  if (profilePhotoObj && typeof profilePhotoObj !== 'string' && profilePhotoObj.length > 0) {
    try {
      photoPreview = URL.createObjectURL(profilePhotoObj[0]);
    } catch (e) {
      console.error(e);
    }
  } else if (existingPhoto) {
    photoPreview = getImageUrl(existingPhoto);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{isEdit ? 'Edit Member' : 'Add New Member'}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{isEdit ? 'Update member details.' : 'Fill in the details to register a new gym member.'}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate('/members')}
            className="btn-outline text-sm flex items-center gap-2"
          >
            <X className="h-4 w-4" /> Cancel
          </button>
          <button
            type="submit"
            form="add-member-form"
            disabled={saveMember.isPending || isLoadingMember}
            className="btn-primary text-sm flex items-center gap-2"
          >
            <Save className="h-4 w-4" /> {isEdit ? 'Update Member' : 'Save Member'}
          </button>
        </div>
      </div>

      <form id="add-member-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Section 1: Personal Information */}
        <div className="card overflow-hidden">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-slate-800 dark:text-white">Personal Information</h3>
          </div>
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Image Upload Mock */}
              <div className="flex flex-col items-center gap-3">
                <label className="relative h-32 w-32 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 cursor-pointer overflow-hidden group">
                  {photoPreview ? (
                    <>
                      <img src={photoPreview} alt="Profile Preview" className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload className="h-6 w-6 text-white" />
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 mb-2" />
                      <span className="text-xs">Upload Photo</span>
                    </>
                  )}
                  <input type="file" accept="image/*" {...register('profilephoto')} className="hidden" />
                </label>
                <span className="text-sm font-medium text-primary">Change Photo</span>
              </div>

              {/* Form Grid */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                  <input
                    {...register('fullName', { required: 'Full name is required' })}
                    className="input-field"
                    placeholder="e.g. John Doe"
                  />
                  {errors.fullName && <p className="text-xs text-danger mt-1">{errors.fullName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    {...register('email', { required: 'Email is required' })}
                    className="input-field"
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
                </div>

                {!isEdit && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password *</label>
                    <input
                      type="password"
                      {...register('password', { required: 'Password is required' })}
                      className="input-field"
                      placeholder="Create a password"
                    />
                    {errors.password && <p className="text-xs text-danger mt-1">{errors.password.message}</p>}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number *</label>
                  <input
                    {...register('phone', { required: 'Phone is required' })}
                    className="input-field"
                    placeholder="+91 9876543210"
                  />
                  {errors.phone && <p className="text-xs text-danger mt-1">{errors.phone.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    {...register('dob')}
                    className="input-field text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Gender</label>
                  <select {...register('gender')} className="input-field">
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Emergency Contact</label>
                  <input
                    {...register('emergencyContact')}
                    className="input-field"
                    placeholder="Name & Phone"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Address</label>
                  <textarea
                    {...register('address')}
                    className="input-field min-h-[80px] resize-y"
                    placeholder="Full residential address"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Health & Body Metrics */}
        <div className="card overflow-hidden">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <Activity className="h-5 w-5 text-secondary" />
            <h3 className="font-bold text-slate-800 dark:text-white">Health & Metrics</h3>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Height (cm)</label>
              <input type="number" {...register('height')} className="input-field" placeholder="175" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Weight (kg)</label>
              <input type="number" {...register('weight')} className="input-field" placeholder="70" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Blood Group</label>
              <select {...register('bloodGroup')} className="input-field">
                <option value="">Select</option>
                <option value="A+">A+</option>
                <option value="O+">O+</option>
                <option value="B+">B+</option>
                <option value="AB+">AB+</option>
                <option value="A-">A-</option>
                <option value="O-">O-</option>
                <option value="B-">B-</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Fitness Goal</label>
              <select {...register('goal')} className="input-field">
                <option value="">Select Goal</option>
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="flexibility">Flexibility</option>
                <option value="general">General Fitness</option>
              </select>
            </div>
            <div className="sm:col-span-2 md:col-span-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Medical History / Injuries</label>
              <textarea
                {...register('medicalHistory')}
                className="input-field min-h-[80px]"
                placeholder="List any past injuries, surgeries, or conditions..."
              />
            </div>
          </div>
        </div>

        {/* Section 3: Membership Details */}
        <div className="card overflow-hidden">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-accent" />
            <h3 className="font-bold text-slate-800 dark:text-white">Membership Plan</h3>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select Plan *</label>
              <select {...register('planId', { required: 'Please select a plan' })} className="input-field">
                <option value="">-- Choose a Plan --</option>
                {plans.map(plan => <option key={plan.id} value={plan.id}>{plan.name} (₹{plan.price})</option>)}
              </select>
              {errors.planId && <p className="text-xs text-danger mt-1">{errors.planId.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Assign Trainer</label>
              <select {...register('trainerId')} className="input-field">
                <option value="">No Trainer (Self Workout)</option>
                {trainers?.map(trainer => <option key={trainer.id} value={trainer.id}>{trainer.fullname || trainer.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Joining Date *</label>
              <input
                type="date"
                {...register('joiningDate', { required: 'Joining date is required' })}
                className="input-field text-slate-500"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
              {errors.joiningDate && <p className="text-xs text-danger mt-1">{errors.joiningDate.message}</p>}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddMember;
