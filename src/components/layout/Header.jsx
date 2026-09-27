import React from 'react';
import { Search, Bell, Menu, LogOut, Activity } from 'lucide-react';

const Header = ({ toggleSidebar }) => {
  return (
    <header className="h-20 bg-[#0a0a0a]/80 backdrop-blur-xl flex items-center justify-between px-4 sm:px-8 z-10 sticky top-0 border-b border-white/5 shadow-sm">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="p-2.5 mr-4 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 lg:hidden transition-colors border border-white/5"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Hidden on small screens, shown on large */}
        <div className="hidden md:flex flex-col relative w-auto">
          <h1 className="text-lg font-bold text-white tracking-wide flex items-center gap-2.5">
            Overview
            <span className="px-2 py-0.5 rounded text-[10px] bg-[#FBBF24]/10 text-[#FBBF24] border border-[#FBBF24]/20 uppercase tracking-wider font-black flex items-center gap-1.5 shadow-[0_0_10px_rgba(251,191,36,0.1)]">
              <Activity className="h-3 w-3" /> Live
            </span>
          </h1>
          <p className="text-[11px] text-gray-400 font-medium tracking-wide mt-0.5 uppercase">Welcome back, Admin</p>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl bg-[#16181d] text-gray-400 hover:text-white hover:bg-white/10 transition-colors border border-white/5 shadow-sm group">
          <Bell className="h-5 w-5 group-hover:scale-110 transition-transform" />
          <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-red-500 border border-[#0a0a0a] shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
        </button>

        <div className="h-7 w-px bg-white/10 hidden sm:block"></div>

        {/* Profile */}
        <div className="flex items-center space-x-3 group cursor-pointer">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#FBBF24] to-yellow-600 p-0.5 shadow-[0_0_15px_rgba(251,191,36,0.2)]">
            <div className="h-full w-full rounded-full overflow-hidden bg-[#16181d] border-2 border-[#16181d]">
              <img src="https://ui-avatars.com/api/?name=Admin&background=1a1d24&color=FBBF24" alt="Admin" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <p className="text-sm font-bold text-gray-200 group-hover:text-[#FBBF24] transition-colors leading-tight">Admin</p>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Super User</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
          className="flex items-center justify-center h-10 w-10 sm:w-auto sm:px-4 sm:h-10 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-[11px] font-bold transition-all border border-red-500/20 shadow-sm group ml-1"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline uppercase tracking-wider ml-2">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
