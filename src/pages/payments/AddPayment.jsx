import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Banknote, QrCode, Upload, User, IndianRupee, FileText, Calendar, CreditCard, Hash } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsApi, membersApi, toCollection } from '../../services/api';
import { getApiErrorMessage } from '../../services/apiClient';

const AddPayment = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const { id } = useParams();
  const isEdit = Boolean(id);

  // Fetch Payment Data for Edit
  const { data: paymentData } = useQuery({
    queryKey: ['payments', id],
    queryFn: () => paymentsApi.get(id),
    enabled: isEdit,
  });

  // Fetch Members List for Selection
  const { data: membersRaw } = useQuery({
    queryKey: ['members'],
    queryFn: membersApi.list,
  });
  const members = toCollection(membersRaw, ['members', 'items']);

  useEffect(() => {
    if (isEdit && paymentData) {
      reset({
        memberId: paymentData.memberId,
        amount: paymentData.amount,
        paymentDate: paymentData.date,
        paymentMethod: paymentData.method || 'UPI',
        transactionid: paymentData.transactionId,
        remarks: paymentData.remarks,
      });
    }
  }, [isEdit, paymentData, reset]);

  const createPayment = useMutation({
    mutationFn: paymentsApi.create,
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['payments'] }); 
      toast.success('Payment recorded successfully!'); 
      navigate('/payments'); 
    },
    onError: error => toast.error(getApiErrorMessage(error, 'Unable to record payment.')),
  });

  const updatePayment = useMutation({
    mutationFn: (data) => paymentsApi.update(id, data),
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['payments'] }); 
      toast.success('Payment updated successfully!'); 
      navigate('/payments'); 
    },
    onError: error => toast.error(getApiErrorMessage(error, 'Unable to update payment.')),
  });

  const onSubmit = (data) => {
    const payload = {
      memberId: Number(data.memberId),
      amount: Number(data.amount),
      paymentDate: data.paymentDate,
      paymentMethod: data.paymentMethod,
      transactionid: data.transactionid,
      remarks: data.remarks,
      paymentscreenshot: data.paymentscreenshot
    };
    if (isEdit) {
      updatePayment.mutate(payload);
    } else {
      createPayment.mutate(payload);
    }
  };

  const selectedFile = watch('paymentscreenshot');

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans text-white pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0d0e12] p-4 rounded-xl border border-white/5 shadow-lg">
        <div>
          <h2 className="text-xl font-bold tracking-wide">{isEdit ? 'Edit Payment Record' : 'Record New Payment'}</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">{isEdit ? 'Update an existing payment record.' : 'Record a new payment and upload screenshot.'}</p>
        </div>
        <div className="flex gap-3 items-center">
          <button 
            type="button"
            onClick={() => navigate('/payments')}
            className="h-9 px-4 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 text-[11px] font-bold transition-colors flex items-center gap-2"
          >
            <X className="h-3.5 w-3.5" /> Cancel
          </button>
          <button 
            type="submit"
            form="add-payment-form"
            disabled={createPayment.isPending || updatePayment.isPending}
            className="bg-[#FBBF24] hover:bg-yellow-400 text-black h-9 px-4 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-2 shadow-lg shadow-yellow-500/10"
          >
            <Save className="h-3.5 w-3.5" /> {isEdit ? 'Update Record' : 'Save Record'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Main Form Form */}
        <div className="md:col-span-2">
          <form id="add-payment-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="bg-[#16181d] border border-gray-800/80 rounded-xl overflow-hidden shadow-xl">
              <div className="bg-[#1a1d24] p-4 border-b border-gray-800/80 flex items-center gap-2">
                <Banknote className="h-4 w-4 text-[#FBBF24]" />
                <h3 className="font-bold text-sm tracking-wide">Payment Details</h3>
              </div>
              
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Member Dropdown */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><User className="h-3.5 w-3.5"/> Member ID or Name *</label>
                  <select 
                    {...register('memberId', { required: 'Member is required' })} 
                    className="w-full bg-[#0d0e12] border border-gray-800 rounded-lg h-11 px-3 text-sm text-gray-200 focus:border-[#FBBF24] focus:outline-none transition-colors shadow-inner appearance-none cursor-pointer"
                  >
                    <option value="">Select a member...</option>
                    {members.map(member => (
                      <option key={member.id} value={member.id}>
                        {member.fullname} (ID: {member.id})
                      </option>
                    ))}
                  </select>
                  {errors.memberId && <p className="text-xs text-red-500 mt-1">{errors.memberId.message}</p>}
                </div>
                
                {/* Amount */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><IndianRupee className="h-3.5 w-3.5"/> Amount (₹) *</label>
                  <div className="relative">
                    <input 
                      type="number"
                      {...register('amount', { required: 'Amount is required' })} 
                      className="w-full bg-[#0d0e12] border border-gray-800 rounded-lg h-11 pl-4 pr-3 text-lg font-bold text-white focus:border-[#FBBF24] focus:outline-none transition-colors shadow-inner" 
                      placeholder="0.00"
                    />
                  </div>
                  {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>}
                </div>

                {/* Date */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5"/> Payment Date *</label>
                  <input 
                    type="date"
                    {...register('paymentDate', { required: 'Date is required' })} 
                    className="w-full bg-[#0d0e12] border border-gray-800 rounded-lg h-11 px-3 text-sm text-gray-200 focus:border-[#FBBF24] focus:outline-none transition-colors shadow-inner cursor-pointer" 
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                  {errors.paymentDate && <p className="text-xs text-red-500 mt-1">{errors.paymentDate.message}</p>}
                </div>

                {/* Method */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5"/> Payment Method</label>
                  <select 
                    {...register('paymentMethod')} 
                    className="w-full bg-[#0d0e12] border border-gray-800 rounded-lg h-11 px-3 text-sm text-gray-200 focus:border-[#FBBF24] focus:outline-none transition-colors shadow-inner appearance-none cursor-pointer" 
                  >
                    <option value="UPI">UPI</option>
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                  </select>
                </div>

                {/* Transaction ID */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Hash className="h-3.5 w-3.5"/> Transaction ID</label>
                  <input 
                    {...register('transactionid')} 
                    className="w-full bg-[#0d0e12] border border-gray-800 rounded-lg h-11 px-3 text-sm text-gray-200 focus:border-[#FBBF24] focus:outline-none transition-colors shadow-inner" 
                    placeholder="e.g. UPI1234567890"
                  />
                </div>

                {/* Remarks */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><FileText className="h-3.5 w-3.5"/> Remarks / Note</label>
                  <textarea 
                    {...register('remarks')} 
                    className="w-full bg-[#0d0e12] border border-gray-800 rounded-lg p-3 text-sm text-gray-200 focus:border-[#FBBF24] focus:outline-none transition-colors shadow-inner min-h-[80px]" 
                    placeholder="e.g. Monthly fee for May"
                  />
                </div>

                {/* File Upload */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Payment Screenshot</label>
                  <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors relative ${selectedFile && selectedFile.length > 0 ? 'border-[#FBBF24] bg-[#FBBF24]/5' : 'border-gray-800 hover:border-gray-700 bg-[#0d0e12]'}`}>
                    <input 
                      type="file"
                      accept="image/*"
                      {...register('paymentscreenshot')} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center pointer-events-none">
                      <div className={`p-3 rounded-full mb-3 ${selectedFile && selectedFile.length > 0 ? 'bg-[#FBBF24]/10' : 'bg-white/5'}`}>
                        <Upload className={`h-6 w-6 ${selectedFile && selectedFile.length > 0 ? 'text-[#FBBF24]' : 'text-gray-500'}`} />
                      </div>
                      <span className="text-sm font-bold text-gray-300">
                        {selectedFile && selectedFile.length > 0 ? selectedFile[0].name : 'Click or drag screenshot to upload'}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-gray-500 mt-2 font-bold">PNG, JPG, JPEG up to 5MB</span>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </form>
        </div>

        {/* UPI QR Code Section */}
        <div className="md:col-span-1">
          <div className="bg-[#16181d] border border-gray-800/80 rounded-xl h-full flex flex-col items-center justify-center p-8 text-center space-y-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#FBBF24]/5 rounded-full blur-3xl group-hover:bg-[#FBBF24]/10 transition-colors duration-700"></div>
            
            <div className="bg-[#FBBF24]/10 p-4 rounded-2xl border border-[#FBBF24]/20 relative z-10">
              <QrCode className="h-10 w-10 text-[#FBBF24]" />
            </div>
            
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-white tracking-wide">UPI Payment Only</h3>
              <p className="text-[11px] text-gray-400 mt-1.5 uppercase tracking-wider font-bold">Ask member to scan this code</p>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.1)] mt-2 relative z-10">
              <div className="w-44 h-44 bg-gray-100 flex items-center justify-center border-4 border-black rounded-xl relative overflow-hidden">
                <div className="grid grid-cols-4 grid-rows-4 gap-1.5 w-full h-full p-2.5">
                  {[...Array(16)].map((_, i) => (
                    <div key={i} className={`bg-black ${i % 3 === 0 ? 'opacity-20' : ''} ${i % 5 === 0 ? 'rounded-full' : 'rounded-sm'}`}></div>
                  ))}
                </div>
                <div className="absolute inset-0 border-[14px] border-white rounded-lg"></div>
                <div className="absolute w-10 h-10 bg-white flex items-center justify-center rounded-md shadow-sm">
                  <span className="font-black text-black text-[10px] tracking-wider">UPI</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 relative z-10">
              <div className="px-3 py-1.5 bg-[#0d0e12] rounded-md border border-gray-800 text-[10px] font-bold text-gray-400">GPay</div>
              <div className="px-3 py-1.5 bg-[#0d0e12] rounded-md border border-gray-800 text-[10px] font-bold text-gray-400">PhonePe</div>
              <div className="px-3 py-1.5 bg-[#0d0e12] rounded-md border border-gray-800 text-[10px] font-bold text-gray-400">Paytm</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddPayment;
