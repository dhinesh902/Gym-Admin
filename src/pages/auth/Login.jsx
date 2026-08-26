import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen w-full flex bg-white dark:bg-[#0B1120] overflow-hidden">
      
      {/* Left Side - Branding & Visuals (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-900 overflow-hidden">
        {/* Dynamic Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F97316] via-[#ea580c] to-[#9a3412] opacity-95 z-10"></div>
        
        {/* Animated Abstract Shapes */}
        <div className="absolute top-0 left-0 w-full h-full z-10 overflow-hidden">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-white/10 blur-[100px]"
          />
          <motion.div 
            animate={{ scale: [1, 1.3, 1], rotate: [0, -45, 0] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[0%] -right-[20%] w-[60%] h-[60%] rounded-full bg-black/30 blur-[120px]"
          />
        </div>

        {/* Content */}
        <div className="relative z-20 flex flex-col justify-between h-full p-14 text-white w-full">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-3"
          >
            <div className="h-12 w-12 bg-white/20 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center shadow-2xl">
              <Dumbbell className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight">Gym<span className="text-white/80">Admin</span></span>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-md mt-10"
          >
            <motion.h1 variants={itemVariants} className="text-5xl font-extrabold leading-[1.1] mb-6 tracking-tight text-white drop-shadow-sm">
              Power up your <br/><span className="text-white/90">fitness business.</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="text-lg text-white/80 mb-10 font-light leading-relaxed">
              The premium, all-in-one platform to manage members, process payments, and track progress effortlessly.
            </motion.p>
            
            <div className="space-y-5">
              {[
                'Smart member attendance tracking',
                'Automated billing and fast renewals',
                'Advanced performance analytics'
              ].map((text, i) => (
                <motion.div key={i} variants={itemVariants} className="flex items-center gap-4 text-white/90 group">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium tracking-wide">{text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="text-sm text-white/50 tracking-wider uppercase font-semibold"
          >
            &copy; {new Date().getFullYear()} GymAdmin Suite
          </motion.div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative bg-white dark:bg-[#0B1120]">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          
          {/* Mobile Header Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <div className="h-14 w-14 bg-gradient-to-tr from-[#F97316] to-[#FB923C] rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Dumbbell className="h-7 w-7 text-white" />
            </div>
            <span className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">Gym<span className="text-[#F97316]">Admin</span></span>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-2 tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#F97316]">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-[#F97316]" />
                </div>
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="w-full pl-11 pr-4 h-12 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-[#0B1120] focus:border-[#F97316] dark:focus:border-[#F97316] focus:ring-4 focus:ring-[#F97316]/10 shadow-sm rounded-xl outline-none transition-all duration-200 text-slate-800 dark:text-white font-medium"
                  placeholder="admin@gym.com"
                  defaultValue="admin@gym.com"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-2 font-medium">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
                <a href="#" className="text-sm font-bold text-[#F97316] hover:text-orange-700 transition-colors">Forgot password?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#F97316]">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-[#F97316]" />
                </div>
                <input
                  type="password"
                  {...register('password', { required: 'Password is required' })}
                  className="w-full pl-11 pr-4 h-12 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-[#0B1120] focus:border-[#F97316] dark:focus:border-[#F97316] focus:ring-4 focus:ring-[#F97316]/10 shadow-sm rounded-xl outline-none transition-all duration-200 text-slate-800 dark:text-white font-medium"
                  placeholder="••••••••"
                  defaultValue="password123"
                />
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-2 font-medium">{errors.password.message}</p>}
            </div>

            <div className="flex items-center pt-2">
              <input type="checkbox" id="remember" className="h-4 w-4 text-[#F97316] rounded border-slate-300 focus:ring-[#F97316] focus:ring-offset-0 cursor-pointer" />
              <label htmlFor="remember" className="ml-3 block text-sm font-semibold text-slate-600 dark:text-slate-400 cursor-pointer">
                Remember me for 30 days
              </label>
            </div>

            <button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-[#F97316] to-[#FB923C] hover:from-[#ea580c] hover:to-[#f97316] text-white text-base rounded-xl font-bold mt-2 flex items-center justify-center gap-2 group shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300"
            >
              Sign In to Dashboard
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
          </form>

          <div className="mt-12 text-center text-sm font-medium">
            <span className="text-slate-500">Don't have an account? </span>
            <a href="#" className="font-extrabold text-[#F97316] hover:underline underline-offset-2">Request Access</a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
