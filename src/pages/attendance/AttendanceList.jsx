import React, { useMemo } from 'react';
import { } from 'lucide-react';
import { DataTable } from '../../components/tables/DataTable';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { attendanceApi, membersApi, toCollection } from '../../services/api';
import { getApiErrorMessage } from '../../services/apiClient';

const AttendanceList = () => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm({ defaultValues: { date: new Date().toISOString().split('T')[0] } });
  const { data, isLoading, isError } = useQuery({
    queryKey: ['attendance'],
    queryFn: attendanceApi.list,
    onError: error => toast.error(getApiErrorMessage(error, 'Unable to load attendance.')),
  });
  const { data: membersData } = useQuery({ queryKey: ['members'], queryFn: membersApi.list });
  const attendance = toCollection(data, ['attendance', 'records', 'items']);
  const members = toCollection(membersData, ['members', 'items']);
  const checkIn = useMutation({
    mutationFn: attendanceApi.checkIn,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['attendance'] }); queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] }); reset(); toast.success('Attendance marked successfully.'); },
    onError: error => toast.error(getApiErrorMessage(error, 'Unable to mark attendance.')),
  });
  const onSubmit = (formData) => {
    const payload = { memberId: Number(formData.memberId), date: formData.date };
    if (formData.checkInTime) payload.checkInTime = formData.checkInTime;
    if (formData.checkOutTime) payload.checkOutTime = formData.checkOutTime;
    checkIn.mutate(payload);
  };

  const columns = useMemo(() => [
    { accessorKey: 'Member', header: 'Member Name', cell: info => <div className="font-bold text-slate-800 dark:text-slate-200">{info.row.original.Member?.fullname || 'Unknown'}</div> },
    { accessorKey: 'date', header: 'Date', cell: info => <span className="text-slate-600 dark:text-slate-400">{info.getValue() ? new Date(info.getValue()).toLocaleDateString() : '--'}</span> },
    { accessorKey: 'checkInTime', header: 'Check In', cell: info => <span className="font-medium text-emerald-600 dark:text-emerald-400">{info.getValue() || '--'}</span> },
    { accessorKey: 'checkOutTime', header: 'Check Out', cell: info => <span className="font-medium text-orange-600 dark:text-orange-400">{info.getValue() || '--'}</span> },
  ], []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Daily Attendance</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Today's check-ins and check-outs.</p>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="card p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Member</label>
          <select {...register('memberId', { required: true })} className="input-field" defaultValue="">
            <option value="" disabled>Select member</option>
            {members.map(member => <option key={member.id} value={member.id}>{member.fullname}</option>)}
          </select>
        </div>
        <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label><input type="date" {...register('date', { required: true })} className="input-field" /></div>
        <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Check-in time</label><input type="time" {...register('checkInTime')} className="input-field" /></div>
        <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Check-out time</label><input type="time" {...register('checkOutTime')} className="input-field" /></div>
        <button type="submit" disabled={checkIn.isPending} className="btn-primary">{checkIn.isPending ? 'Saving...' : 'Mark Attendance'}</button>
      </form>
      <DataTable columns={columns} data={attendance} searchPlaceholder="Search by member name..." />
      {isLoading && <p className="text-sm text-slate-500">Loading attendance...</p>}
      {isError && <p className="text-sm text-danger">Unable to load attendance.</p>}
    </div>
  );
};

export default AttendanceList;
