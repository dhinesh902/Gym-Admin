import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, MoreHorizontal, Edit, Trash2, Eye, Plus, Star } from 'lucide-react';
import { DataTable } from '../../components/tables/DataTable';

const MOCK_TRAINERS = [
  { id: 'TRN-101', name: 'Mike Johnson', specialty: 'Strength & Conditioning', members: 24, status: 'Active', shift: 'Morning' },
  { id: 'TRN-102', name: 'Sarah Davis', specialty: 'Yoga & Flexibility', members: 30, status: 'Active', shift: 'Evening' },
  { id: 'TRN-103', name: 'David Lee', specialty: 'CrossFit', members: 18, status: 'Active', shift: 'Morning' },
  { id: 'TRN-104', name: 'Emily Chen', specialty: 'Cardio & HIIT', members: 22, status: 'On Leave', shift: 'Evening' },
];

const TrainersList = () => {
  const navigate = useNavigate();

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Trainer',
      cell: info => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
            {info.getValue().charAt(0)}
          </div>
          <div>
            <div className="font-bold text-slate-800 dark:text-slate-200">{info.getValue()}</div>
            <div className="text-xs text-slate-500">{info.row.original.id}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'specialty',
      header: 'Specialty',
    },
    {
      accessorKey: 'members',
      header: 'Assigned Members',
      cell: info => <span className="text-slate-700 dark:text-slate-300 font-medium">{info.getValue()}</span>,
    },
    {
      accessorKey: 'shift',
      header: 'Shift',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: info => {
        const status = info.getValue();
        let colorClass = 'bg-slate-100 text-slate-700';
        if (status === 'Active') colorClass = 'bg-accent/10 text-accent';
        if (status === 'On Leave') colorClass = 'bg-warning/10 text-warning';

        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${colorClass}`}>
            {status}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: () => (
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-slate-400 hover:text-primary transition-colors" title="View Details">
            <Eye className="h-4 w-4" />
          </button>
          <button className="p-1.5 text-slate-400 hover:text-secondary transition-colors" title="Edit">
            <Edit className="h-4 w-4" />
          </button>
          <button className="p-1.5 text-slate-400 hover:text-danger transition-colors" title="Delete">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    }
  ], []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Trainers</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage your gym's coaching staff.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-outline text-sm flex items-center gap-2">
            <Download className="h-4 w-4" /> Export
          </button>
          <button
            onClick={() => navigate('/trainers/add')}
            className="btn-primary text-sm flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Add Trainer
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={MOCK_TRAINERS}
        searchPlaceholder="Search trainers by name or specialty..."
      />
    </div>
  );
};

export default TrainersList;
