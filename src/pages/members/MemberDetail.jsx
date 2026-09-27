import Loader from '../../components/ui/Loader.jsx';
import React from 'react';
import { ArrowLeft, Mail, Phone, Calendar, User, Activity, CreditCard, Droplet, Dumbbell, ShieldCheck, FileText } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { membersApi } from '../../services/api';
import apiClient, { getApiErrorMessage, IMAGE_URL } from '../../services/apiClient';

const getImageUrl = (path, name) => {
  if (!path) return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=1a1d24&color=FBBF24&size=200`;
  if (path.startsWith('http')) return path;
  return `${IMAGE_URL}${path.startsWith('/') ? path : `/${path}`}`;
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

  if (isLoading) return <div className="flex justify-center p-12 w-full"><Loader /></div>;
  if (isError || !member) return <div className="p-8 text-center text-red-500 bg-red-500/10 rounded-xl border border-red-500/20 max-w-md mx-auto mt-10">Unable to load member details.</div>;

  const status = member.status?.toLowerCase() === 'active' ? 'active' : 'inactive';
  
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans text-white pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0d0e12] p-5 rounded-2xl border border-white/5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#FBBF24]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex items-center gap-4 relative z-10">
          <button onClick={() => navigate('/members')} className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-xl transition-all border border-white/10" title="Back to members">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-black tracking-wide text-white">Member Profile</h2>
            <p className="text-[11px] text-gray-400 mt-1 uppercase tracking-widest font-bold">Review information and plan details</p>
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
          <button onClick={() => navigate(`/members/edit/${member.id}`)} className="flex-1 sm:flex-none bg-[#FBBF24] hover:bg-yellow-400 text-black font-bold h-10 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(251,191,36,0.2)]">
            Edit Member
          </button>
        </div>
      </div>

      {/* Main Identity Card */}
      <div className="relative bg-gradient-to-b from-[#16181d] to-[#0a0a0a] border border-white/5 rounded-[1.5rem] p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10 relative z-10">
          <div className="h-32 w-32 md:h-40 md:w-40 rounded-2xl bg-[#0a0a0a] border-2 border-[#FBBF24]/30 p-1 flex-shrink-0 shadow-[0_0_30px_rgba(251,191,36,0.15)] relative group">
            <div className="h-full w-full rounded-xl overflow-hidden relative">
              <img src={getImageUrl(member.profilephoto, member.fullname)} alt={member.fullname} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60"></div>
            </div>
            <div className="absolute -bottom-3 -right-3 bg-[#16181d] p-2 rounded-xl border border-white/10 shadow-xl">
              <ShieldCheck className={`h-6 w-6 ${status === 'active' ? 'text-emerald-400' : 'text-red-400'}`} />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight">{member.fullname}</h3>
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-bold tracking-widest text-[#FBBF24] uppercase">ID: {member.id}</span>
            </div>
            <p className="text-sm text-gray-400 font-medium tracking-wide mb-6">{member.gender} &bull; Joined {new Date(member.joiningdate).toLocaleDateString()}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="bg-[#0a0a0a]/50 p-3.5 rounded-xl border border-white/5 flex items-center gap-3">
                <div className="bg-blue-500/10 p-2 rounded-lg border border-blue-500/20"><Mail className="h-4 w-4 text-blue-400" /></div>
                <div className="min-w-0"><p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">Email</p><p className="text-xs text-gray-200 font-medium truncate">{member.email}</p></div>
              </div>
              <div className="bg-[#0a0a0a]/50 p-3.5 rounded-xl border border-white/5 flex items-center gap-3">
                <div className="bg-green-500/10 p-2 rounded-lg border border-green-500/20"><Phone className="h-4 w-4 text-green-400" /></div>
                <div className="min-w-0"><p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">Phone</p><p className="text-xs text-gray-200 font-medium truncate">{member.phone}</p></div>
              </div>
              <div className="bg-[#0a0a0a]/50 p-3.5 rounded-xl border border-white/5 flex items-center gap-3">
                <div className="bg-purple-500/10 p-2 rounded-lg border border-purple-500/20"><Calendar className="h-4 w-4 text-purple-400" /></div>
                <div className="min-w-0"><p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">Date of Birth</p><p className="text-xs text-gray-200 font-medium truncate">{member.dateofbirth || 'N/A'}</p></div>
              </div>
              <div className="bg-[#0a0a0a]/50 p-3.5 rounded-xl border border-white/5 flex items-center gap-3">
                <div className="bg-red-500/10 p-2 rounded-lg border border-red-500/20"><User className="h-4 w-4 text-red-400" /></div>
                <div className="min-w-0"><p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">Emergency</p><p className="text-xs text-gray-200 font-medium truncate">{member.emergency || 'N/A'}</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Health Metrics */}
        <div className="bg-[#0d0e12] border border-white/5 rounded-[1.5rem] p-6 shadow-xl relative overflow-hidden group hover:border-white/10 transition-colors">
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 text-emerald-400">
              <Activity className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-wide">Health Metrics</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4 relative z-10">
            <div className="bg-[#16181d] p-4 rounded-xl border border-gray-800/80 group-hover:border-white/10 transition-colors">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><ArrowLeft className="h-3 w-3 rotate-90" /> Height</p>
              <p className="text-lg font-black text-white">{member.height ? <>{member.height} <span className="text-[11px] text-emerald-400">cm</span></> : <span className="text-gray-600">N/A</span>}</p>
            </div>
            <div className="bg-[#16181d] p-4 rounded-xl border border-gray-800/80 group-hover:border-white/10 transition-colors">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Dumbbell className="h-3 w-3" /> Weight</p>
              <p className="text-lg font-black text-white">{member.weight ? <>{member.weight} <span className="text-[11px] text-emerald-400">kg</span></> : <span className="text-gray-600">N/A</span>}</p>
            </div>
            <div className="bg-[#16181d] p-4 rounded-xl border border-gray-800/80 group-hover:border-white/10 transition-colors">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Droplet className="h-3 w-3" /> Blood Group</p>
              <p className="text-lg font-black text-white">{member.bloodgroup || <span className="text-gray-600">N/A</span>}</p>
            </div>
            <div className="bg-[#16181d] p-4 rounded-xl border border-gray-800/80 group-hover:border-white/10 transition-colors">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><FileText className="h-3 w-3" /> Fitness Goal</p>
              <p className="text-sm font-bold text-white capitalize mt-1 leading-tight">{member.fitnessgoal?.replace('_', ' ') || <span className="text-gray-600">N/A</span>}</p>
            </div>
          </div>
        </div>

        {/* Membership & Trainer */}
        <div className="bg-[#0d0e12] border border-white/5 rounded-[1.5rem] p-6 shadow-xl relative overflow-hidden group hover:border-[#FBBF24]/10 transition-colors">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#FBBF24]/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="bg-[#FBBF24]/10 p-2.5 rounded-xl border border-[#FBBF24]/20 text-[#FBBF24]">
              <CreditCard className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-wide">Membership & Trainer</h3>
          </div>
          
          <div className="space-y-4 relative z-10 h-full flex flex-col">
            {member.MembershipPlan ? (
              <div className="p-4 bg-gradient-to-r from-[#16181d] to-[#0a0a0a] rounded-xl border border-white/5 shadow-inner">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-[10px] text-[#FBBF24] font-bold uppercase tracking-widest mb-1">Active Plan</p>
                    <p className="text-lg font-black text-white">{member.MembershipPlan.name}</p>
                  </div>
                  <div className="bg-[#FBBF24]/10 border border-[#FBBF24]/20 px-3 py-1.5 rounded-lg">
                    <p className="text-sm text-[#FBBF24] font-black">₹{member.MembershipPlan.price}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 text-xs font-medium text-gray-400">
                  <Calendar className="h-3.5 w-3.5" /> Duration: <span className="text-gray-200 font-bold">{member.MembershipPlan.durationInMonths} Months</span>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-[#16181d] rounded-xl border border-dashed border-gray-700 text-center">
                <p className="text-sm text-gray-500 font-medium tracking-wide">No active membership plan assigned.</p>
              </div>
            )}

            {member.Trainer ? (
              <div 
                className="p-4 bg-gradient-to-r from-[#16181d] to-[#0a0a0a] rounded-xl border border-white/5 flex items-center gap-4 cursor-pointer hover:border-[#FBBF24]/30 hover:shadow-[0_0_15px_rgba(251,191,36,0.1)] transition-all group/trainer mt-2" 
                onClick={() => navigate(`/trainers/${member.Trainer.id}`)}
              >
                <div className="h-12 w-12 rounded-xl bg-[#0a0a0a] flex-shrink-0 flex items-center justify-center font-black text-gray-500 overflow-hidden border border-white/10 group-hover/trainer:border-[#FBBF24]/30 transition-colors">
                  <img src={getImageUrl(member.Trainer.profilephoto, member.Trainer.fullname)} alt={member.Trainer.fullname} className="h-full w-full object-cover opacity-80 group-hover/trainer:opacity-100 group-hover/trainer:scale-110 transition-all duration-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-[#FBBF24] font-bold uppercase tracking-widest mb-0.5">Assigned Trainer</p>
                  <p className="text-sm font-black text-white truncate">{member.Trainer.fullname}</p>
                </div>
                <div className="p-2 bg-white/5 rounded-lg group-hover/trainer:bg-[#FBBF24] group-hover/trainer:text-black text-gray-400 transition-colors">
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </div>
              </div>
            ) : (
              <div className="p-6 bg-[#16181d] rounded-xl border border-dashed border-gray-700 text-center mt-2 flex-1 flex items-center justify-center">
                <p className="text-sm text-gray-500 font-medium tracking-wide">No trainer assigned.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MemberDetail;
