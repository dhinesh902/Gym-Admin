import Loader from '../../components/ui/Loader.jsx';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Eye, Trash2, Search, CreditCard, Calendar as CalendarIcon, FileText, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { paymentsApi, toCollection } from '../../services/api';
import { getApiErrorMessage } from '../../services/apiClient';

const PaymentsList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['payments'], 
    queryFn: paymentsApi.list,
    onError: error => toast.error(getApiErrorMessage(error, 'Unable to load payments.')),
  });
  
  const payments = toCollection(data, ['payments', 'items']);

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

  const filteredPayments = payments.filter(p => 
    p.member?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans text-white pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-wide">Payments & Invoices</h2>
          <p className="text-sm text-gray-400 mt-1">Track membership payments and transactions</p>
        </div>
        <button onClick={() => navigate('/payments/add')} className="bg-[#FBBF24] hover:bg-yellow-400 text-black font-bold h-10 px-5 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-yellow-500/10 whitespace-nowrap">
          <Plus className="h-4 w-4" /> Record Payment
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center w-full mt-4">
        <div className="relative flex-1 w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-500" />
          </div>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#16181d] border border-gray-800 rounded-lg h-10 pl-11 pr-4 text-sm text-gray-300 placeholder:text-gray-500 focus:outline-none focus:border-[#FBBF24] transition-colors shadow-sm"
            placeholder="Search by Invoice ID or Member Name..."
          />
        </div>
      </div>

      {isLoading && <div className="flex justify-center p-12 w-full"><Loader /></div>}
      {isError && <p className="text-sm text-red-500">Unable to load payments.</p>}

      {/* Grid Layout replacing DataTable */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
        {filteredPayments.map((payment) => {
          const status = payment.status || 'Pending';
          const isCompleted = status.toLowerCase() === 'completed';
          const isFailed = status.toLowerCase() === 'failed';
          
          let StatusIcon = Clock;
          let statusColor = 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
          if (isCompleted) {
            StatusIcon = CheckCircle2;
            statusColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
          }
          if (isFailed) {
            StatusIcon = AlertCircle;
            statusColor = 'text-red-400 bg-red-500/10 border-red-500/20';
          }

          return (
            <div key={payment.id} className="relative bg-[#16181d] border border-gray-800/80 rounded-2xl overflow-hidden flex flex-col group hover:shadow-[0_8px_30px_rgba(251,191,36,0.08)] hover:-translate-y-1.5 hover:border-[#FBBF24]/30 transition-all duration-500">
              
              <div className="p-4 flex-1 flex flex-col">
                {/* Top: Invoice & Status */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2 text-gray-400 text-[11px] font-mono bg-white/5 px-2 py-1 rounded-md border border-white/5">
                    <FileText className="h-3 w-3" /> #{payment.id}
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 border ${statusColor}`}>
                    <StatusIcon className="h-3 w-3" /> {status}
                  </span>
                </div>

                {/* Amount & Member */}
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-gray-50 tracking-wide group-hover:text-[#FBBF24] transition-colors mb-0.5 truncate">
                    {payment.member || 'Unknown Member'}
                  </h3>
                  <div className="text-2xl font-black text-white">₹{payment.amount || 0}</div>
                </div>

                {/* Details */}
                <div className="flex-1 space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-[11px] text-gray-400">
                    <CalendarIcon className="h-3.5 w-3.5 text-[#FBBF24]" />
                    <span>{payment.date || 'No Date Set'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-400">
                    <CreditCard className="h-3.5 w-3.5 text-[#FBBF24]" />
                    <span>{payment.method || 'Unknown Method'}</span>
                  </div>
                  {payment.remarks && (
                    <div className="mt-2 text-[10px] text-gray-500 bg-black/40 p-2.5 rounded-md border border-white/5 line-clamp-2 leading-relaxed">
                      {payment.remarks}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto pt-3 border-t border-gray-800/60">
                  <button 
                    onClick={() => navigate(`/payments/${payment.id}`)}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-[10px] h-8 rounded-md flex items-center justify-center gap-1.5 transition-all uppercase tracking-wider"
                  >
                    <Eye className="h-3 w-3" /> View
                  </button>
                  <button 
                    onClick={() => navigate(`/payments/edit/${payment.id}`)}
                    className="flex-1 bg-white/5 hover:bg-[#FBBF24] hover:text-black text-gray-300 font-bold text-[10px] h-8 rounded-md flex items-center justify-center gap-1.5 transition-all uppercase tracking-wider"
                  >
                    <Edit className="h-3 w-3" /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(payment.id)}
                    className="w-8 h-8 rounded-md bg-white/5 flex items-center justify-center text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors shrink-0"
                    title="Delete Payment"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        
        {!isLoading && filteredPayments.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-[#16181d] rounded-xl border border-gray-800">
            <CreditCard className="h-8 w-8 mx-auto mb-3 text-gray-600" />
            <p>No payments found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsList;
