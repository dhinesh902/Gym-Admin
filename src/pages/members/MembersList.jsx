import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Download, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { DataTable } from '../../components/tables/DataTable';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { membersApi, toCollection } from '../../services/api';
import { getApiErrorMessage } from '../../services/apiClient';

const MembersList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({ queryKey: ['members'], queryFn: membersApi.list });
  const members = toCollection(data, ['members', 'items']);
  const deleteMember = useMutation({
    mutationFn: membersApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['members'] }),
    onError: (error) => toast.error(getApiErrorMessage(error, 'Unable to delete member.')),
  });

  const columns = useMemo(() => [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: info => <span className="text-slate-500 font-medium">{info.getValue()}</span>,
    },
    {
      accessorKey: 'fullname',
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
      cell: info => (
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(`/members/${info.row.original.id}`)} className="p-1.5 text-slate-400 hover:text-primary transition-colors" title="View Details">
            <Eye className="h-4 w-4" />
          </button>
          <button onClick={() => navigate(`/members/edit/${info.row.original.id}`)} className="p-1.5 text-slate-400 hover:text-secondary transition-colors" title="Edit">
            <Edit className="h-4 w-4" />
          </button>
          <button onClick={() => deleteMember.mutate(info.row.original.id)} className="p-1.5 text-slate-400 hover:text-danger transition-colors" title="Delete" disabled={deleteMember.isPending}>
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    }
  ], [deleteMember]);

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
        data={members}
        searchPlaceholder="Search members by name, email, or phone..."
      />

      {isLoading && <p className="text-sm text-slate-500">Loading members...</p>}
      {isError && <p className="text-sm text-danger">Unable to load members.</p>}

    </div>
  );
};

export default MembersList;
