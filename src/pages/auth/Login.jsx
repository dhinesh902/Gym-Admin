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

  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="h-screen w-full flex bg-slate-50 overflow-hidden font-sans selection:bg-orange-500/30 relative">

      {/* Premium Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Soft Radial Gradient Base */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-slate-50 to-slate-100"></div>

        {/* Modern Dot Pattern */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1.5' fill='%2364748b' fill-opacity='0.2'/%3E%3C/svg%3E")`,
            backgroundSize: '24px 24px',
            WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 10%, black 90%)',
            maskImage: 'radial-gradient(ellipse at center, transparent 10%, black 90%)'
          }}
        ></div>

        {/* Animated Orbs */}
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, -40, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[5%] w-[40vw] h-[40vw] rounded-full bg-orange-400/20 blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -80, 0], y: [0, 80, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[30%] -right-[5%] w-[35vw] h-[35vw] rounded-full bg-rose-400/20 blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, 40, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-violet-400/15 blur-[120px]"
        />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex w-full h-full items-center justify-center">

        <div className="w-full flex items-center justify-center p-6 sm:p-12 relative z-20 h-full">

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[420px] relative"
          >
            {/* Ambient shadow behind the form */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/30 to-rose-500/30 rounded-[2.5rem] blur-2xl opacity-60 pointer-events-none animate-pulse" style={{ animationDuration: '4s' }}></div>

            <div className="relative bg-white/80 backdrop-blur-2xl border border-white shadow-[0_8px_40px_rgb(0,0,0,0.08)] rounded-3xl p-6 sm:p-8">

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full"
              >
                {/* Header Logo */}
                <motion.div variants={itemVariants} className="flex flex-col items-center justify-center gap-3 mb-6">
                  <div className="h-10 w-10 bg-gradient-to-tr from-orange-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 relative group">
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity rounded-2xl"></div>
                    <Dumbbell className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-center">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-1">
                      Gym<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">Admin</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-sm">Welcome back! Please enter your details.</p>
                  </div>
                </motion.div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">Email</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-orange-500">
                        <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                      </div>
                      <input
                        type="email"
                        {...register('email', { required: 'Email is required' })}
                        className="w-full pl-11 pr-4 h-11 bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 rounded-xl outline-none transition-all duration-300 text-slate-800 font-medium placeholder:text-slate-400 shadow-sm"
                        placeholder="admin@gym.com"
                        defaultValue="admin@gym.com"
                      />
                    </div>
                    {errors.email && <p className="text-xs text-rose-500 mt-2 font-medium ml-1 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-rose-500"></span>{errors.email.message}</p>}
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <div className="flex justify-between items-center mb-1.5 ml-1">
                      <label className="block text-sm font-bold text-slate-700">Password</label>
                      <a href="#" className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors">Forgot password?</a>
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-orange-500">
                        <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                      </div>
                      <input
                        type="password"
                        {...register('password', { required: 'Password is required' })}
                        className="w-full pl-11 pr-4 h-11 bg-slate-50/50 border border-slate-200 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 rounded-xl outline-none transition-all duration-300 text-slate-800 font-medium placeholder:text-slate-400 shadow-sm"
                        placeholder="••••••••"
                        defaultValue="password123"
                      />
                    </div>
                    {errors.password && <p className="text-xs text-rose-500 mt-2 font-medium ml-1 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-rose-500"></span>{errors.password.message}</p>}
                  </motion.div>

                  <motion.div variants={itemVariants} className="flex items-center pt-1 ml-1">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        id="remember"
                        className="peer h-4 w-4 appearance-none rounded border border-slate-300 bg-white checked:bg-gradient-to-r checked:from-orange-500 checked:to-rose-500 checked:border-transparent transition-all cursor-pointer focus:ring-2 focus:ring-orange-500/30 focus:ring-offset-0 focus:outline-none shadow-sm"
                      />
                      <svg className="absolute w-2.5 h-2.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <label htmlFor="remember" className="ml-2.5 block text-sm font-medium text-slate-600 cursor-pointer hover:text-slate-900 transition-colors">
                      Remember for 30 days
                    </label>
                  </motion.div>

                  <motion.div variants={itemVariants} className="pt-1">
                    <button
                      type="submit"
                      className="w-full h-11 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-400 hover:to-rose-400 text-white text-base rounded-xl font-bold flex items-center justify-center gap-2 group shadow-[0_4px_20px_rgba(249,115,22,0.3)] hover:shadow-[0_8px_25px_rgba(249,115,22,0.4)] transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      <span>Sign In</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                    </button>
                  </motion.div>
                </form>

                <motion.div variants={itemVariants} className="mt-6 pt-5 border-t border-slate-100 text-center text-sm font-medium">
                  <span className="text-slate-500">Don't have an account? </span>
                  <a href="#" className="font-bold text-orange-500 hover:text-rose-500 transition-colors">Contact Admin</a>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
