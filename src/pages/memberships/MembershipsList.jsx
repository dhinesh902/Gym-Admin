import Loader from '../../components/ui/Loader.jsx';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Save, X, CreditCard, AlignLeft, Search, CheckCircle2, Clock, DollarSign, Activity } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import apiClient, { getApiErrorMessage } from '../../services/apiClient';

const MembershipsList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editingPlan, setEditingPlan] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPlans = async () => {
    const response = await apiClient.post('/plans/get');
    return response.data.data || [];
  };

  const { data: plans = [], isLoading, isError } = useQuery({
    queryKey: ['plans'],
    queryFn: fetchPlans,
    onError: error => toast.error(getApiErrorMessage(error, 'Unable to load plans.'))
  });

  const deletePlan = useMutation({
    mutationFn: async (id) => {
      const response = await apiClient.post(`/plans/delete/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      toast.success('Plan deleted successfully!');
    },
    onError: error => toast.error(getApiErrorMessage(error, 'Unable to delete plan.')),
  });

  const editPlan = useMutation({
    mutationFn: async (payload) => {
      const response = await apiClient.post(`/plans/edit/${payload.id}`, payload.data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      toast.success('Plan updated successfully!');
      setEditingPlan(null);
    },
    onError: error => toast.error(getApiErrorMessage(error, 'Unable to update plan.')),
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      deletePlan.mutate(id);
    }
  };

  const filteredPlans = plans.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans text-white pb-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-wide">Membership Plans</h2>
            <p className="text-sm text-gray-400 mt-1">Manage pricing and subscription plans</p>
          </div>
          <button onClick={() => navigate('/memberships/add')} className="bg-[#FBBF24] hover:bg-yellow-400 text-black font-bold h-10 px-5 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-yellow-500/10 whitespace-nowrap">
            <Plus className="h-4 w-4" /> Create Plan
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
              placeholder="Search plans by name or description..."
            />
          </div>
        </div>

        {isLoading && <div className="flex justify-center p-12 w-full"><Loader /></div>}
        {isError && <p className="text-sm text-red-500">Unable to load plans.</p>}

        {/* Grid Layout replacing DataTable */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mt-6">
          {filteredPlans.map((plan) => {
            const num = plan.duration || plan.durationInMonths || '-';
            const type = plan.durationtype || (plan.durationInMonths ? 'Months' : '');
            const durationText = `${num} ${type}`.trim();
            const isActive = (plan.status || 'active').toLowerCase() === 'active';
            
            return (
              <div key={plan.id || plan._id} className="relative bg-[#16181d] border border-gray-800/80 rounded-2xl overflow-hidden flex flex-col group hover:shadow-[0_8px_30px_rgba(251,191,36,0.08)] hover:-translate-y-1.5 hover:border-[#FBBF24]/30 transition-all duration-500">
                
                {/* Top Accent Bar */}
                <div className={`h-1.5 w-full ${isActive ? 'bg-[#FBBF24]' : 'bg-gray-600'}`}></div>

                <div className="p-6 flex-1 flex flex-col">
                  {/* Status & Name */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-50 tracking-wide group-hover:text-[#FBBF24] transition-colors pr-4">{plan.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase whitespace-nowrap border ${isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                      {plan.status || 'Active'}
                    </span>
                  </div>

                  {/* Pricing */}
                  <div className="mb-6">
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-black text-white">₹{plan.offerprice || plan.price}</span>
                      {plan.offerprice && plan.price > plan.offerprice && (
                        <span className="text-sm text-gray-500 line-through font-medium mb-1">₹{plan.price}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1 font-medium tracking-wide">
                      {durationText} • +₹{plan.registrationfee || 0} Reg. Fee
                    </p>
                  </div>

                  {/* Description / Features */}
                  <div className="flex-1 mb-6 border-t border-gray-800/60 pt-4">
                    <p className="text-xs text-gray-300 leading-relaxed line-clamp-3">
                      {plan.description || 'No description provided for this membership plan.'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto pt-4 border-t border-gray-800/60">
                    <button 
                      onClick={() => setEditingPlan(plan)}
                      className="flex-1 bg-white/5 hover:bg-[#FBBF24] text-gray-300 hover:text-black font-bold text-[11px] h-9 rounded-lg flex items-center justify-center gap-2 transition-all"
                    >
                      <Edit className="h-3.5 w-3.5" /> Edit Plan
                    </button>
                    <button 
                      onClick={() => handleDelete(plan.id || plan._id)}
                      className="w-10 h-9 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors shrink-0"
                      title="Delete Plan"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          
          {!isLoading && filteredPlans.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500">
              No membership plans found.
            </div>
          )}
        </div>
      </div>

      {/* Edit Sidebar Modal (Dark UI) */}
      {editingPlan && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setEditingPlan(null)}
          />
          <div className="fixed top-0 right-0 h-full w-full max-w-2xl bg-[#0d0e12] z-50 shadow-2xl border-l border-white/5 p-6 sm:p-8 flex flex-col overflow-y-auto animate-in slide-in-from-right duration-300 text-white font-sans">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-gray-800/60">
              <div>
                <h2 className="text-2xl font-bold tracking-wide">Edit Plan</h2>
                <p className="text-xs text-gray-400 mt-1">Update membership plan details</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditingPlan(null)} className="h-9 px-4 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 text-[11px] font-bold transition-colors flex items-center gap-2">
                  <X className="h-3.5 w-3.5" /> Cancel
                </button>
                <button
                  onClick={() => {
                    editPlan.mutate({
                      id: editingPlan.id || editingPlan._id,
                      data: {
                        name: document.getElementById('edit-name').value,
                        price: Number(document.getElementById('edit-price').value),
                        duration: Number(document.getElementById('edit-duration').value),
                        durationtype: document.getElementById('edit-durationtype').value,
                        registrationfee: Number(document.getElementById('edit-registrationfee').value),
                        offerprice: Number(document.getElementById('edit-offerprice').value),
                        status: document.getElementById('edit-status').value,
                        description: document.getElementById('edit-description').value,
                      }
                    })
                  }}
                  className="bg-[#FBBF24] hover:bg-yellow-400 text-black h-9 px-4 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-2"
                  disabled={editPlan.isPending}
                >
                  <Save className="h-3.5 w-3.5" /> {editPlan.isPending ? 'Saving...' : 'Update Plan'}
                </button>
              </div>
            </div>

            <div className="space-y-6 flex-1">
              {/* Section 1 */}
              <div className="bg-[#16181d] border border-gray-800/80 rounded-xl overflow-hidden">
                <div className="bg-[#1a1d24] p-4 border-b border-gray-800/80 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-[#FBBF24]" />
                  <h3 className="font-bold text-sm tracking-wide">Plan Details & Pricing</h3>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Plan Name *</label>
                    <input type="text" className="w-full bg-[#0d0e12] border border-gray-800 rounded-lg h-10 px-3 text-sm text-gray-200 focus:border-[#FBBF24] focus:outline-none transition-colors" defaultValue={editingPlan.name} id="edit-name" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Duration *</label>
                    <input type="number" className="w-full bg-[#0d0e12] border border-gray-800 rounded-lg h-10 px-3 text-sm text-gray-200 focus:border-[#FBBF24] focus:outline-none transition-colors" defaultValue={editingPlan.duration || editingPlan.durationInMonths} id="edit-duration" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Duration Type *</label>
                    <select className="w-full bg-[#0d0e12] border border-gray-800 rounded-lg h-10 px-3 text-sm text-gray-200 focus:border-[#FBBF24] focus:outline-none transition-colors appearance-none cursor-pointer" defaultValue={editingPlan.durationtype || 'Months'} id="edit-durationtype">
                      <option value="Days">Days</option>
                      <option value="Months">Months</option>
                      <option value="Years">Years</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Status</label>
                    <select className="w-full bg-[#0d0e12] border border-gray-800 rounded-lg h-10 px-3 text-sm text-gray-200 focus:border-[#FBBF24] focus:outline-none transition-colors appearance-none cursor-pointer" defaultValue={editingPlan.status || 'active'} id="edit-status">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Price (₹) *</label>
                    <input type="number" className="w-full bg-[#0d0e12] border border-gray-800 rounded-lg h-10 px-3 text-sm text-gray-200 focus:border-[#FBBF24] focus:outline-none transition-colors" defaultValue={editingPlan.price} id="edit-price" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Offer Price (₹) *</label>
                    <input type="number" className="w-full bg-[#0d0e12] border border-gray-800 rounded-lg h-10 px-3 text-sm text-gray-200 focus:border-[#FBBF24] focus:outline-none transition-colors" defaultValue={editingPlan.offerprice} id="edit-offerprice" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Registration Fee (₹) *</label>
                    <input type="number" className="w-full bg-[#0d0e12] border border-gray-800 rounded-lg h-10 px-3 text-sm text-gray-200 focus:border-[#FBBF24] focus:outline-none transition-colors" defaultValue={editingPlan.registrationfee} id="edit-registrationfee" />
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div className="bg-[#16181d] border border-gray-800/80 rounded-xl overflow-hidden">
                <div className="bg-[#1a1d24] p-4 border-b border-gray-800/80 flex items-center gap-2">
                  <AlignLeft className="h-4 w-4 text-[#FBBF24]" />
                  <h3 className="font-bold text-sm tracking-wide">Description</h3>
                </div>
                <div className="p-6">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Plan Description</label>
                  <textarea className="w-full bg-[#0d0e12] border border-gray-800 rounded-lg p-3 text-sm text-gray-200 focus:border-[#FBBF24] focus:outline-none transition-colors min-h-[100px]" defaultValue={editingPlan.description} id="edit-description" />
                </div>
              </div>

            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MembershipsList;
