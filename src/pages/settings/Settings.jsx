import React, { useEffect } from 'react';
import { Save, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authApi } from '../../services/api';
import { getApiErrorMessage } from '../../services/apiClient';

const Settings = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: authApi.getProfile,
    onError: (err) => toast.error('Failed to load profile details')
  });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        gymname: profile.gymname,
        email: profile.email,
        mobilenumber: profile.mobilenumber,
        address: profile.address
      });
    }
  }, [profile, reset]);

  const updateMutation = useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: () => {
      toast.success('Settings updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, 'Failed to update settings'))
  });

  const handleSave = (data) => {
    updateMutation.mutate(data);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">System Settings</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage your gym's core configurations and preferences.</p>
        </div>
        <button onClick={handleLogout} className="btn-outline border-danger text-danger hover:bg-danger hover:text-white flex items-center gap-2 text-sm">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>

      <form onSubmit={handleSubmit(handleSave)} className="card p-6 space-y-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">General Information</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="sm:col-span-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Admin Name</label>
            <input type="text" {...register('name')} className="input-field" placeholder="Admin Name" />
          </div>

          <div className="sm:col-span-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Gym Name</label>
            <input type="text" {...register('gymname')} className="input-field" placeholder="Gym Name" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contact Email</label>
            <input type="email" {...register('email')} className="input-field" placeholder="contact@example.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Contact Phone</label>
            <input type="text" {...register('mobilenumber')} className="input-field" placeholder="Mobile Number" />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Physical Address</label>
            <textarea {...register('address')} className="input-field min-h-[80px]" placeholder="Full Address" />
          </div>

        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" disabled={updateMutation.isPending} className="btn-primary flex items-center gap-2">
            <Save className="h-4 w-4" /> {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
