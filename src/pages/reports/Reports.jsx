import Loader from '../../components/ui/Loader.jsx';
import React, { useState } from 'react';
import { Download, Users, UserCheck, UserPlus, DollarSign, Calendar, TrendingUp, BarChart3, Activity } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { reportsApi } from '../../services/api';
import { getApiErrorMessage } from '../../services/apiClient';
import { downloadCsv } from '../../utils/exportCsv';

const Reports = () => {
  const [filter, setFilter] = useState('6months');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['reports-analytics', filter],
    queryFn: () => reportsApi.getAnalytics(filter),
    onError: error => toast.error(getApiErrorMessage(error, 'Unable to load reports data.')),
  });

  if (isLoading) return <div className="flex justify-center p-8 w-full"><Loader /></div>;
  if (isError || !data) return <div className="p-8 text-center text-red-500">Failed to load reports data.</div>;

  const { kpis, charts } = data;
  const { totalRevenue = 0, newMembers = 0 } = kpis || {};
  const { revenueBreakdown = [], memberGrowthTrend = [] } = charts || {};

  const handleExport = () => {
    if (!revenueBreakdown || revenueBreakdown.length === 0) {
      toast.error('No data available to export');
      return;
    }
    downloadCsv(revenueBreakdown, `reports-analytics-${filter}.csv`);
    toast.success('Report exported successfully');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans text-white pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0d0e12] p-4 rounded-xl border border-white/5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FBBF24]/5 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h2 className="text-xl font-bold tracking-wide flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#FBBF24]" />
            Reports Overview
          </h2>
          <p className="text-[11px] text-gray-400 mt-0.5 uppercase tracking-wider font-bold">Analytics and performance tracking</p>
        </div>
        <div className="flex flex-wrap gap-3 items-center relative z-10 w-full sm:w-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-gray-500" />
            </div>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-[#16181d] border border-gray-800 rounded-lg h-9 pl-9 pr-8 text-xs font-bold text-gray-300 focus:outline-none focus:border-[#FBBF24] transition-colors shadow-sm cursor-pointer appearance-none outline-none"
            >
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last 1 Year</option>
            </select>
          </div>
          <button 
            onClick={handleExport} 
            className="flex-1 sm:flex-none bg-[#FBBF24] hover:bg-yellow-400 text-black h-9 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FBBF24]/10"
          >
            <Download className="h-4 w-4" /> Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Members', value: '248', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
          { title: 'New Members', value: newMembers || '18', icon: UserPlus, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
          { title: 'Total Revenue', value: `$${totalRevenue.toLocaleString() || '4,860'}`, icon: DollarSign, color: 'text-[#FBBF24]', bg: 'bg-[#FBBF24]/10', border: 'border-[#FBBF24]/20' },
          { title: 'Attendance Rate', value: '81%', icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-[#0d0e12] border border-white/5 hover:border-gray-700 hover:bg-[#16181d] rounded-xl p-5 flex flex-col justify-between transition-all shadow-xl group">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-gray-300 transition-colors">{kpi.title}</h3>
              <div className={`${kpi.bg} ${kpi.border} border p-2 rounded-lg group-hover:scale-110 transition-transform`}>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
            </div>
            <div>
              <p className="text-2xl font-black text-white tracking-wide">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
        
        {/* Member Growth Trend */}
        <div className="bg-[#0d0e12] border border-white/5 rounded-xl p-5 flex flex-col h-full shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex justify-between items-center mb-6 relative z-10">
            <h3 className="text-sm font-bold text-gray-200 flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-400" />
              Member Growth Trend
            </h3>
            <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-1 rounded border border-white/10 font-bold uppercase tracking-wider">
              {filter === '6months' ? 'Last 6 Months' : 'Last 1 Year'}
            </span>
          </div>
          <div className="flex-1 w-full -ml-4 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={memberGrowthTrend}>
                <defs>
                  <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2229" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} width={40} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1d24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '12px', fontWeight: 'bold' }} 
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Area type="monotone" dataKey="members" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorGrowth)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="bg-[#0d0e12] border border-white/5 rounded-xl p-5 flex flex-col h-full shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FBBF24]/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex justify-between items-center mb-6 relative z-10">
            <h3 className="text-sm font-bold text-gray-200 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-[#FBBF24]" />
              Revenue Breakdown
            </h3>
            <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-1 rounded border border-white/10 font-bold uppercase tracking-wider">
              {filter === '6months' ? 'Last 6 Months' : 'Last 1 Year'}
            </span>
          </div>
          <div className="flex-1 w-full -ml-4 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueBreakdown}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2229" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} width={40} dx={-10} />
                <Tooltip 
                  cursor={{fill: '#1a1d24'}} 
                  contentStyle={{ backgroundColor: '#1a1d24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '12px', fontWeight: 'bold' }} 
                  itemStyle={{ color: '#FBBF24' }}
                />
                <Bar dataKey="membership" fill="#FBBF24" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Reports;
