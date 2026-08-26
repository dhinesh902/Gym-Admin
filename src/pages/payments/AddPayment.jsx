import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Save, X, Banknote, QrCode } from 'lucide-react';
import toast from 'react-hot-toast';

const AddPayment = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    toast.success('Payment recorded successfully!');
    navigate('/payments');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Add Payment Record</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Record a new payment via UPI QR code.</p>
        </div>
        <div className="flex gap-2">
          <button 
            type="button"
            onClick={() => navigate('/payments')}
            className="btn-outline text-sm flex items-center gap-2"
          >
            <X className="h-4 w-4" /> Cancel
          </button>
          <button 
            type="submit"
            form="add-payment-form"
            className="btn-primary text-sm flex items-center gap-2"
          >
            <Save className="h-4 w-4" /> Save Record
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <form id="add-payment-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="card overflow-hidden">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <Banknote className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-slate-800 dark:text-white">Payment Details</h3>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Member ID or Name *</label>
                  <input 
                    {...register('memberId', { required: 'Member is required' })} 
                    className="input-field" 
                    placeholder="Search or enter member name"
                  />
                  {errors.memberId && <p className="text-xs text-danger mt-1">{errors.memberId.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount (₹) *</label>
                  <input 
                    type="number"
                    {...register('amount', { required: 'Amount is required' })} 
                    className="input-field font-semibold text-lg" 
                    placeholder="0.00"
                  />
                  {errors.amount && <p className="text-xs text-danger mt-1">{errors.amount.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Payment Date *</label>
                  <input 
                    type="date"
                    {...register('paymentDate', { required: 'Date is required' })} 
                    className="input-field text-slate-500" 
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                  {errors.paymentDate && <p className="text-xs text-danger mt-1">{errors.paymentDate.message}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Remarks / Note</label>
                  <input 
                    {...register('remarks')} 
                    className="input-field" 
                    placeholder="e.g. Monthly fee for May"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Payment Screenshot</label>
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <input 
                      type="file"
                      accept="image/*"
                      {...register('screenshot')} 
                      className="hidden"
                      id="screenshot-upload"
                    />
                    <label htmlFor="screenshot-upload" className="cursor-pointer flex flex-col items-center justify-center">
                      <span className="text-sm font-medium text-primary">Click to upload screenshot</span>
                      <span className="text-xs text-slate-500 mt-1">PNG, JPG, JPEG up to 5MB</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* UPI QR Code Section */}
        <div className="md:col-span-1">
          <div className="card h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <QrCode className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white">UPI Payment Only</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Ask the member to scan this QR code to make the payment.</p>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-inner border border-slate-200 mt-4">
              {/* Dummy QR Code Image representation */}
              <div className="w-40 h-40 bg-slate-100 flex items-center justify-center border-4 border-slate-800 rounded-lg relative overflow-hidden">
                <div className="grid grid-cols-4 grid-rows-4 gap-1 w-full h-full p-2">
                  {[...Array(16)].map((_, i) => (
                    <div key={i} className={`bg-slate-800 ${i % 3 === 0 ? 'opacity-20' : ''} ${i % 5 === 0 ? 'rounded-full' : 'rounded-sm'}`}></div>
                  ))}
                </div>
                <div className="absolute inset-0 border-[12px] border-white"></div>
                <div className="absolute w-8 h-8 bg-white flex items-center justify-center rounded">
                  <span className="font-bold text-primary text-xs">UPI</span>
                </div>
              </div>
            </div>
            
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300">Scan using GPay, PhonePe, Paytm</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPayment;
