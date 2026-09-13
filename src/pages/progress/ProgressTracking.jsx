import React, { useState } from 'react';
import { Target, TrendingDown, TrendingUp, Activity, Search, Calendar, ChevronDown } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const progressData = [
  { date: 'Jan 01', weight: 85.5, bodyFat: 24.5 },
  { date: 'Feb 01', weight: 84.0, bodyFat: 23.8 },
  { date: 'Mar 01', weight: 82.5, bodyFat: 23.0 },
  { date: 'Apr 01', weight: 81.2, bodyFat: 22.1 },
  { date: 'May 01', weight: 79.8, bodyFat: 21.3 },
  { date: 'Jun 01', weight: 78.5, bodyFat: 20.5 },
  { date: 'Jul 01', weight: 77.0, bodyFat: 19.8 },
];

const measurementLogs = [
  { id: 1, date: '2026-07-01', weight: 77.0, chest: 102, arms: 36, waist: 84, thighs: 58 },
  { id: 2, date: '2026-06-01', weight: 78.5, chest: 103, arms: 36, waist: 86, thighs: 59 },
  { id: 3, date: '2026-05-01', weight: 79.8, chest: 104, arms: 35.5, waist: 88, thighs: 60 },
  { id: 4, date: '2026-04-01', weight: 81.2, chest: 105, arms: 35, waist: 90, thighs: 61 },
];

const StatCard = ({ title, value, icon: Icon, trend, trendDownIsGood = true, colorClass }) => {
  const isPositive = trend.startsWith('+');
  const isGood = trendDownIsGood ? !isPositive : isPositive;
  
  return (
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
        <span className={`font-medium ${isGood ? 'text-accent' : 'text-danger'}`}>
          {trend}
        </span>
        <span className="text-slate-400 ml-2">from last month</span>
      </div>
    </div>
  );
};

const ProgressTracking = () => {
  const [selectedMember, setSelectedMember] = useState('John Doe');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Progress Tracking</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Monitor member body metrics and fitness goals.</p>
        </div>
        
        {/* Member Selector (Mock) */}
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <select 
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="input-field pl-9 appearance-none"
            >
              <option value="John Doe">John Doe (MEM-001)</option>
              <option value="Jane Smith">Jane Smith (MEM-002)</option>
              <option value="Mike Johnson">Mike Johnson (MEM-003)</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </div>
          </div>
          <button className="btn-primary text-sm whitespace-nowrap">
            Log Metrics
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard title="Current Weight" value="77.0 kg" icon={Activity} trend="-1.5 kg" trendDownIsGood={true} colorClass="bg-primary" />
        <StatCard title="Body Fat %" value="19.8 %" icon={Target} trend="-0.7 %" trendDownIsGood={true} colorClass="bg-secondary" />
        <StatCard title="BMI" value="23.4" icon={Activity} trend="-0.4" trendDownIsGood={true} colorClass="bg-accent" />
        <StatCard title="Muscle Mass" value="38.5 kg" icon={TrendingUp} trend="+0.2 kg" trendDownIsGood={false} colorClass="bg-warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Weight Progression</h3>
            <select className="input-field py-1 px-3 text-sm w-auto">
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis yAxisId="left" domain={['dataMin - 5', 'dataMax + 5']} axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" />
                <Line yAxisId="left" type="monotone" name="Weight (kg)" dataKey="weight" stroke="#F97316" strokeWidth={3} dot={{ r: 4, fill: '#F97316', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BMI & Goal Summary */}
        <div className="card p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Fitness Goal</h3>
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl mb-4 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Target Weight</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200">72.0 kg</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-500">Remaining</p>
                <p className="font-bold text-primary">5.0 kg</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Body Measurements</h4>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Chest</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">102 cm <span className="text-accent text-xs ml-1">-1cm</span></span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Waist</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">84 cm <span className="text-accent text-xs ml-1">-2cm</span></span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Arms</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">36 cm <span className="text-slate-400 text-xs ml-1">0cm</span></span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Thighs</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">58 cm <span className="text-accent text-xs ml-1">-1cm</span></span>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <button className="w-full btn-outline text-sm py-2 text-center">View Full Report</button>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Measurement Logs</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Weight (kg)</th>
                <th className="p-4 font-medium">Chest (cm)</th>
                <th className="p-4 font-medium">Waist (cm)</th>
                <th className="p-4 font-medium">Arms (cm)</th>
                <th className="p-4 font-medium">Thighs (cm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
              {measurementLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    {log.date}
                  </td>
                  <td className="p-4">{log.weight}</td>
                  <td className="p-4">{log.chest}</td>
                  <td className="p-4">{log.waist}</td>
                  <td className="p-4">{log.arms}</td>
                  <td className="p-4">{log.thighs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default ProgressTracking;
