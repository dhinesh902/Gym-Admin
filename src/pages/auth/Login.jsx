import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    if (data.email && data.password) {
      toast.success('Welcome back!');
      navigate('/dashboard');
    }
  };

  return (
    <div className="h-screen w-full flex bg-slate-50 overflow-hidden font-sans selection:bg-orange-500/30">

      {/* Background Animated Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none fixed">
        <div className="absolute top-0 left-0 w-full h-full bg-slate-50"></div>
        {/* Glow 1 */}
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-orange-400/20 blur-[120px]"
        />
        {/* Glow 2 */}
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, 100, 0], scale: [1, 1.5, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[40%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-rose-400/20 blur-[120px]"
        />
        {/* Glow 3 */}
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-violet-400/20 blur-[130px]"
        />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex w-full h-full items-center justify-center">

        {/* Glassmorphic Login Form */}
        <div className="w-full flex items-center justify-center p-6 sm:p-12 relative z-20 h-full">

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="w-full max-w-[400px] relative"
          >
            {/* Ambient shadow behind the form */}
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-rose-500/20 rounded-[2rem] blur-xl opacity-50 pointer-events-none"></div>

            <div className="relative bg-white/80 backdrop-blur-2xl border border-slate-200 shadow-[0_8px_40px_rgb(0,0,0,0.04)] rounded-3xl p-6 sm:p-8">

              {/* Header Logo */}
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="h-10 w-10 bg-gradient-to-tr from-orange-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <Dumbbell className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-black text-slate-800 tracking-tight">Gym<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">Admin</span></span>
              </div>

              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Welcome back</h2>
                <p className="text-slate-500 font-medium text-sm">Enter your credentials to access your dashboard.</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-orange-500">
                      <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                    </div>
                    <input
                      type="email"
                      {...register('email', { required: 'Email is required' })}
                      className="w-full pl-11 pr-4 h-12 bg-white border border-slate-200 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 rounded-xl outline-none transition-all duration-300 text-slate-800 font-medium placeholder:text-slate-400"
                      placeholder="admin@gym.com"
                      defaultValue="admin@gym.com"
                    />
                  </div>
                  {errors.email && <p className="text-xs text-rose-500 mt-2 font-medium ml-1">{errors.email.message}</p>}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5 ml-1">
                    <label className="block text-sm font-semibold text-slate-700">Password</label>
                    <a href="#" className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors">Forgot password?</a>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-orange-500">
                      <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                    </div>
                    <input
                      type="password"
                      {...register('password', { required: 'Password is required' })}
                      className="w-full pl-11 pr-4 h-12 bg-white border border-slate-200 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 rounded-xl outline-none transition-all duration-300 text-slate-800 font-medium placeholder:text-slate-400"
                      placeholder="••••••••"
                      defaultValue="password123"
                    />
                  </div>
                  {errors.password && <p className="text-xs text-rose-500 mt-2 font-medium ml-1">{errors.password.message}</p>}
                </div>

                <div className="flex items-center pt-1 ml-1">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      id="remember"
                      className="peer h-4 w-4 appearance-none rounded border border-slate-300 bg-white checked:bg-gradient-to-r checked:from-orange-500 checked:to-rose-500 checked:border-transparent transition-all cursor-pointer focus:ring-2 focus:ring-orange-500/30 focus:ring-offset-0 focus:outline-none"
                    />
                    <svg className="absolute w-2.5 h-2.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <label htmlFor="remember" className="ml-2.5 block text-sm font-medium text-slate-600 cursor-pointer hover:text-slate-800 transition-colors">
                    Remember me for 30 days
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-400 hover:to-rose-400 text-white text-base rounded-xl font-bold mt-2 flex items-center justify-center gap-2 group shadow-[0_4px_20px_rgba(249,115,22,0.3)] hover:shadow-[0_8px_25px_rgba(249,115,22,0.4)] transition-all duration-300"
                >
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
