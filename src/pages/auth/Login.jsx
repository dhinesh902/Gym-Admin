import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    // Mock login logic
    if (data.email && data.password) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] flex items-center justify-center p-4">
      <div className="card w-full max-w-md p-8 shadow-xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <Dumbbell className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Sign In to GymAdmin</h1>
          <p className="text-slate-500 text-sm mt-2 text-center">Enter your credentials to access the gym management dashboard.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="input-field pl-10 h-11"
                placeholder="admin@gym.com"
                defaultValue="admin@gym.com"
              />
            </div>
            {errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <a href="#" className="text-xs font-medium text-primary hover:underline">Forgot password?</a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                {...register('password', { required: 'Password is required' })}
                className="input-field pl-10 h-11"
                placeholder="••••••••"
                defaultValue="password123"
              />
            </div>
            {errors.password && <p className="text-xs text-danger mt-1">{errors.password.message}</p>}
          </div>

          <div className="flex items-center">
            <input type="checkbox" id="remember" className="h-4 w-4 text-primary rounded border-slate-300 focus:ring-primary" />
            <label htmlFor="remember" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
              Remember me for 30 days
            </label>
          </div>

          <button type="submit" className="btn-primary w-full h-11 text-base">
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Need help? <a href="#" className="font-medium text-primary hover:underline">Contact Support</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
