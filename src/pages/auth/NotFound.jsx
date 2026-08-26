import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="h-24 w-24 bg-danger/10 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="h-12 w-12 text-danger" />
      </div>
      <h1 className="text-6xl font-extrabold text-slate-800 dark:text-white mb-4 tracking-tight">404</h1>
      <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">Page Not Found</h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-md text-center mb-8">
        Oops! The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
      </p>
      <button 
        onClick={() => navigate('/dashboard')}
        className="btn-primary flex items-center gap-2"
      >
        <Home className="h-4 w-4" /> Back to Dashboard
      </button>
    </div>
  );
};

export default NotFound;
