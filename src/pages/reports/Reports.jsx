import React from 'react';
import { Download, TrendingUp, Users, CreditCard } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from 'recharts';

const monthlyRevenue = [
  { name: 'Jan', membership: 40000, PT: 15000 },
  { name: 'Feb', membership: 45000, PT: 12000 },
  { name: 'Mar', membership: 42000, PT: 18000 },
  { name: 'Apr', membership: 55000, PT: 22000 },
  { name: 'May', membership: 52000, PT: 20000 },
  { name: 'Jun', membership: 60000, PT: 25000 },
];

const Reports = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Analytics & Reports</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Detailed financial and performance reports.</p>
        </div>
        <div className="flex gap-2">
          <select className="input-field py-2 text-sm w-auto bg-white dark:bg-slate-900">
            <option>Last 6 Months</option>
            <option>This Year</option>
            <option>Last Year</option>
          </select>
          <button className="btn-primary text-sm flex items-center gap-2">
            <Download className="h-4 w-4" /> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-5 flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Revenue (6m)</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">₹4,26,000</h3>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="p-3 bg-secondary/10 rounded-xl text-secondary">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">New Members (6m)</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">142</h3>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-4">
          <div className="p-3 bg-accent/10 rounded-xl text-accent">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Avg. Retention Rate</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">84%</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Breakdown */}
        <div className="card p-5">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Revenue Breakdown (Membership vs PT)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Bar dataKey="membership" name="Memberships" stackId="a" fill="#F97316" radius={[0, 0, 4, 4]} />
                <Bar dataKey="PT" name="Personal Training" stackId="a" fill="#FB923C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Member Growth */}
        <div className="card p-5">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Member Growth Trend</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '8px' }} />
                <Line type="monotone" dataKey="membership" name="Total Members" stroke="#F97316" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Reports;
