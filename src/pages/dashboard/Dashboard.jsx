import React from 'react';
import {
  Users, UserCheck, UserX, UserPlus,
  IndianRupee, TrendingUp, CalendarCheck, Clock, Activity, CreditCard
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';

// --- MOCK DATA ---
const revenueData = [
  { name: 'Jan', revenue: 45000 },
  { name: 'Feb', revenue: 52000 },
  { name: 'Mar', revenue: 48000 },
  { name: 'Apr', revenue: 61000 },
  { name: 'May', revenue: 59000 },
  { name: 'Jun', revenue: 65000 },
  { name: 'Jul', revenue: 72000 },
];

const attendanceData = [
  { time: '6 AM', count: 45 },
  { time: '9 AM', count: 20 },
  { time: '12 PM', count: 15 },
  { time: '3 PM', count: 25 },
  { time: '6 PM', count: 85 },
  { time: '9 PM', count: 30 },
];

const recentMembers = [
  { id: 'MEM-101', name: 'Rahul Sharma', plan: 'Yearly Pro', date: 'Today, 10:30 AM', status: 'Active' },
  { id: 'MEM-102', name: 'Sneha Patel', plan: 'Monthly', date: 'Yesterday', status: 'Active' },
  { id: 'MEM-103', name: 'Amit Kumar', plan: 'Quarterly', date: 'Yesterday', status: 'Pending' },
  { id: 'MEM-104', name: 'Priya Singh', plan: 'Half Yearly', date: '2 days ago', status: 'Active' },
];

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
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Overview Analytics</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Here's what's happening with your gym today.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-outline text-sm">Download Report</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard title="Total Members" value="1,248" icon={Users} trend="12%" trendUp={true} colorClass="bg-primary" />
        <StatCard title="Active Members" value="1,032" icon={UserCheck} trend="5.2%" trendUp={true} colorClass="bg-secondary" />
        <StatCard title="Today's Revenue" value="₹24,500" icon={IndianRupee} trend="8%" trendUp={true} colorClass="bg-accent" />
        <StatCard title="Members Inside" value="42" icon={Activity} trend="2" trendUp={false} colorClass="bg-warning" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Revenue Analytics</h3>
            <select className="input-field py-1 px-3 text-sm w-auto">
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
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
              <BarChart data={attendanceData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
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
