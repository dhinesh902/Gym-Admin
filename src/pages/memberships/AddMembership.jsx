import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Save, X, CreditCard, AlignLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { getApiErrorMessage } from '../../services/apiClient';

const AddMembership = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const createPlan = useMutation({
    mutationFn: async (payload) => {
      const response = await apiClient.post('/plans/add', payload);
      return response.data;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['plans'] }); toast.success('Membership Plan added successfully!'); navigate('/memberships'); },
    onError: error => toast.error(getApiErrorMessage(error, 'Unable to create membership plan.')),
  });

  const onSubmit = (data) => createPlan.mutate({ 
    name: data.planName, 
    durationInMonths: Number(data.duration), 
    price: Number(data.price), 
    description: data.description 
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Create Membership Plan</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Define a new membership tier or plan.</p>
        </div>
        <div className="flex gap-2">
          <button 
            type="button"
            onClick={() => navigate('/memberships')}
            className="btn-outline text-sm flex items-center gap-2"
          >
            <X className="h-4 w-4" /> Cancel
          </button>
          <button 
            type="submit"
            form="add-membership-form"
            className="btn-primary text-sm flex items-center gap-2"
          >
            <Save className="h-4 w-4" /> Save Plan
          </button>
        </div>
      </div>

      <form id="add-membership-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card overflow-hidden">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-slate-800 dark:text-white">Plan Details</h3>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Plan Name *</label>
              <input 
                {...register('planName', { required: 'Plan name is required' })} 
                className="input-field" 
                placeholder="e.g. Yearly VIP"
              />
              {errors.planName && <p className="text-xs text-danger mt-1">{errors.planName.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Duration (Months) *</label>
              <input 
                type="number"
                {...register('duration', { required: 'Duration is required' })} 
                className="input-field" 
                placeholder="12"
              />
              {errors.duration && <p className="text-xs text-danger mt-1">{errors.duration.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price (₹) *</label>
              <input 
                type="number"
                {...register('price', { required: 'Price is required' })} 
                className="input-field" 
                placeholder="12000"
              />
              {errors.price && <p className="text-xs text-danger mt-1">{errors.price.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
              <select {...register('status')} className="input-field">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <AlignLeft className="h-5 w-5 text-secondary" />
            <h3 className="font-bold text-slate-800 dark:text-white">Description & Features</h3>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
              <textarea 
                {...register('description')} 
                className="input-field min-h-[80px]" 
                placeholder="Brief description of the plan..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Features (Comma separated)</label>
              <textarea 
                {...register('features')} 
                className="input-field min-h-[80px]" 
                placeholder="e.g. Free Personal Training, Diet Plan, Locker Access"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddMembership;
