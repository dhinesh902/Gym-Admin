import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Save, X, User, Briefcase, Award, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const AddTrainer = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    toast.success('Trainer added successfully!');
    navigate('/trainers');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Add New Trainer</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Register a new gym trainer or coach.</p>
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
            className="btn-primary text-sm flex items-center gap-2"
          >
            <Save className="h-4 w-4" /> Save Trainer
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
                <div className="h-32 w-32 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400">
                  <Upload className="h-8 w-8 mb-2" />
                  <span className="text-xs">Upload Photo</span>
                </div>
                <button type="button" className="text-sm font-medium text-primary hover:underline">Change Photo</button>
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name *</label>
                  <input 
                    {...register('fullName', { required: 'Full name is required' })} 
                    className="input-field" 
                    placeholder="e.g. Mike Johnson"
                  />
                  {errors.fullName && <p className="text-xs text-danger mt-1">{errors.fullName.message}</p>}
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
                    {...register('dob')} 
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
              <select {...register('specialty', { required: 'Specialty is required' })} className="input-field">
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
              <select {...register('shift')} className="input-field">
                <option value="Morning">Morning (6 AM - 2 PM)</option>
                <option value="Evening">Evening (2 PM - 10 PM)</option>
                <option value="Full Day">Full Day</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Monthly Salary (₹)</label>
              <input type="number" {...register('salary')} className="input-field" placeholder="25000" />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddTrainer;
