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
      className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#0a0a0a] border-r border-gray-800 flex-shrink-0 flex flex-col h-screen transition-transform duration-300 text-white ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
    >
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 mt-2 shrink-0">
        <Dumbbell className="h-6 w-6 text-[#FBBF24] mr-3 fill-current" />
        <h1 className="text-xl font-bold tracking-wide text-white">
          Gym <span className="text-[#FBBF24]">Admin</span>
        </h1>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-2 px-4 space-y-6 custom-scrollbar">
        {navGroups.map((group, index) => (
          <div key={index} className="space-y-1">
            <h3 className="px-4 text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">
              {group.label}
            </h3>
            {group.items.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                    ? 'bg-[#1a1d24] text-[#FBBF24]'
                    : 'text-gray-400 hover:text-white hover:bg-gray-900/50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`h-5 w-5 mr-4 flex-shrink-0 transition-colors ${isActive ? 'text-[#FBBF24]' : 'text-gray-400 group-hover:text-white'}`} />
                    {item.name}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom Poster Area */}
      <div className="p-4 mt-auto shrink-0 hidden lg:block">
        <div className="relative rounded-2xl overflow-hidden h-40 border border-gray-800">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop")' }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
          <div className="absolute bottom-4 left-4 z-10">
            <h3 className="text-[#FBBF24] font-bold text-sm leading-tight">
              Stronger<br />
              <span className="text-white">Members</span><br />
              <span className="text-[#FBBF24]">Healthier</span><br />
              Community
            </h3>
            <div className="w-5 h-1 bg-[#FBBF24] mt-2"></div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
