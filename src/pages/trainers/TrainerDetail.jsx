import Loader from '../../components/ui/Loader.jsx';
import React from 'react';
import { ArrowLeft, Mail, Phone, Calendar, Briefcase, Users, Dumbbell, Salad, DollarSign, ShieldCheck } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { trainersApi } from '../../services/api';
import { getApiErrorMessage, IMAGE_URL } from '../../services/apiClient';

const formatStatus = (status) => status === 'active' ? 'Active' : 'Inactive';

const getImageUrl = (path, name) => {
  if (!path) return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Trainer')}&background=1a1d24&color=FBBF24&size=200`;
  if (path.startsWith('http')) return path;
  return `${IMAGE_URL}${path.startsWith('/') ? path : `/${path}`}`;
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

  if (isLoading) return <div className="flex justify-center p-12 w-full"><Loader /></div>;
  if (isError || !trainer) return <div className="p-8 text-center text-red-500 bg-red-500/10 rounded-xl border border-red-500/20 max-w-md mx-auto mt-10">Unable to load trainer details.</div>;

  const status = trainer.status?.toLowerCase() === 'active' ? 'active' : 'inactive';
  const collections = [
    { key: 'Members', label: 'Members', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { key: 'Workouts', label: 'Workouts', icon: Dumbbell, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    { key: 'Diets', label: 'Diets', icon: Salad, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans text-white pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0d0e12] p-5 rounded-2xl border border-white/5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#FBBF24]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex items-center gap-4 relative z-10">
          <button onClick={() => navigate('/trainers')} className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl transition-all border border-white/10" title="Back to trainers">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-black tracking-wide text-white">Trainer Profile</h2>
            <p className="text-[11px] text-gray-400 mt-1 uppercase tracking-widest font-bold">Review trainer information and activity</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto relative z-10">
          <select 
            value={status} 
            onChange={(e) => updateStatus.mutate(e.target.value)} 
            disabled={updateStatus.isPending} 
            className="bg-[#16181d] border border-gray-800 rounded-xl h-10 px-4 text-xs font-bold text-gray-300 focus:outline-none focus:border-[#FBBF24] transition-colors shadow-sm cursor-pointer appearance-none uppercase tracking-wider flex-1 sm:flex-none min-w-[120px]"
          >
            <option value="active">🟢 ACTIVE</option>
            <option value="inactive">🔴 INACTIVE</option>
          </select>
          <button onClick={() => navigate(`/trainers/edit/${trainer.id}`)} className="flex-1 sm:flex-none bg-[#FBBF24] hover:bg-yellow-400 text-black font-bold h-10 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(251,191,36,0.2)]">
            Edit Trainer
          </button>
        </div>
      </div>

      {/* Main Identity Card */}
      <div className="relative bg-gradient-to-b from-[#16181d] to-[#0a0a0a] border border-white/5 rounded-[1.5rem] p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10 relative z-10">
          <div className="h-32 w-32 md:h-40 md:w-40 rounded-2xl bg-[#0a0a0a] border-2 border-[#FBBF24]/30 p-1 flex-shrink-0 shadow-[0_0_30px_rgba(251,191,36,0.15)] relative group">
            <div className="h-full w-full rounded-xl overflow-hidden relative">
              <img src={getImageUrl(trainer.profilephoto, trainer.fullname)} alt={trainer.fullname} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60"></div>
            </div>
            <div className="absolute -bottom-3 -right-3 bg-[#16181d] p-2 rounded-xl border border-white/10 shadow-xl">
              <ShieldCheck className={`h-6 w-6 ${status === 'active' ? 'text-emerald-400' : 'text-red-400'}`} />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight">{trainer.fullname}</h3>
              {trainer.speciality && <span className="px-3 py-1 bg-[#FBBF24]/10 border border-[#FBBF24]/30 rounded-md text-[10px] font-bold tracking-widest text-[#FBBF24] uppercase">{trainer.speciality}</span>}
            </div>
            <p className="text-sm text-gray-400 font-medium tracking-wide mb-6">{trainer.experience} years experience &bull; Master Trainer</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="bg-[#0a0a0a]/50 p-3.5 rounded-xl border border-white/5 flex items-center gap-3">
                <div className="bg-blue-500/10 p-2 rounded-lg border border-blue-500/20"><Mail className="h-4 w-4 text-blue-400" /></div>
                <div className="min-w-0"><p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">Email</p><p className="text-xs text-gray-200 font-medium truncate">{trainer.email}</p></div>
              </div>
              <div className="bg-[#0a0a0a]/50 p-3.5 rounded-xl border border-white/5 flex items-center gap-3">
                <div className="bg-green-500/10 p-2 rounded-lg border border-green-500/20"><Phone className="h-4 w-4 text-green-400" /></div>
                <div className="min-w-0"><p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">Phone</p><p className="text-xs text-gray-200 font-medium truncate">{trainer.phone}</p></div>
              </div>
              <div className="bg-[#0a0a0a]/50 p-3.5 rounded-xl border border-white/5 flex items-center gap-3">
                <div className="bg-purple-500/10 p-2 rounded-lg border border-purple-500/20"><Calendar className="h-4 w-4 text-purple-400" /></div>
                <div className="min-w-0"><p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">Date of Birth</p><p className="text-xs text-gray-200 font-medium truncate">{trainer.dateofbirth || 'N/A'}</p></div>
              </div>
              <div className="bg-[#0a0a0a]/50 p-3.5 rounded-xl border border-white/5 flex items-center gap-3">
                <div className="bg-[#FBBF24]/10 p-2 rounded-lg border border-[#FBBF24]/20"><DollarSign className="h-4 w-4 text-[#FBBF24]" /></div>
                <div className="min-w-0"><p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">Salary</p><p className="text-xs text-[#FBBF24] font-black truncate">${trainer.monthlysalary} <span className="text-[9px] text-gray-500 font-bold">/mo</span></p></div>
              </div>
            </div>
            
            {trainer.shifttiming && (
               <div className="mt-4 bg-[#0a0a0a]/50 p-3.5 rounded-xl border border-white/5 flex items-center gap-3 w-fit">
                <div className="bg-orange-500/10 p-2 rounded-lg border border-orange-500/20"><Briefcase className="h-4 w-4 text-orange-400" /></div>
                <div className="min-w-0"><p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">Shift Timing</p><p className="text-xs text-gray-200 font-medium truncate">{trainer.shifttiming}</p></div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {collections.map(({ key, label, icon: Icon, color, bg, border }) => (
          <div key={key} className="bg-[#0d0e12] border border-white/5 rounded-[1.5rem] p-6 shadow-xl relative overflow-hidden group hover:border-white/10 transition-colors h-full flex flex-col">
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className={`${bg} p-2.5 rounded-xl border ${border} ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-wide">{label}</h3>
              </div>
              <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm font-black text-white shadow-inner">{trainer[key]?.length ?? 0}</div>
            </div>

            <div className="flex-1 relative z-10">
              {key === 'Members' && trainer[key]?.length > 0 ? (
                <div className="space-y-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                  {trainer[key].map(member => (
                    <div key={member.id} className="flex items-center gap-4 p-3 bg-gradient-to-r from-[#16181d] to-[#0a0a0a] rounded-xl border border-white/5 hover:border-[#FBBF24]/30 hover:shadow-[0_0_15px_rgba(251,191,36,0.1)] transition-all cursor-pointer group/member" onClick={() => navigate(`/members/${member.id}`)}>
                      <div className="h-12 w-12 rounded-xl bg-[#0a0a0a] flex-shrink-0 flex items-center justify-center font-black text-gray-500 overflow-hidden border border-white/10 group-hover/member:border-[#FBBF24]/30">
                        <img src={getImageUrl(member.profilephoto, member.fullname)} alt={member.fullname} className="h-full w-full object-cover opacity-80 group-hover/member:opacity-100 group-hover/member:scale-110 transition-all duration-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-black text-white truncate group-hover/member:text-[#FBBF24] transition-colors">{member.fullname}</p>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5 truncate">{member.phone || member.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-8 bg-[#16181d]/50 rounded-xl border border-dashed border-gray-800 text-center">
                  <Icon className="h-8 w-8 text-gray-700 mb-3" />
                  <p className="text-sm text-gray-500 font-bold tracking-wide">
                    {trainer[key]?.length ? 'Records assigned to this trainer.' : `No ${label.toLowerCase()} assigned.`}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainerDetail;
