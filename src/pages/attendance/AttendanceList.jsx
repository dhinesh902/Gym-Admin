import React, { useMemo } from 'react';
import { Download } from 'lucide-react';
import { DataTable } from '../../components/tables/DataTable';

const MOCK_ATTENDANCE = [
  { id: '1', member: 'Rahul Sharma', checkIn: '06:15 AM', checkOut: '07:45 AM', duration: '1h 30m', method: 'Biometric' },
  { id: '2', member: 'Sneha Patel', checkIn: '06:30 AM', checkOut: '08:00 AM', duration: '1h 30m', method: 'QR Code' },
  { id: '3', member: 'Amit Kumar', checkIn: '07:00 AM', checkOut: '--', duration: 'Active', method: 'Manual' },
];

const AttendanceList = () => {
  const columns = useMemo(() => [
    { accessorKey: 'member', header: 'Member Name', cell: info => <div className="font-bold">{info.getValue()}</div> },
    { accessorKey: 'checkIn', header: 'Check In' },
    { accessorKey: 'checkOut', header: 'Check Out' },
    {
      accessorKey: 'duration',
      header: 'Duration',
      cell: info => <span className={info.getValue() === 'Active' ? 'text-accent font-bold' : ''}>{info.getValue()}</span>
    },
    { accessorKey: 'method', header: 'Method' },
  ], []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Daily Attendance</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Today's check-ins and check-outs.</p>
        </div>
        <button className="btn-outline text-sm flex items-center gap-2">
          <Download className="h-4 w-4" /> Export Today
        </button>
      </div>
      <DataTable columns={columns} data={MOCK_ATTENDANCE} searchPlaceholder="Search by member name..." />
    </div>
  );
};

export default AttendanceList;
