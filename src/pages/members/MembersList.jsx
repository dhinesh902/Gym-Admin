import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Download, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { DataTable } from '../../components/tables/DataTable';

// MOCK DATA for Gym Members
const MOCK_MEMBERS = [
  { id: 'MEM-001', name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91 9876543210', plan: 'Yearly Pro', status: 'Active', joinedDate: '2023-01-15' },
  { id: 'MEM-002', name: 'Sneha Patel', email: 'sneha@example.com', phone: '+91 9876543211', plan: 'Monthly', status: 'Active', joinedDate: '2023-11-20' },
  { id: 'MEM-003', name: 'Amit Kumar', email: 'amit@example.com', phone: '+91 9876543212', plan: 'Quarterly', status: 'Expired', joinedDate: '2023-05-10' },
  { id: 'MEM-004', name: 'Priya Singh', email: 'priya@example.com', phone: '+91 9876543213', plan: 'Half Yearly', status: 'Active', joinedDate: '2023-08-01' },
  { id: 'MEM-005', name: 'Vikram Singh', email: 'vikram@example.com', phone: '+91 9876543214', plan: 'Yearly Pro', status: 'Suspended', joinedDate: '2022-12-05' },
  { id: 'MEM-006', name: 'Anjali Desai', email: 'anjali@example.com', phone: '+91 9876543215', plan: 'Monthly', status: 'Active', joinedDate: '2024-01-02' },
];

const MembersList = () => {
  const navigate = useNavigate();

  const columns = useMemo(() => [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: info => <span className="text-slate-500 font-medium">{info.getValue()}</span>,
    },
    {
      accessorKey: 'name',
      header: 'Member',
      cell: info => (
        <div>
          <div className="font-bold text-slate-800 dark:text-slate-200">{info.getValue()}</div>
          <div className="text-xs text-slate-500">{info.row.original.email}</div>
        </div>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
    },
    {
      accessorKey: 'plan',
      header: 'Membership Plan',
      cell: info => <span className="text-slate-700 dark:text-slate-300 font-medium">{info.getValue()}</span>,
    },
    {
      accessorKey: 'joinedDate',
      header: 'Joined Date',
      cell: info => <span className="text-slate-600 dark:text-slate-400">{new Date(info.getValue()).toLocaleDateString()}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: info => {
        const status = info.getValue();
        let colorClass = 'bg-slate-100 text-slate-700';
        if (status === 'Active') colorClass = 'bg-accent/10 text-accent';
        if (status === 'Expired') colorClass = 'bg-danger/10 text-danger';
        if (status === 'Suspended') colorClass = 'bg-warning/10 text-warning';
        
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
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Members</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage all your gym members here.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-outline text-sm flex items-center gap-2">
            <Download className="h-4 w-4" /> Export
          </button>
          <button 
            onClick={() => navigate('/members/add')}
            className="btn-primary text-sm flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" /> Add Member
          </button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable 
        columns={columns} 
        data={MOCK_MEMBERS} 
        searchPlaceholder="Search members by name, email, or phone..." 
      />

    </div>
  );
};

export default MembersList;
