import Loader from '../../components/ui/Loader.jsx';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Search, Filter, Phone, Mail, MoreVertical, Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { membersApi, toCollection } from '../../services/api';
import { getApiErrorMessage, IMAGE_URL } from '../../services/apiClient';

const MembersList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, isError } = useQuery({ queryKey: ['members'], queryFn: membersApi.list });
  const members = toCollection(data, ['members', 'items']);

  const deleteMember = useMutation({
    mutationFn: membersApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['members'] }),
    onError: (error) => toast.error(getApiErrorMessage(error, 'Unable to delete member.')),
  });

  const getImageUrl = (path, name) => {
    if (!path) return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=1a1d24&color=FBBF24`;
    if (path.startsWith('http')) return path;
    return `${IMAGE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  };

  const filteredMembers = members.filter(m =>
    m.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.phone?.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans text-white">

      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-2xl font-bold tracking-wide">Members</h2>
          <p className="text-sm text-gray-400 mt-1">Manage all your gym members here.</p>
        </div>
        <button onClick={() => navigate('/members/add')} className="bg-[#FBBF24] text-black font-bold h-10 px-4 rounded-xl flex items-center gap-2 hover:bg-yellow-400 transition-colors shrink-0 md:hidden">
          <UserPlus className="h-4 w-4" /> Add
        </button>
      </div>

      {/* Top Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center w-full">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#16181d] border border-gray-800/80 rounded-xl h-12 pl-12 pr-4 text-sm text-gray-300 placeholder:text-gray-500 focus:outline-none focus:border-[#FBBF24] transition-colors shadow-sm"
            placeholder="Search by name, phone, or membership ID..."
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button onClick={() => navigate('/members/add')} className="hidden md:flex bg-[#FBBF24] text-black font-bold h-12 px-5 rounded-xl items-center gap-2 hover:bg-yellow-400 transition-colors shrink-0 whitespace-nowrap">
            <UserPlus className="h-5 w-5" /> Add Member
          </button>
        </div>
      </div>

      {isLoading && <div className="flex justify-center p-8 w-full"><Loader /></div>}
      {isError && <p className="text-sm text-red-500">Unable to load members.</p>}

      {/* Grid Layout replacing DataTable */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8 mt-4">
        {filteredMembers.map((member, index) => {
          const status = member.status || 'Active';
          const isExpired = status.toLowerCase() === 'expired';
          const plan = member.membershipPlan;

          return (
            <div 
              key={member.id} 
              onClick={() => navigate(`/members/${member.id}`)}
              className="cursor-pointer relative bg-gradient-to-b from-[#16181d] to-[#0a0a0a] border border-white/5 rounded-[10px] overflow-hidden shadow-2xl hover:shadow-[0_15px_50px_rgba(251,191,36,0.12)] hover:-translate-y-2 hover:border-[#FBBF24]/40 transition-all duration-500 group"
            >
              {/* Top Image Section */}
              <div className="h-44 relative w-full overflow-hidden bg-[#0a0a0a]">
                <img
                  src={getImageUrl(member.profilephoto, member.fullname)}
                  alt={member.fullname}
                  className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.fullname || 'User')}&background=0a0a0a&color=fff&size=200`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent"></div>

                {/* Badges Overlay */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  {member.status && (
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-xl backdrop-blur-md border 
                      ${!isExpired ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}
                    `}>
                      {status}
                    </span>
                  )}
                </div>
              </div>

              {/* Info Section */}
              <div className="p-5 pt-0 relative z-10 flex flex-col h-[calc(100%-11rem)]">
                <h3 className="text-xl font-black text-white tracking-tight mb-1 truncate group-hover:text-[#FBBF24] transition-colors">{member.fullname}</h3>
                <p className="text-[11px] text-[#FBBF24] font-bold tracking-[0.2em] uppercase mb-5">ID: {member.id}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {plan && (
                    <span className="px-3 py-1 bg-white/5 border border-white/10 text-gray-300 rounded-md text-[10px] font-bold tracking-wider uppercase group-hover:bg-white/10 transition-colors">
                      {plan} Plan
                    </span>
                  )}
                  {member.joinedDate && (
                    <span className="px-3 py-1 bg-black/50 border border-white/5 text-gray-400 rounded-md text-[10px] font-bold tracking-wider uppercase">
                      {new Date(member.joinedDate).getFullYear()}
                    </span>
                  )}
                </div>

                <div className="flex-1"></div>

                {/* Contact Info */}
                <div className="space-y-3 text-xs border-t border-white/10 pt-5 mt-auto">
                  {member.phone && (
                    <div className="flex items-center gap-3 text-gray-400 group-hover:text-gray-200 transition-colors">
                      <Phone className="h-4 w-4 text-[#FBBF24]/70 shrink-0" />
                      <span className="font-medium tracking-wide truncate">{member.phone}</span>
                    </div>
                  )}
                  {member.email && (
                    <div className="flex items-center gap-3 text-gray-400 group-hover:text-gray-200 transition-colors">
                      <Mail className="h-4 w-4 text-[#FBBF24]/70 shrink-0" />
                      <span className="font-medium truncate">{member.email}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 items-center mt-6 pt-5 border-t border-gray-800/80">
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/members/${member.id}`); }}
                    className="flex-1 text-[11px] font-bold text-black bg-[#FBBF24] hover:bg-yellow-400 border border-[#FBBF24] h-10 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(251,191,36,0.2)] hover:shadow-[0_0_25px_rgba(251,191,36,0.4)]"
                  >
                    View Details
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); if (window.confirm('Delete this member?')) deleteMember.mutate(member.id); }}
                    className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shrink-0 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {!isLoading && filteredMembers.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500">
            No members found.
          </div>
        )}
      </div>

    </div>
  );
};

export default MembersList;
