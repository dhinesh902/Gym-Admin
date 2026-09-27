import Loader from '../../components/ui/Loader.jsx';
import React, { useMemo, useState } from 'react';
import { Search, Calendar, CheckCircle2, XCircle, MoreVertical, Users, TrendingUp, CalendarDays, XSquare } from 'lucide-react';
import { DataTable } from '../../components/tables/DataTable';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { attendanceApi, trainerAttendanceApi } from '../../services/api';
import { getApiErrorMessage, IMAGE_URL } from '../../services/apiClient';

const AttendanceList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('member'); // 'member' or 'trainer'
  
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`);
  
  const currentYear = parseInt(selectedDate.split('-')[0], 10);
  const currentMonth = parseInt(selectedDate.split('-')[1], 10);

  const { data: memberData, isLoading: isLoadingMember, isError: isErrorMember } = useQuery({
    queryKey: ['attendance', 'member', currentMonth, currentYear],
    queryFn: () => attendanceApi.getAll({ month: currentMonth, year: currentYear }),
    onError: error => toast.error(getApiErrorMessage(error, 'Unable to load member attendance.')),
  });

  const { data: trainerData, isLoading: isLoadingTrainer, isError: isErrorTrainer } = useQuery({
    queryKey: ['attendance', 'trainer', currentMonth, currentYear],
    queryFn: () => trainerAttendanceApi.getAll({ month: currentMonth, year: currentYear }),
    onError: error => toast.error(getApiErrorMessage(error, 'Unable to load trainer attendance.')),
  });

  const currentData = activeTab === 'member' ? memberData : trainerData;
  const summary = currentData?.summary || { totalCheckIns: 0, presentMembers: 0, absentMembers: 0, attendanceRate: 0, presentTrainers: 0, absentTrainers: 0 };
  const dates = currentData?.attendanceDates || [];
  const records = currentData?.records || [];

  const getImageUrl = (path, name) => {
    if (!path) return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=1a1d24&color=FBBF24`;
    if (path.startsWith('http')) return path;
    return `${IMAGE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  };

  const columns = useMemo(() => {
    const baseColumns = [
      {
        id: 'name',
        accessorFn: row => activeTab === 'member' ? row.memberName : row.trainerName,
        header: activeTab === 'member' ? 'Member' : 'Trainer',
        cell: info => {
          const row = info.row.original;
          const name = activeTab === 'member' ? row.memberName : row.trainerName;
          const id = activeTab === 'member' ? row.memberId : row.trainerId;
          return (
            <div className="flex items-center gap-4 py-1">
              <div className="h-10 w-10 rounded-full overflow-hidden border border-gray-700 bg-gray-800 shrink-0 shadow-lg flex items-center justify-center font-bold text-[#FBBF24]">
                {name?.charAt(0) || 'U'}
              </div>
              <div>
                <div className="font-bold text-white tracking-wide truncate max-w-[150px]">{name}</div>
                <div className="text-[11px] text-gray-500 mt-0.5 uppercase tracking-wider">ID: {id}</div>
              </div>
            </div>
          );
        },
      }
    ];

    // Generate date columns dynamically
    const dateColumns = dates.map(dateStr => {
      const dateObj = new Date(dateStr);
      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = dateObj.getDate();

      return {
        id: dateStr,
        header: () => (
          <div className="text-center leading-tight">
            {dayName}<br/><span className="text-[10px]">{dayNum}</span>
          </div>
        ),
        cell: info => {
          const attendanceMap = info.row.original.attendance || {};
          const status = attendanceMap[dateStr]; // true, false, or null
          
          if (status === true) {
            return <div className="flex justify-center"><CheckCircle2 className="h-5 w-5 text-green-500 fill-green-500/20" /></div>;
          } else if (status === false) {
            return <div className="flex justify-center"><XCircle className="h-5 w-5 text-red-500 fill-red-500/20" /></div>;
          } else {
            return <div className="flex justify-center"><div className="h-5 w-5 rounded-full border-2 border-gray-800 bg-gray-900"></div></div>;
          }
        }
      };
    });

    return [...baseColumns, ...dateColumns];
  }, [dates, activeTab]);

  const isLoading = activeTab === 'member' ? isLoadingMember : isLoadingTrainer;
  const isError = activeTab === 'member' ? isErrorMember : isErrorTrainer;

  const filteredRecords = records.filter(row => {
    const name = activeTab === 'member' ? row.memberName : row.trainerName;
    const id = activeTab === 'member' ? row.memberId : row.trainerId;
    const term = searchTerm.toLowerCase();
    return name?.toLowerCase().includes(term) || id?.toString().includes(term);
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh] w-full">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans text-white pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-wide">Attendance</h2>
          <p className="text-sm text-gray-400 mt-1">Track member and trainer attendance</p>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-4 w-4 text-[#FBBF24]" />
          </div>
          <input
            type="month"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-[#16181d] border border-gray-800/80 rounded-xl h-10 pl-9 pr-3 text-sm font-bold text-gray-200 focus:outline-none focus:border-[#FBBF24] transition-colors shadow-sm cursor-pointer appearance-none uppercase tracking-wider"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#16181d] border border-gray-800/60 rounded-2xl p-5 flex items-center gap-5 shadow-lg group hover:border-[#FBBF24]/30 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <CalendarDays className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Total Check-ins</p>
            <h3 className="text-2xl font-bold text-white">{summary.totalCheckIns || 0}</h3>
          </div>
        </div>

        <div className="bg-[#16181d] border border-gray-800/60 rounded-2xl p-5 flex items-center gap-5 shadow-lg group hover:border-[#FBBF24]/30 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Users className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Present {activeTab === 'member' ? 'Members' : 'Trainers'}</p>
            <h3 className="text-2xl font-bold text-white">{activeTab === 'member' ? (summary.presentMembers || 0) : (summary.presentTrainers || 0)}</h3>
          </div>
        </div>

        <div className="bg-[#16181d] border border-gray-800/60 rounded-2xl p-5 flex items-center gap-5 shadow-lg group hover:border-[#FBBF24]/30 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <XSquare className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Absent {activeTab === 'member' ? 'Members' : 'Trainers'}</p>
            <h3 className="text-2xl font-bold text-white">{activeTab === 'member' ? (summary.absentMembers || 0) : (summary.absentTrainers || 0)}</h3>
          </div>
        </div>

        <div className="bg-[#16181d] border border-gray-800/60 rounded-2xl p-5 flex items-center gap-5 shadow-lg group hover:border-[#FBBF24]/30 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-[#FBBF24]/10 border border-[#FBBF24]/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <TrendingUp className="h-6 w-6 text-[#FBBF24]" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Attendance Rate</p>
            <h3 className="text-2xl font-bold text-white">{summary.attendanceRate || 0}%</h3>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 mt-4">
        <button 
          onClick={() => setActiveTab('member')}
          className={`px-5 py-2.5 rounded-xl text-[11px] uppercase tracking-wider font-bold transition-all shadow-sm ${activeTab === 'member' ? 'bg-[#FBBF24] text-black shadow-[0_0_15px_rgba(251,191,36,0.3)]' : 'bg-[#16181d] text-gray-400 border border-gray-800 hover:text-white'}`}
        >
          Member Attendance
        </button>
        <button 
          onClick={() => setActiveTab('trainer')}
          className={`px-5 py-2.5 rounded-xl text-[11px] uppercase tracking-wider font-bold transition-all shadow-sm ${activeTab === 'trainer' ? 'bg-[#FBBF24] text-black shadow-[0_0_15px_rgba(251,191,36,0.3)]' : 'bg-[#16181d] text-gray-400 border border-gray-800 hover:text-white'}`}
        >
          Trainer Attendance
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center w-full mt-2">
        <div className="relative flex-1 w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-500" />
          </div>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#16181d] border border-gray-800/80 rounded-xl h-11 pl-11 pr-4 text-sm text-gray-300 placeholder:text-gray-500 focus:outline-none focus:border-[#FBBF24] transition-colors shadow-sm"
            placeholder={`Search by name or ID...`}
          />
        </div>
      </div>

      {/* Data Table Wrapper with horizontal scrolling for many dates */}
      <div className="relative bg-[#0d0e12] rounded-xl border border-gray-800 overflow-hidden shadow-2xl min-h-[400px]">
        {isError ? (
          <div className="flex justify-center items-center h-[400px] w-full">
            <p className="text-sm text-red-500 bg-red-500/10 p-4 rounded-lg border border-red-500/20">Unable to load attendance data.</p>
          </div>
        ) : (
          <div className="overflow-x-auto overflow-y-hidden custom-scrollbar">
            <div className="min-w-full inline-block align-middle">
              <DataTable
                columns={columns}
                data={filteredRecords}
                searchPlaceholder="" // Hide internal search
              />
            </div>
          </div>
        )}
      </div>

      {!isError && filteredRecords.length === 0 && (
        <div className="p-12 text-center text-gray-500">
          <p>No attendance records found for this period.</p>
        </div>
      )}

    </div>
  );
};

export default AttendanceList;
