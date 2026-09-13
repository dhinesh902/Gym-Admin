import React, { useState, useEffect } from 'react';
import { Target, TrendingDown, TrendingUp, Activity, Search, Calendar, ChevronDown, Plus } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { membersApi, progressApi, toCollection } from '../../services/api';
import dayjs from 'dayjs';

const StatCard = ({ title, value, icon: Icon, trend, trendDownIsGood = true, colorClass }) => {
  const isPositive = trend > 0;
  const isGood = trendDownIsGood ? !isPositive && trend !== 0 : isPositive || trend === 0;
  const displayTrend = trend > 0 ? `+${trend}` : trend;

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
          {displayTrend}
        </span>
        <span className="text-slate-400 ml-2">from last month</span>
      </div>
    </div>
  );
};

const ProgressTracking = () => {
  const [selectedMember, setSelectedMember] = useState('');

  const { data: membersData } = useQuery({ queryKey: ['members'], queryFn: membersApi.list });
  const membersList = toCollection(membersData, ['members', 'items']);

  useEffect(() => {
    if (!selectedMember && membersList && membersList.length > 0) {
      setSelectedMember(membersList[0].id.toString());
    }
  }, [membersList, selectedMember]);

  const { data: overview, isLoading: isLoadingOverview } = useQuery({
    queryKey: ['progress_overview', selectedMember],
    queryFn: () => progressApi.overview(selectedMember),
    enabled: Boolean(selectedMember)
  });

  const { data: history = [], isLoading: isLoadingHistory } = useQuery({
    queryKey: ['progress_history', selectedMember],
    queryFn: () => progressApi.history(selectedMember),
    enabled: Boolean(selectedMember)
  });

  const current = overview?.current || {};
  const trends = overview?.trends || {};

  const chartData = history.map(log => ({
    date: dayjs(log.date).format('MMM DD'),
    weight: log.weight,
    bodyFat: log.bodyFat
  }));

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
              {membersList.map(member => (
                <option key={member.id} value={member.id}>{member.fullname || member.name} (MEM-{member.id})</option>
              ))}
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
        <StatCard title="Current Weight" value={`${current.weight || 0} kg`} icon={Activity} trend={trends.weight || 0} trendDownIsGood={true} colorClass="bg-primary" />
        <StatCard title="Body Fat %" value={`${current.bodyFat || 0} %`} icon={Target} trend={trends.bodyFat || 0} trendDownIsGood={true} colorClass="bg-secondary" />
        <StatCard title="BMI" value={current.bmi || 0} icon={Activity} trend={trends.bmi || 0} trendDownIsGood={true} colorClass="bg-accent" />
        <StatCard title="Muscle Mass" value={`${current.muscleMass || 0} kg`} icon={TrendingUp} trend={trends.muscleMass || 0} trendDownIsGood={false} colorClass="bg-warning" />
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
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                  <p className="font-bold text-slate-800 dark:text-slate-200">{overview?.targetWeight || 0} kg</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-slate-500">Remaining</p>
                <p className="font-bold text-primary">{Math.max(0, (current.weight || 0) - (overview?.targetWeight || 0)).toFixed(1)} kg</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Body Measurements</h4>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Chest</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{current.chest || 0} cm <span className="text-accent text-xs ml-1">{trends.chest > 0 ? `+${trends.chest}` : trends.chest}cm</span></span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Waist</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{current.waist || 0} cm <span className="text-accent text-xs ml-1">{trends.waist > 0 ? `+${trends.waist}` : trends.waist}cm</span></span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Arms</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{current.arms || 0} cm <span className="text-slate-400 text-xs ml-1">{trends.arms > 0 ? `+${trends.arms}` : trends.arms}cm</span></span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Thighs</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{current.thighs || 0} cm <span className="text-accent text-xs ml-1">{trends.thighs > 0 ? `+${trends.thighs}` : trends.thighs}cm</span></span>
              </div>
            </div>
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
              {[...history].reverse().map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    {dayjs(log.date).format('MMM DD, YYYY')}
                  </td>
                  <td className="p-4">{log.weight}</td>
                  <td className="p-4">{log.chest}</td>
                  <td className="p-4">{log.waist}</td>
                  <td className="p-4">{log.arms}</td>
                  <td className="p-4">{log.thighs}</td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">No measurement logs found for this member.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default ProgressTracking;
