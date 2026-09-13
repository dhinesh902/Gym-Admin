import React from 'react';
import { ArrowLeft, User, Calendar, CreditCard, Banknote, QrCode, ClipboardList, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { paymentsApi } from '../../services/api';

const PaymentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: payment, isLoading, isError } = useQuery({
    queryKey: ['payment', id],
    queryFn: () => paymentsApi.get(id),
  });

  if (isLoading) return <p className="text-sm text-slate-500">Loading payment details...</p>;
  if (isError || !payment) return <p className="text-sm text-danger">Unable to load payment details.</p>;

  // Fallback if full member object exists from nested query or just ID mapping
  const memberName = payment.member || 'Unknown';

  const getMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'upi': return <QrCode className="h-5 w-5" />;
      case 'card': return <CreditCard className="h-5 w-5" />;
      default: return <Banknote className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/payments')} className="btn-outline p-2" title="Back to payments">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Payment Details</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Review invoice and transaction details.</p>
          </div>
        </div>
        <button onClick={() => navigate(`/payments/edit/${payment.id}`)} className="btn-primary text-sm">Edit Payment</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="card p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <ClipboardList className="w-32 h-32 text-primary" />
            </div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-sm font-medium text-slate-500">Invoice ID</p>
                <h3 className="text-xl font-mono font-bold text-slate-800 dark:text-slate-100">INV-{payment.id}</h3>
              </div>
              <div className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1.5 border border-accent/20">
                <CheckCircle className="h-4 w-4" />
                Completed
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-primary" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Member</p>
                </div>
                <p className="text-base text-slate-600 dark:text-slate-400 ml-6">{memberName}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-primary" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Payment Date</p>
                </div>
                <p className="text-base text-slate-600 dark:text-slate-400 ml-6">{payment.date || 'N/A'}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  {getMethodIcon(payment.method)}
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Method</p>
                </div>
                <p className="text-base text-slate-600 dark:text-slate-400 ml-6 capitalize">{payment.method || 'N/A'}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <ClipboardList className="h-4 w-4 text-primary" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Transaction ID</p>
                </div>
                <p className="text-base font-mono text-slate-600 dark:text-slate-400 ml-6">{payment.transactionId || 'N/A'}</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 relative z-10">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Remarks</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 leading-relaxed">
                {payment.remarks || 'No remarks added for this payment.'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6 text-center">
            <p className="text-sm font-medium text-slate-500 mb-1">Amount Paid</p>
            <h2 className="text-4xl font-bold text-primary mb-2">₹{payment.amount}</h2>
            <p className="text-xs text-slate-400">Received on {payment.date}</p>
          </div>

          <div className="card p-6">
            <h4 className="font-semibold text-slate-800 dark:text-white mb-4">Payment Receipt</h4>
            {payment.screenshot ? (
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                <img 
                  src={payment.screenshot.startsWith('http') ? payment.screenshot : `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3000'}${payment.screenshot}`} 
                  alt="Payment Receipt" 
                  className="w-full h-auto object-cover max-h-[300px]"
                  onError={(e) => { e.target.src = 'https://placehold.co/400x300/f8fafc/94a3b8?text=Receipt+Not+Found'; }}
                />
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-8 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200 dark:border-slate-700">
                <QrCode className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">No receipt uploaded</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetail;
