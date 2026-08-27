import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  CreditCard,
  CalendarDays,
  Activity,
  Apple,
  TrendingUp,
  FileText,
  Settings,
  Bell,
  LogOut
} from 'lucide-react';

const navGroups = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    ]
  },
  {
    label: 'Management',
    items: [
      { name: 'Members', path: '/members', icon: Users },
      { name: 'Trainers', path: '/trainers', icon: Dumbbell },
      { name: 'Memberships', path: '/memberships', icon: CreditCard },
      { name: 'Attendance', path: '/attendance', icon: CalendarDays },
    ]
  },
  {
    label: 'Fitness',
    items: [
      { name: 'Workouts', path: '/workouts', icon: Activity },
      { name: 'Diet Plans', path: '/diet', icon: Apple },
      { name: 'Progress', path: '/progress', icon: TrendingUp },
    ]
  },
  {
    label: 'Administration',
    items: [
      { name: 'Payments', path: '/payments', icon: CreditCard },
      { name: 'Reports', path: '/reports', icon: FileText },
      { name: 'Notifications', path: '/notifications', icon: Bell },
      { name: 'Settings', path: '/settings', icon: Settings },
    ]
  }
];

const Sidebar = ({ isOpen, closeSidebar }) => {
  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-primary to-secondary border-r-0 flex-shrink-0 flex flex-col h-screen transition-transform duration-300 text-white shadow-2xl lg:shadow-none ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
    >

      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-white/10">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 mr-4">
          <Dumbbell className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            Gym<span className="text-white/90">Admin</span>
          </h1>
          <p className="text-xs text-white/70 font-medium">Management System</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 custom-scrollbar">
        {navGroups.map((group, index) => (
          <div key={index} className="space-y-2">
            <h3 className="px-3 text-xs font-bold uppercase tracking-wider text-white/60 mb-3">
              {group.label}
            </h3>
            <div className="space-y-1.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                      ? 'bg-white text-primary shadow-md shadow-black/5'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center">
                        <item.icon className={`h-5 w-5 mr-3 flex-shrink-0 transition-colors ${isActive ? 'text-primary' : 'text-white/70 group-hover:text-white'}`} />
                        {item.name}
                      </div>
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* User Profile / Status Bottom */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold overflow-hidden">
              <img src="https://ui-avatars.com/api/?name=Admin+User&background=ffffff&color=F97316" alt="Admin" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Admin User</p>
              <p className="text-xs text-white/70">Super Admin</p>
            </div>
          </div>
          <LogOut className="h-5 w-5 text-white/70 group-hover:text-white transition-colors" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
