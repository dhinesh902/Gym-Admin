import React, { useState } from 'react';
import {
  Users, Dumbbell, Calendar, CreditCard, CalendarCheck, TrendingUp
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { dashboardApi } from '../../services/api';
import { getApiErrorMessage } from '../../services/apiClient';

// --- COMPONENTS ---
const StatCard = ({ title, value, icon: Icon, trend }) => (
  <div className="bg-[#16181d] border border-gray-800/60 rounded-xl p-5 flex flex-col gap-4 transition-transform hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(251,191,36,0.05)]">
    <div className="w-10 h-10 rounded-lg bg-[#242013] border border-[#3b3117] flex items-center justify-center">
      <Icon className="h-5 w-5 text-[#FBBF24] fill-[#FBBF24]/20" />
    </div>
    <div>
      <p className="text-xs font-medium text-gray-400 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-white tracking-wide">{value}</h3>
    </div>
    <div className="flex items-center text-[10px]">
      <span className="text-green-500 font-medium tracking-wide">↑ {trend}%</span>
      <span className="text-gray-500 ml-1.5">from last month</span>
    </div>
  </div>
);

const Dashboard = () => {
  const [filter, setFilter] = useState('Last 6 Months');

  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ['dashboard', 'stats', filter],
    queryFn: () => dashboardApi.stats(filter),
    onError: (error) => toast.error(getApiErrorMessage(error, 'Unable to load dashboard statistics.')),
  });

  const { kpis = {}, revenueAnalytics = [], peakHours = [] } = stats;
  const totalMembers = kpis.totalMembers ?? 0;
  const activeMembers = kpis.activeMembers ?? 0;
  const totalRevenue = kpis.totalRevenue ?? 0;

  return (
    <div className="space-y-6 bg-[#0a0a0a] min-h-full font-sans text-white">

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide">Dashboard</h2>
          <p className="text-sm text-gray-400 mt-1">Here's what's happening at your gym today</p>
        </div>
        <div className="flex items-center gap-2 bg-[#16181d] border border-gray-800 rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-800 transition-colors">
          <CalendarCheck className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-300">Apr 26, 2025</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard title="Total Members" value={isLoading ? '...' : totalMembers.toLocaleString()} icon={Users} trend="12" />
        <StatCard title="Active Members" value={isLoading ? '...' : activeMembers.toLocaleString()} icon={Dumbbell} trend="10" />
        <StatCard title="Classes Today" value="8" icon={Calendar} trend="33" />
        <StatCard title="Total Revenue" value={isLoading ? '...' : `$${totalRevenue.toLocaleString()}`} icon={CreditCard} trend="18" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Member Growth Chart */}
        <div className="bg-[#16181d] border border-gray-800/60 rounded-xl p-5 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-gray-400" />
              <h3 className="text-sm font-bold text-white">Member Growth</h3>
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent text-xs text-gray-400 focus:outline-none cursor-pointer"
            >
              <option value="Last 6 Months" className="bg-[#16181d]">Last 6 Months</option>
              <option value="This Year" className="bg-[#16181d]">This Year</option>
            </select>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueAnalytics} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FBBF24" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#FBBF24" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2229" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 10 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1d24', borderRadius: '8px', border: '1px solid #374151', color: '#fff' }}
                  itemStyle={{ color: '#FBBF24' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#FBBF24" strokeWidth={2} fillOpacity={1} fill="url(#colorGrowth)" dot={{ r: 3, fill: '#FBBF24', strokeWidth: 0 }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Peak Hours Activity (Styled to match the dark theme) */}
        <div className="bg-[#16181d] border border-gray-800/60 rounded-xl p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-4 w-4 text-gray-400" />
            <h3 className="text-sm font-bold text-white">Peak Hours Activity</h3>
          </div>
          <div className="h-[250px] w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakHours} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2229" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 10 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1a1d24', borderRadius: '8px', border: '1px solid #374151', color: '#fff' }} cursor={{ fill: '#1f2229' }} />
                <Bar dataKey="count" fill="#374151" activeBar={{ fill: '#FBBF24' }} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Dashboard;
