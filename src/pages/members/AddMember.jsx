import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Save, X, User, Activity, CreditCard, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const AddMember = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    toast.success('Member added successfully!');
    navigate('/members');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Add New Member</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Fill in the details to register a new gym member.</p>
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
            className="btn-primary text-sm flex items-center gap-2"
          >
            <Save className="h-4 w-4" /> Save Member
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
                <div className="h-32 w-32 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400">
                  <Upload className="h-8 w-8 mb-2" />
                  <span className="text-xs">Upload Photo</span>
                </div>
                <button type="button" className="text-sm font-medium text-primary hover:underline">Change Photo</button>
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
                <option value="plan_1">Monthly Basic (₹1,500)</option>
                <option value="plan_2">Quarterly Pro (₹4,000)</option>
                <option value="plan_3">Half Yearly Elite (₹7,500)</option>
                <option value="plan_4">Yearly VIP (₹12,000)</option>
              </select>
              {errors.planId && <p className="text-xs text-danger mt-1">{errors.planId.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Assign Trainer</label>
              <select {...register('trainerId')} className="input-field">
                <option value="">No Trainer (Self Workout)</option>
                <option value="t1">Mike Johnson (Strength)</option>
                <option value="t2">Sarah Davis (Cardio)</option>
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

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Payment Status</label>
              <select {...register('paymentStatus')} className="input-field">
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="partial">Partial Payment</option>
              </select>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddMember;
