import React, { useState } from 'react';
import {
  Users, UserCheck, UserX, UserPlus,
  IndianRupee, TrendingUp, CalendarCheck, Clock, Activity, CreditCard
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { dashboardApi } from '../../services/api';
import { getApiErrorMessage } from '../../services/apiClient';
import { downloadCsv } from '../../utils/exportCsv';

// --- COMPONENTS ---
const StatCard = ({ title, value, icon: Icon, trend, trendUp, colorClass }) => (
  <div className="card p-5 relative overflow-hidden group">
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-150 ${colorClass}`}></div>
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10 dark:bg-opacity-20`}>
        <Icon className={`h-6 w-6 ${colorClass.replace('bg-', 'text-')}`} />
      </div>
    </div>
    <div className="flex items-center text-xs">
      <span className={`font-medium ${trendUp ? 'text-accent' : 'text-danger'}`}>
        {trendUp ? '+' : '-'}{trend}
      </span>
      <span className="text-slate-400 ml-2">from last month</span>
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

  const handleExport = () => {
    if (!revenueAnalytics || revenueAnalytics.length === 0) {
      toast.error('No data available to export');
      return;
    }
    downloadCsv(revenueAnalytics, `dashboard-revenue-${filter.replace(/\s+/g, '-').toLowerCase()}.csv`);
    toast.success('Dashboard report exported successfully');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Overview Analytics</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Here's what's happening with your gym today.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} className="btn-outline text-sm">Download Report</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <StatCard title="Total Revenue" value={isLoading ? '...' : `₹${totalRevenue.toLocaleString()}`} icon={IndianRupee} trend="8.5%" trendUp={true} colorClass="bg-accent" />
        <StatCard title="Total Members" value={isLoading ? '...' : totalMembers.toLocaleString()} icon={Users} trend="12%" trendUp={true} colorClass="bg-primary" />
        <StatCard title="Active Members" value={isLoading ? '...' : activeMembers.toLocaleString()} icon={UserCheck} trend="5.2%" trendUp={true} colorClass="bg-secondary" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Revenue Analytics</h3>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input-field py-1 px-3 text-sm w-auto"
            >
              <option value="Last 6 Months">Last 6 Months</option>
              <option value="This Year">This Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueAnalytics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Peak Hours Chart */}
        <div className="card p-5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Peak Hours</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakHours} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="count" fill="#FB923C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
