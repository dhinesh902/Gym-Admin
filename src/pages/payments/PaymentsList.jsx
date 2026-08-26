import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Plus, Receipt } from 'lucide-react';
import { DataTable } from '../../components/tables/DataTable';

const MOCK_PAYMENTS = [
  { id: 'INV-1001', member: 'Rahul Sharma', plan: 'Yearly Pro', amount: '₹12,000', method: 'Credit Card', date: '2023-10-15', status: 'Completed' },
  { id: 'INV-1002', member: 'Sneha Patel', plan: 'Monthly', amount: '₹1,500', method: 'UPI', date: '2023-11-20', status: 'Completed' },
  { id: 'INV-1003', member: 'Amit Kumar', plan: 'Quarterly', amount: '₹4,000', method: 'Cash', date: '2023-11-25', status: 'Pending' },
  { id: 'INV-1004', member: 'Priya Singh', plan: 'Half Yearly', amount: '₹7,500', method: 'Bank Transfer', date: '2023-11-28', status: 'Completed' },
  { id: 'INV-1005', member: 'Vikram Singh', plan: 'Personal Training', amount: '₹5,000', method: '--', date: '2023-12-01', status: 'Failed' },
];

const PaymentsList = () => {
  const navigate = useNavigate();
  const columns = useMemo(() => [
    { accessorKey: 'id', header: 'Invoice ID', cell: info => <span className="font-mono text-slate-500">{info.getValue()}</span> },
    { accessorKey: 'member', header: 'Member Name', cell: info => <div className="font-bold text-slate-800 dark:text-slate-200">{info.getValue()}</div> },
    { accessorKey: 'plan', header: 'Description' },
    { accessorKey: 'amount', header: 'Amount', cell: info => <div className="font-bold text-primary">{info.getValue()}</div> },
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
      cell: () => (
        <button className="p-1.5 text-slate-400 hover:text-primary transition-colors flex items-center gap-1 text-xs font-medium">
          <Receipt className="h-4 w-4" /> Receipt
        </button>
      ),
    }
  ], []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Payments & Invoices</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Track membership payments and transactions.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-outline text-sm flex items-center gap-2">
            <Download className="h-4 w-4" /> Export CSV
          </button>
          <button onClick={() => navigate('/payments/add')} className="btn-primary text-sm flex items-center gap-2">
            <Plus className="h-4 w-4" /> Record Payment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-5">
          <p className="text-sm text-slate-500 font-medium">Total Revenue (This Month)</p>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">₹85,000</h3>
        </div>
        <div className="card p-5">
          <p className="text-sm text-slate-500 font-medium">Pending Payments</p>
          <h3 className="text-2xl font-bold text-warning mt-1">₹12,500</h3>
        </div>
        <div className="card p-5">
          <p className="text-sm text-slate-500 font-medium">Successful Transactions</p>
          <h3 className="text-2xl font-bold text-accent mt-1">142</h3>
        </div>
      </div>

      <DataTable columns={columns} data={MOCK_PAYMENTS} searchPlaceholder="Search by invoice ID or member name..." />
    </div>
  );
};

export default PaymentsList;
