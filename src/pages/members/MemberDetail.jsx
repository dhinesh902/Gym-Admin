import React from 'react';
import { ArrowLeft, Mail, Phone, Calendar, User, Activity, CreditCard, Droplet } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { membersApi } from '../../services/api';
import apiClient, { getApiErrorMessage } from '../../services/apiClient';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const baseUrl = import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace('/api', '') : 'http://localhost:3000';
  return `${baseUrl}${path}`;
};

const MemberDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: member, isLoading, isError } = useQuery({
    queryKey: ['member', id],
    queryFn: () => membersApi.get(id),
  });

  const updateStatus = useMutation({
    mutationFn: async (status) => {
      const response = await apiClient.post(`/members/edit/${id}`, { status });
      return response.data;
    },
    onSuccess: (_, status) => {
      queryClient.invalidateQueries({ queryKey: ['member', id] });
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success(`Member status updated.`);
    },
    onError: error => toast.error(getApiErrorMessage(error, 'Unable to update member status.')),
  });

  if (isLoading) return <p className="text-sm text-slate-500">Loading member details...</p>;
  if (isError || !member) return <p className="text-sm text-danger">Unable to load member details.</p>;

  const status = member.status === 'active' ? 'active' : 'inactive';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/members')} className="btn-outline p-2" title="Back to members">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Member Details</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Review member information and plan details.</p>
          </div>
        </div>
        <button onClick={() => navigate(`/members/edit/${member.id}`)} className="btn-primary text-sm">Edit Member</button>
      </div>

      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-2xl font-bold text-slate-600 dark:text-slate-300 overflow-hidden">
              {member.profilephoto ? <img src={getImageUrl(member.profilephoto)} alt={member.fullname} className="h-full w-full object-cover" /> : member.fullname?.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">{member.fullname}</h3>
              <p className="text-sm text-slate-500">{member.gender} · Joined {new Date(member.joiningdate).toLocaleDateString()}</p>
            </div>
          </div>
          <label className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300">
            <span>Status</span>
            <select value={status} onChange={(event) => updateStatus.mutate(event.target.value)} disabled={updateStatus.isPending} className="input-field w-auto min-w-32">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 border-t border-slate-200 dark:border-slate-800 pt-6">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><Mail className="h-4 w-4 text-primary" />{member.email}</div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><Phone className="h-4 w-4 text-primary" />{member.phone}</div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><Calendar className="h-4 w-4 text-primary" />{member.dateofbirth || 'N/A'}</div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><User className="h-4 w-4 text-primary" />{member.emergency || 'No Emergency Contact'}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white"><Activity className="h-5 w-5 text-primary" />Health Metrics</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500">Height</p>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{member.height ? `${member.height} cm` : 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Weight</p>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{member.weight ? `${member.weight} kg` : 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Blood Group</p>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{member.bloodgroup || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Fitness Goal</p>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300 capitalize">{member.fitnessgoal?.replace('_', ' ') || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white"><CreditCard className="h-5 w-5 text-primary" />Membership & Trainer</div>
          </div>
          <div className="space-y-4">
            {member.MembershipPlan ? (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500 mb-1">Active Plan</p>
                <div className="flex justify-between items-center">
                  <p className="font-bold text-slate-800 dark:text-slate-200">{member.MembershipPlan.name}</p>
                  <p className="text-sm text-primary font-bold">₹{member.MembershipPlan.price}</p>
                </div>
                <p className="text-xs text-slate-500 mt-1">{member.MembershipPlan.durationInMonths} Months</p>
              </div>
            ) : (
              <p className="text-sm text-slate-500">No active membership plan.</p>
            )}

            {member.Trainer ? (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center gap-3 cursor-pointer hover:border-primary/30 transition-colors" onClick={() => navigate(`/trainers/${member.Trainer.id}`)}>
                <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0 flex items-center justify-center font-bold text-slate-500 overflow-hidden">
                  {member.Trainer.profilephoto ? <img src={getImageUrl(member.Trainer.profilephoto)} alt={member.Trainer.fullname} className="h-full w-full object-cover" /> : member.Trainer.fullname?.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-500">Assigned Trainer</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{member.Trainer.fullname}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">No trainer assigned.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetail;
