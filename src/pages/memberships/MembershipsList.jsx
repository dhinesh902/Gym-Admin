import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import { DataTable } from '../../components/tables/DataTable';

const MOCK_PLANS = [
  { id: 'PLN-01', name: 'Monthly Basic', duration: '1 Month', price: '₹1,500', members: 45, status: 'Active' },
  { id: 'PLN-02', name: 'Quarterly Pro', duration: '3 Months', price: '₹4,000', members: 120, status: 'Active' },
  { id: 'PLN-03', name: 'Half Yearly Elite', duration: '6 Months', price: '₹7,500', members: 85, status: 'Active' },
  { id: 'PLN-04', name: 'Yearly VIP', duration: '12 Months', price: '₹12,000', members: 210, status: 'Active' },
  { id: 'PLN-05', name: 'Summer Special', duration: '2 Months', price: '₹2,500', members: 0, status: 'Disabled' },
];

const MembershipsList = () => {
  const navigate = useNavigate();
  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Plan Name',
      cell: info => <div className="font-bold text-slate-800 dark:text-slate-200">{info.getValue()}</div>,
    },
    { accessorKey: 'duration', header: 'Duration' },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: info => <div className="font-bold text-primary">{info.getValue()}</div>,
    },
    { accessorKey: 'members', header: 'Active Members' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: info => {
        const status = info.getValue();
        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${status === 'Active' ? 'bg-accent/10 text-accent' : 'bg-slate-100 text-slate-500'}`}>
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
          <button className="p-1.5 text-slate-400 hover:text-secondary transition-colors"><Edit className="h-4 w-4" /></button>
          <button className="p-1.5 text-slate-400 hover:text-danger transition-colors"><Trash2 className="h-4 w-4" /></button>
        </div>
      ),
    }
  ], []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Membership Plans</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage pricing and subscription plans.</p>
        </div>
        <button onClick={() => navigate('/memberships/add')} className="btn-primary text-sm flex items-center gap-2">
          <Plus className="h-4 w-4" /> Create Plan
        </button>
      </div>
      <DataTable columns={columns} data={MOCK_PLANS} searchPlaceholder="Search plans..." />
    </div>
  );
};

export default MembershipsList;
