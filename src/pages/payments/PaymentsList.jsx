import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Eye, Trash2 } from 'lucide-react';
import { DataTable } from '../../components/tables/DataTable';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { paymentsApi, toCollection } from '../../services/api';
import { getApiErrorMessage } from '../../services/apiClient';

const PaymentsList = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['payments'], queryFn: paymentsApi.list,
    onError: error => toast.error(getApiErrorMessage(error, 'Unable to load payments.')),
  });
  const payments = toCollection(data, ['payments', 'items']);
  const columns = useMemo(() => [
    { accessorKey: 'id', header: 'Invoice ID', cell: info => <span className="font-mono text-slate-500">{info.getValue()}</span> },
    { accessorKey: 'member', header: 'Member Name', cell: info => <div className="font-bold text-slate-800 dark:text-slate-200">{info.getValue()}</div> },
    { accessorKey: 'remarks', header: 'Description', cell: info => <div className="text-slate-600 dark:text-slate-400 max-w-[200px] line-clamp-2" title={info.getValue()}>{info.getValue()}</div> },
    { accessorKey: 'amount', header: 'Amount', cell: info => <div className="font-bold text-primary">₹{info.getValue()}</div> },
    { accessorKey: 'method', header: 'Payment Method' },
    { accessorKey: 'date', header: 'Date', cell: info => <span className="text-slate-600 dark:text-slate-400">{info.getValue()}</span> },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: info => {
        const status = info.getValue();
        let colorClass = 'bg-slate-100 text-slate-700';
        if (status === 'Completed') colorClass = 'bg-accent/10 text-accent';
        if (status === 'Pending') colorClass = 'bg-warning/10 text-warning';
        if (status === 'Failed') colorClass = 'bg-danger/10 text-danger';

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
      cell: ({ row }) => {
        const id = row.original.id;
        return (
          <div className="flex gap-2">
            <button onClick={() => navigate(`/payments/${id}`)} className="p-1.5 text-slate-400 hover:text-secondary transition-colors text-xs font-medium" title="View Details">
              <Eye className="h-4 w-4" />
            </button>
            <button onClick={() => navigate(`/payments/edit/${id}`)} className="p-1.5 text-slate-400 hover:text-primary transition-colors text-xs font-medium" title="Edit">
              <Edit className="h-4 w-4" />
            </button>
            <button onClick={() => handleDelete(id)} className="p-1.5 text-slate-400 hover:text-danger transition-colors text-xs font-medium" title="Delete">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      },
    }
  ], []);

  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: paymentsApi.remove,
    onSuccess: () => {
      toast.success('Payment deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
    onError: error => toast.error(getApiErrorMessage(error, 'Unable to delete payment.')),
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Payments & Invoices</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Track membership payments and transactions.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/payments/add')} className="btn-primary text-sm flex items-center gap-2">
            <Plus className="h-4 w-4" /> Record Payment
          </button>
        </div>
      </div>

      <DataTable columns={columns} data={payments} searchPlaceholder="Search by invoice ID or member name..." />
      {isLoading && <p className="text-sm text-slate-500">Loading payments...</p>}
      {isError && <p className="text-sm text-danger">Unable to load payments.</p>}
    </div>
  );
};

export default PaymentsList;
