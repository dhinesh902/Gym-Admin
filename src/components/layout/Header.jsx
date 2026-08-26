import React from 'react';
import { Search, Bell, Menu, Sun, Moon, LogOut } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const pathName = location.pathname.split('/')[1];
  const title = pathName ? pathName.charAt(0).toUpperCase() + pathName.slice(1) : 'Dashboard';

  return (
    <header className="h-16 bg-surface/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 z-10 sticky top-0">
      <div className="flex items-center flex-1">
        <button className="p-2 mr-3 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden">
          <Menu className="h-5 w-5" />
        </button>
        
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white capitalize">{title}</h1>
          <div className="hidden sm:flex text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Admin Panel <span className="mx-2">•</span> {title}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-danger ring-2 ring-surface dark:ring-surface-dark"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative flex items-center ml-2 border-l border-slate-200 dark:border-slate-700 pl-4">
          <button className="flex items-center space-x-2 focus:outline-none">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
              AD
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Admin User</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Owner</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
