import React from 'react';
import { ArrowLeft, Mail, Phone, Calendar, Briefcase, Users, Dumbbell, Salad, DollarSign } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { trainersApi } from '../../services/api';
import { getApiErrorMessage } from '../../services/apiClient';

const formatStatus = (status) => status === 'active' ? 'Active' : 'Inactive';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const baseUrl = import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace('/api', '') : 'http://localhost:3000';
  return `${baseUrl}${path}`;
};
const TrainerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: trainer, isLoading, isError } = useQuery({
    queryKey: ['trainer', id],
    queryFn: () => trainersApi.get(id),
  });
  const updateStatus = useMutation({
    mutationFn: (status) => trainersApi.updateStatus({ id, status }),
    onSuccess: (_, status) => {
      queryClient.invalidateQueries({ queryKey: ['trainer', id] });
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
      toast.success(`Trainer marked ${formatStatus(status).toLowerCase()}.`);
    },
    onError: error => toast.error(getApiErrorMessage(error, 'Unable to update trainer status.')),
  });

  if (isLoading) return <p className="text-sm text-slate-500">Loading trainer details...</p>;
  if (isError || !trainer) return <p className="text-sm text-danger">Unable to load trainer details.</p>;

  const status = trainer.status === 'active' ? 'active' : 'inactive';
  const collections = [
    { key: 'Members', label: 'Members', icon: Users },
    { key: 'Workouts', label: 'Workouts', icon: Dumbbell },
    { key: 'Diets', label: 'Diets', icon: Salad },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/trainers')} className="btn-outline p-2" title="Back to trainers">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Trainer Details</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Review trainer information and activity.</p>
          </div>
        </div>
        <button onClick={() => navigate(`/trainers/edit/${trainer.id}`)} className="btn-primary text-sm">Edit Trainer</button>
      </div>

      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-2xl font-bold text-slate-600 dark:text-slate-300 overflow-hidden">
              {trainer.profilephoto ? <img src={getImageUrl(trainer.profilephoto)} alt={trainer.fullname} className="h-full w-full object-cover" /> : trainer.fullname.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">{trainer.fullname}</h3>
              <p className="text-sm text-slate-500">{trainer.speciality} · {trainer.experience} years experience</p>
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
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 border-t border-slate-200 dark:border-slate-800 pt-6">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><Mail className="h-4 w-4 text-primary" />{trainer.email}</div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><Phone className="h-4 w-4 text-primary" />{trainer.phone}</div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><Calendar className="h-4 w-4 text-primary" />{trainer.dateofbirth || 'Date not provided'}</div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><Briefcase className="h-4 w-4 text-primary" />{trainer.shifttiming}</div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><DollarSign className="h-4 w-4 text-primary" />${trainer.monthlysalary} / month</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {collections.map(({ key, label, icon: Icon }) => (
          <div key={key} className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white"><Icon className="h-5 w-5 text-primary" />{label}</div>
              <span className="text-lg font-bold text-slate-700 dark:text-slate-200">{trainer[key]?.length ?? 0}</span>
            </div>
            
            {key === 'Members' && trainer[key]?.length > 0 ? (
              <div className="mt-4 space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {trainer[key].map(member => (
                  <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0 flex items-center justify-center font-bold text-slate-500 overflow-hidden">
                      {member.profilephoto ? <img src={getImageUrl(member.profilephoto)} alt={member.fullname} className="h-full w-full object-cover" /> : member.fullname?.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{member.fullname}</p>
                      <p className="text-xs text-slate-500 truncate">{member.phone || member.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              trainer[key]?.length ? <p className="text-sm text-slate-500">Records assigned to this trainer.</p> : <p className="text-sm text-slate-500">No {label.toLowerCase()} assigned.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainerDetail;
