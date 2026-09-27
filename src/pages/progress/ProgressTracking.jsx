import React, { useState, useEffect } from 'react';
import { Target, TrendingDown, TrendingUp, Activity, Search, Calendar, ChevronDown, Plus } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { membersApi, progressApi, toCollection } from '../../services/api';
import dayjs from 'dayjs';
import Loader from '../../components/ui/Loader.jsx';

const StatCard = ({ title, value, icon: Icon, trend, trendDownIsGood = true }) => {
  const isPositive = trend > 0;
  const isGood = trendDownIsGood ? !isPositive && trend !== 0 : isPositive || trend === 0;
  const displayTrend = trend > 0 ? `+${trend}` : trend;

  return (
    <div className="bg-[#16181d] border border-gray-800/60 rounded-xl p-5 flex flex-col justify-between transition-transform hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(251,191,36,0.05)]">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs font-medium text-gray-400 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-50 tracking-wide">{value}</h3>
        </div>
        <div className="bg-[#242013] p-2 rounded-lg border border-[#3b3117]">
          <Icon className="h-5 w-5 text-[#FBBF24]" />
        </div>
      </div>
      <div className="flex items-center text-[10px]">
        <span className={`font-bold ${isGood ? 'text-emerald-400' : 'text-red-400'}`}>
          {displayTrend}
        </span>
        <span className="text-gray-500 ml-1.5">vs last month</span>
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
    <div className="space-y-6 animate-in fade-in duration-500 font-sans text-white pb-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0d0e12] p-4 rounded-xl border border-white/5 shadow-lg">
        <div>
          <h2 className="text-xl font-bold tracking-wide">Progress Tracking</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">Monitor member body metrics and fitness goals</p>
        </div>

        {/* Member Selector */}
        <div className="flex gap-3 items-center w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-500" />
            </div>
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="w-full bg-[#16181d] border border-gray-800 rounded-md h-9 pl-9 pr-8 text-xs text-gray-300 focus:outline-none focus:border-[#FBBF24] appearance-none cursor-pointer"
            >
              {membersList.map(member => (
                <option key={member.id} value={member.id}>{member.fullname || member.name} (MEM-{member.id})</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      {(isLoadingOverview || isLoadingHistory) && (
        <div className="flex justify-center p-12 w-full"><Loader /></div>
      )}

      {!isLoadingOverview && !isLoadingHistory && (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Current Weight" value={`${current.weight || 0} kg`} icon={Activity} trend={trends.weight || 0} trendDownIsGood={true} />
            <StatCard title="Body Fat %" value={`${current.bodyFat || 0} %`} icon={Target} trend={trends.bodyFat || 0} trendDownIsGood={true} />
            <StatCard title="BMI" value={current.bmi || 0} icon={Activity} trend={trends.bmi || 0} trendDownIsGood={true} />
            <StatCard title="Muscle Mass" value={`${current.muscleMass || 0} kg`} icon={TrendingUp} trend={trends.muscleMass || 0} trendDownIsGood={false} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Chart */}
            <div className="bg-[#16181d] border border-gray-800/60 rounded-xl p-5 lg:col-span-2 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-gray-300">Weight Progression</h3>
                <span className="text-[10px] text-gray-500 bg-black/20 px-2 py-0.5 rounded border border-gray-800">Last 6 Months</span>
              </div>
              <div className="h-[280px] w-full -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2229" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 10 }} dy={10} />
                    <YAxis yAxisId="left" domain={['dataMin - 5', 'dataMax + 5']} axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 10 }} width={45} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1a1d24', borderRadius: '8px', border: '1px solid #374151', color: '#fff' }}
                      itemStyle={{ color: '#FBBF24', fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '15px', color: '#9ca3af' }} />
                    <Line yAxisId="left" type="monotone" name="Weight (kg)" dataKey="weight" stroke="#FBBF24" strokeWidth={3} dot={{ r: 4, fill: '#1a1d24', strokeWidth: 2, stroke: '#FBBF24' }} activeDot={{ r: 6, fill: '#FBBF24' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* BMI & Goal Summary */}
            <div className="bg-[#16181d] border border-gray-800/60 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-300 mb-5">Fitness Goal</h3>
                <div className="flex items-center justify-between p-4 bg-[#0d0e12] rounded-xl mb-6 border border-white/5 shadow-inner">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#242013] rounded-lg border border-[#3b3117]">
                      <Target className="h-5 w-5 text-[#FBBF24]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-gray-500">Target Weight</p>
                      <p className="font-bold text-gray-200">{overview?.targetWeight || 0} kg</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-medium text-gray-500">Remaining</p>
                    <p className="font-bold text-[#FBBF24]">{Math.max(0, (current.weight || 0) - (overview?.targetWeight || 0)).toFixed(1)} kg</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-3">Body Measurements</h4>
                  <div className="flex justify-between text-xs pb-3 border-b border-gray-800/50">
                    <span className="text-gray-500 font-medium">Chest</span>
                    <span className="font-bold text-gray-300">{current.chest || 0} cm <span className={`text-[10px] ml-1.5 ${trends.chest > 0 ? 'text-red-400' : trends.chest < 0 ? 'text-emerald-400' : 'text-gray-500'}`}>{trends.chest > 0 ? `+${trends.chest}` : trends.chest}cm</span></span>
                  </div>
                  <div className="flex justify-between text-xs pb-3 border-b border-gray-800/50">
                    <span className="text-gray-500 font-medium">Waist</span>
                    <span className="font-bold text-gray-300">{current.waist || 0} cm <span className={`text-[10px] ml-1.5 ${trends.waist > 0 ? 'text-red-400' : trends.waist < 0 ? 'text-emerald-400' : 'text-gray-500'}`}>{trends.waist > 0 ? `+${trends.waist}` : trends.waist}cm</span></span>
                  </div>
                  <div className="flex justify-between text-xs pb-3 border-b border-gray-800/50">
                    <span className="text-gray-500 font-medium">Arms</span>
                    <span className="font-bold text-gray-300">{current.arms || 0} cm <span className={`text-[10px] ml-1.5 ${trends.arms > 0 ? 'text-emerald-400' : trends.arms < 0 ? 'text-red-400' : 'text-gray-500'}`}>{trends.arms > 0 ? `+${trends.arms}` : trends.arms}cm</span></span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 font-medium">Thighs</span>
                    <span className="font-bold text-gray-300">{current.thighs || 0} cm <span className={`text-[10px] ml-1.5 ${trends.thighs > 0 ? 'text-emerald-400' : trends.thighs < 0 ? 'text-red-400' : 'text-gray-500'}`}>{trends.thighs > 0 ? `+${trends.thighs}` : trends.thighs}cm</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* History Table */}
          <div className="bg-[#16181d] border border-gray-800/60 rounded-xl overflow-hidden mt-6">
            <div className="p-4 border-b border-gray-800/60 flex justify-between items-center bg-[#0d0e12]/50">
              <h3 className="text-sm font-bold text-gray-300">Measurement Logs</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-800 bg-[#0d0e12]/30">
                    <th className="p-3.5 font-medium uppercase tracking-wider">Date</th>
                    <th className="p-3.5 font-medium uppercase tracking-wider">Weight (kg)</th>
                    <th className="p-3.5 font-medium uppercase tracking-wider">Chest (cm)</th>
                    <th className="p-3.5 font-medium uppercase tracking-wider">Waist (cm)</th>
                    <th className="p-3.5 font-medium uppercase tracking-wider">Arms (cm)</th>
                    <th className="p-3.5 font-medium uppercase tracking-wider">Thighs (cm)</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  {[...history].reverse().map((log) => (
                    <tr key={log.id} className="border-b border-gray-800/50 last:border-0 hover:bg-white/5 transition-colors">
                      <td className="p-3.5 font-bold text-gray-200 flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-[#FBBF24]" />
                        {dayjs(log.date).format('MMM DD, YYYY')}
                      </td>
                      <td className="p-3.5 font-medium">{log.weight}</td>
                      <td className="p-3.5">{log.chest}</td>
                      <td className="p-3.5">{log.waist}</td>
                      <td className="p-3.5">{log.arms}</td>
                      <td className="p-3.5">{log.thighs}</td>
                    </tr>
                  ))}
                  {history.length === 0 && (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-gray-500">No measurement logs found for this member.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default ProgressTracking;
