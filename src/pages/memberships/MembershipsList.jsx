import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Tag, Save, X, CreditCard, AlignLeft } from 'lucide-react';
import { DataTable } from '../../components/tables/DataTable';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import apiClient, { getApiErrorMessage } from '../../services/apiClient';

const MembershipsList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editingPlan, setEditingPlan] = useState(null);

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

  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Plan Name',
      cell: info => <div className="font-bold text-slate-800 dark:text-slate-200">{info.getValue()}</div>,
    },
    { accessorKey: 'durationInMonths', header: 'Duration (Months)' },
    {
      accessorKey: 'price',
      header: 'Price (₹)',
      cell: info => <div className="font-bold text-primary">{info.getValue()}</div>,
    },
    { accessorKey: 'description', header: 'Description' },
    // {
    //   accessorKey: 'status',
    //   header: 'Status',
    //   cell: info => {
    //     const status = info.getValue() || 'Active';
    //     return (
    //       <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${status === 'Active' ? 'bg-accent/10 text-accent' : 'bg-slate-100 text-slate-500'}`}>
    //         {status}
    //       </span>
    //     );
    //   },
    // },
    {
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex items-center gap-2">
          <button onClick={() => setEditingPlan(info.row.original)} className="p-1.5 text-slate-400 hover:text-secondary transition-colors"><Edit className="h-4 w-4" /></button>
          <button onClick={() => handleDelete(info.row.original.id || info.row.original._id)} className="p-1.5 text-slate-400 hover:text-danger transition-colors"><Trash2 className="h-4 w-4" /></button>
        </div>
      ),
    }
  ], []);

  return (
    <>
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
        <DataTable columns={columns} data={plans} searchPlaceholder="Search plans..." />
        {isLoading && <p className="text-sm text-slate-500">Loading plans...</p>}
        {isError && <p className="text-sm text-danger">Unable to load plans.</p>}
      </div>

      {/* Edit Sidebar */}
      {editingPlan && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/20 z-40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setEditingPlan(null)}
          />

          {/* Styled Edit Sidebar Modal matching Edit Trainer UI */}
          <div className="fixed top-0 right-0 h-full w-full max-w-3xl bg-slate-50 dark:bg-slate-900 z-50 shadow-2xl border-l border-slate-200 dark:border-slate-800 p-6 sm:p-8 flex flex-col overflow-y-auto animate-in slide-in-from-right duration-300">

            {/* Top Bar matching AddTrainer */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Edit Plan</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Update membership plan details.</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditingPlan(null)} className="btn-outline text-sm flex items-center gap-2">
                  <X className="h-4 w-4" /> Cancel
                </button>
                <button
                  onClick={() => {
                    editPlan.mutate({
                      id: editingPlan.id || editingPlan._id,
                      data: {
                        name: document.getElementById('edit-name').value,
                        price: Number(document.getElementById('edit-price').value),
                        duration: Number(document.getElementById('edit-duration').value),
                        description: document.getElementById('edit-description').value,
                      }
                    })
                  }}
                  className="btn-primary text-sm flex items-center gap-2"
                  disabled={editPlan.isPending}
                >
                  <Save className="h-4 w-4" /> {editPlan.isPending ? 'Saving...' : 'Update Plan'}
                </button>
              </div>
            </div>

            {/* Form Fields wrapped in cards matching AddTrainer structure */}
            <div className="space-y-6 flex-1">

              {/* Section 1 */}
              <div className="card overflow-hidden bg-white dark:bg-surface-dark">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <h3 className="font-bold text-slate-800 dark:text-white">Plan Details</h3>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Plan Name *</label>
                    <input type="text" className="input-field w-full" defaultValue={editingPlan.name} id="edit-name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price (₹) *</label>
                    <input type="number" className="input-field w-full" defaultValue={editingPlan.price} id="edit-price" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Duration (Months) *</label>
                    <input type="number" className="input-field w-full" defaultValue={editingPlan.durationInMonths || editingPlan.duration} id="edit-duration" />
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div className="card overflow-hidden bg-white dark:bg-surface-dark">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                  <AlignLeft className="h-5 w-5 text-secondary" />
                  <h3 className="font-bold text-slate-800 dark:text-white">Description</h3>
                </div>
                <div className="p-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Plan Description</label>
                    <textarea className="input-field w-full min-h-[80px]" defaultValue={editingPlan.description} id="edit-description" />
                  </div>
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
