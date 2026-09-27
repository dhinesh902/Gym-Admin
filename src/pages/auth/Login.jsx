import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Lock, Eye, EyeOff, User } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import apiClient, { getApiErrorMessage } from '../../services/apiClient';
import { API_ROUTES } from '../../services/apiRoutes';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await apiClient.post(API_ROUTES.auth.login, { email: data.email, password: data.password });
      const { token, user } = response.data.data;
      if (token) localStorage.setItem('gym_auth_token', token);
      if (user) localStorage.setItem('gym_auth_user', JSON.stringify(user));
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to sign in. Check your credentials.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden font-sans">

      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop")' }}
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px]"></div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-[400px] p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#0f1115]/95 border border-gray-800/60 rounded-2xl p-8 shadow-2xl"
        >
          {/* Header */}
          <div className="flex flex-col items-center justify-center mb-8">
            <Dumbbell className="h-10 w-10 text-[#FBBF24] mb-3 fill-current" />
            <h1 className="text-2xl font-bold text-white tracking-wide">
              Gym <span className="text-[#FBBF24]">Admin</span>
            </h1>
            <p className="text-gray-500 text-xs uppercase tracking-[0.2em] mt-1">Management Panel</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Input */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="w-full pl-10 pr-4 h-12 bg-[#1a1d24] border border-[#1a1d24] focus:border-[#FBBF24] focus:bg-[#1a1d24] rounded-lg outline-none transition-colors text-white placeholder:text-gray-500 text-sm focus:ring-1 focus:ring-[#FBBF24]"
                  placeholder="Email / Username"
                  defaultValue="admin@gmail.com"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1 ml-1">{errors.email.message}</p>}
            </div>

            {/* Password Input */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register('password', { required: 'Password is required' })}
                  className="w-full pl-10 pr-10 h-12 bg-[#1a1d24] border border-[#1a1d24] focus:border-[#FBBF24] focus:bg-[#1a1d24] rounded-lg outline-none transition-colors text-white placeholder:text-gray-500 text-sm focus:ring-1 focus:ring-[#FBBF24]"
                  placeholder="Password"
                  defaultValue="Admin@4321"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1 ml-1">{errors.password.message}</p>}
            </div>

            {/* Options */}
            <div className="flex items-center justify-between pt-2 pb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 rounded border-gray-700 bg-[#1a1d24] text-[#FBBF24] focus:ring-[#FBBF24] focus:ring-offset-0 cursor-pointer"
                />
                <label htmlFor="remember" className="ml-2 block text-xs text-gray-400 cursor-pointer hover:text-gray-300 transition-colors">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-xs font-semibold text-[#FBBF24] hover:text-yellow-300 transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-[#FBBF24] hover:bg-yellow-400 text-black text-sm rounded-lg font-bold transition-colors disabled:opacity-70 shadow-[0_0_15px_rgba(251,191,36,0.1)]"
            >
              {isSubmitting ? 'Signing in...' : 'Login'}
            </button>
          </form>

          {/* Footer Line */}
          <div className="mt-8 flex items-center justify-center opacity-50">
            <div className="h-px bg-gray-800 w-full"></div>
            <span className="px-3 text-[10px] text-gray-500 whitespace-nowrap">Build a healthier tomorrow</span>
            <div className="h-px bg-gray-800 w-full"></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
