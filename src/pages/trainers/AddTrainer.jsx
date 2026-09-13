import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, User, Briefcase, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { trainersApi } from '../../services/api';
import { getApiErrorMessage } from '../../services/apiClient';

const AddTrainer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const { data: trainer, isLoading: isLoadingTrainer } = useQuery({
    queryKey: ['trainer', id],
    queryFn: () => trainersApi.get(id),
    enabled: isEdit,
  });

  React.useEffect(() => {
    if (trainer) reset(trainer);
  }, [reset, trainer]);

  const saveTrainer = useMutation({
    mutationFn: (data) => isEdit ? trainersApi.update({ id, ...data }) : trainersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
      toast.success(isEdit ? 'Trainer updated successfully!' : 'Trainer added successfully!');
      navigate('/trainers');
    },
    onError: error => toast.error(getApiErrorMessage(error, isEdit ? 'Unable to update trainer.' : 'Unable to add trainer.')),
  });

  const onSubmit = (data) => saveTrainer.mutate(data);

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://localhost:3000${path.startsWith('/') ? path : `/${path}`}`;
  };

  const profilePhotoObj = watch('profilephoto');
  const existingPhoto = isEdit && trainer?.profilephoto;
  
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
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{isEdit ? 'Edit Trainer' : 'Add New Trainer'}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{isEdit ? 'Update trainer details.' : 'Register a new gym trainer or coach.'}</p>
        </div>
        <div className="flex gap-2">
          <button 
            type="button"
            onClick={() => navigate('/trainers')}
            className="btn-outline text-sm flex items-center gap-2"
          >
            <X className="h-4 w-4" /> Cancel
          </button>
          <button 
                      type="submit"
            form="add-trainer-form"
            disabled={saveTrainer.isPending || isLoadingTrainer}
            className="btn-primary text-sm flex items-center gap-2"
          >
            <Save className="h-4 w-4" /> {isEdit ? 'Update Trainer' : 'Save Trainer'}
          </button>
        </div>
      </div>

      <form id="add-trainer-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Section 1: Personal Information */}
        <div className="card overflow-hidden">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-slate-800 dark:text-white">Personal Information</h3>
          </div>
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
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

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                  <input 
                    {...register('fullname', { required: 'Full name is required' })} 
                    className="input-field" 
                    placeholder="e.g. Mike Johnson"
                  />
                  {errors.fullname && <p className="text-xs text-danger mt-1">{errors.fullname.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
                  <input 
                    type="email"
                    {...register('email', { required: 'Email is required' })} 
                    className="input-field" 
                    placeholder="mike@example.com"
                  />
                </div>

                {!isEdit && <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password *</label>
                  <input
                    type="password"
                    {...register('password', { required: 'Password is required' })}
                    className="input-field"
                    placeholder="Set a password"
                  />
                  {errors.password && <p className="text-xs text-danger mt-1">{errors.password.message}</p>}
                </div>}

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number *</label>
                  <input 
                    {...register('phone', { required: 'Phone is required' })} 
                    className="input-field" 
                    placeholder="+91 9876543210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date of Birth</label>
                  <input 
                    type="date"
                    {...register('dateofbirth')} 
                    className="input-field text-slate-500" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Professional Details */}
        <div className="card overflow-hidden">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-secondary" />
            <h3 className="font-bold text-slate-800 dark:text-white">Professional Details</h3>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Specialty *</label>
              <select {...register('speciality', { required: 'Specialty is required' })} className="input-field">
                <option value="">Select Specialty</option>
                <option value="Strength & Conditioning">Strength & Conditioning</option>
                <option value="Yoga & Flexibility">Yoga & Flexibility</option>
                <option value="CrossFit">CrossFit</option>
                <option value="Cardio & HIIT">Cardio & HIIT</option>
                <option value="General Fitness">General Fitness</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Experience (Years)</label>
              <input type="number" {...register('experience')} className="input-field" placeholder="5" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Shift Timing</label>
              <select {...register('shifttiming')} className="input-field">
                <option value="Morning">Morning (6 AM - 2 PM)</option>
                <option value="Evening">Evening (2 PM - 10 PM)</option>
                <option value="Full Day">Full Day</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Monthly Salary (₹)</label>
              <input type="number" {...register('monthlysalary')} className="input-field" placeholder="25000" />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddTrainer;
