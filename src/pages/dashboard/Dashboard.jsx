import React, { useState } from 'react';
import {
  Users, Dumbbell, Calendar, CreditCard, CalendarCheck, TrendingUp, Activity
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { dashboardApi } from '../../services/api';
import { getApiErrorMessage } from '../../services/apiClient';

// --- COMPONENTS ---
const StatCard = ({ title, value, icon: Icon, trend, colorClass = "text-[#FBBF24]", bgClass = "bg-[#FBBF24]/10", borderClass = "border-[#FBBF24]/20", shadowClass = "shadow-[0_0_15px_rgba(251,191,36,0.1)]" }) => (
  <div className="relative bg-gradient-to-b from-[#16181d] to-[#0a0a0a] border border-white/5 rounded-[1.5rem] p-6 flex flex-col gap-5 transition-all duration-500 hover:-translate-y-2 hover:border-white/10 hover:shadow-2xl overflow-hidden group">
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-50 transition-opacity group-hover:opacity-100 ${bgClass.replace('/10', '/5')}`}></div>
    
    <div className="flex justify-between items-start relative z-10">
      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${bgClass} ${borderClass} ${shadowClass}`}>
        <Icon className={`h-6 w-6 ${colorClass}`} />
      </div>
      <div className="flex items-center gap-1 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-lg">
        <TrendingUp className="h-3 w-3 text-green-400" />
        <span className="text-xs font-bold text-green-400">{trend}%</span>
      </div>
    </div>
    
    <div className="relative z-10 mt-2">
      <h3 className="text-3xl font-black text-white tracking-tight mb-1">{value}</h3>
      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">{title}</p>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 p-3 rounded-xl shadow-2xl">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }}></div>
            <p className="text-sm font-black text-white">
              {entry.name === 'revenue' ? '$' : ''}{entry.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

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
    <div className="space-y-6 bg-[#0a0a0a] min-h-full font-sans text-white animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0d0e12] p-5 rounded-2xl border border-white/5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#FBBF24]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-black text-white tracking-wide">Dashboard Analytics</h2>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">Here's what's happening at your gym today</p>
        </div>
        <div className="flex items-center gap-3 bg-[#16181d] border border-gray-800 rounded-xl px-4 py-2.5 shadow-inner relative z-10">
          <CalendarCheck className="h-4 w-4 text-[#FBBF24]" />
          <span className="text-xs font-bold text-gray-200 uppercase tracking-wider">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Members" 
          value={isLoading ? '...' : totalMembers.toLocaleString()} 
          icon={Users} 
          trend="12" 
          colorClass="text-blue-400"
          bgClass="bg-blue-500/10"
          borderClass="border-blue-500/20"
          shadowClass="shadow-[0_0_15px_rgba(59,130,246,0.1)]"
        />
        <StatCard 
          title="Active Members" 
          value={isLoading ? '...' : activeMembers.toLocaleString()} 
          icon={Activity} 
          trend="10" 
          colorClass="text-emerald-400"
          bgClass="bg-emerald-500/10"
          borderClass="border-emerald-500/20"
          shadowClass="shadow-[0_0_15px_rgba(16,185,129,0.1)]"
        />
        <StatCard 
          title="Classes Today" 
          value="8" 
          icon={Calendar} 
          trend="33" 
          colorClass="text-purple-400"
          bgClass="bg-purple-500/10"
          borderClass="border-purple-500/20"
          shadowClass="shadow-[0_0_15px_rgba(168,85,247,0.1)]"
        />
        <StatCard 
          title="Total Revenue" 
          value={isLoading ? '...' : `$${totalRevenue.toLocaleString()}`} 
          icon={CreditCard} 
          trend="18" 
          colorClass="text-[#FBBF24]"
          bgClass="bg-[#FBBF24]/10"
          borderClass="border-[#FBBF24]/20"
          shadowClass="shadow-[0_0_15px_rgba(251,191,36,0.1)]"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Growth Chart */}
        <div className="bg-gradient-to-b from-[#16181d] to-[#0a0a0a] border border-white/5 rounded-[1.5rem] p-6 lg:col-span-2 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FBBF24]/5 rounded-full blur-3xl pointer-events-none transition-opacity opacity-50 group-hover:opacity-100"></div>
          
          <div className="flex justify-between items-center mb-8 relative z-10">
            <div className="flex items-center gap-3">
              <div className="bg-[#FBBF24]/10 p-2 rounded-lg border border-[#FBBF24]/20">
                <TrendingUp className="h-4 w-4 text-[#FBBF24]" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Revenue Growth</h3>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Monthly Performance</p>
              </div>
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-[#16181d] border border-gray-800 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-300 focus:outline-none focus:border-[#FBBF24] transition-colors shadow-sm cursor-pointer"
            >
              <option value="Last 6 Months">Last 6 Months</option>
              <option value="This Year">This Year</option>
            </select>
          </div>
          
          <div className="h-[280px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueAnalytics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FBBF24" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#FBBF24" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2229" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 'bold' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 'bold' }} tickFormatter={(val) => `$${val}`} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#FBBF24', strokeWidth: 1, strokeDasharray: '3 3' }} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  name="revenue"
                  stroke="#FBBF24" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorGrowth)" 
                  dot={{ r: 4, fill: '#16181d', strokeWidth: 2, stroke: '#FBBF24' }} 
                  activeDot={{ r: 6, fill: '#FBBF24', stroke: '#fff', strokeWidth: 2, shadow: '0 0 10px #FBBF24' }} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Peak Hours Activity */}
        <div className="bg-gradient-to-b from-[#16181d] to-[#0a0a0a] border border-white/5 rounded-[1.5rem] p-6 shadow-2xl relative overflow-hidden group flex flex-col">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none transition-opacity opacity-50 group-hover:opacity-100"></div>
          
          <div className="flex items-center gap-3 mb-8 relative z-10">
            <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
              <Users className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Peak Hours</h3>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Foot Traffic Analysis</p>
            </div>
          </div>
          
          <div className="h-[280px] w-full flex-1 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakHours} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2229" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 'bold' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 'bold' }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1f2229', opacity: 0.4 }} />
                <Bar dataKey="count" name="Members" radius={[4, 4, 0, 0]}>
                  {peakHours.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === Math.floor(peakHours.length / 2) ? "url(#barGradient)" : "#272a35"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
      
    </div>
  );
};

export default Dashboard;
