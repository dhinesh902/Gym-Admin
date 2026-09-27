import Loader from '../../components/ui/Loader.jsx';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Eye, Plus, Search, Filter, Phone, Mail, MoreVertical } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { trainersApi, toCollection } from '../../services/api';
import { getApiErrorMessage, IMAGE_URL } from '../../services/apiClient';

const TrainersList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, isError } = useQuery({ queryKey: ['trainers'], queryFn: trainersApi.list });
  const trainers = toCollection(data, ['trainers', 'items']);

  const deleteTrainer = useMutation({
    mutationFn: trainersApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers'] });
      toast.success('Trainer deleted successfully!');
    },
    onError: error => toast.error(getApiErrorMessage(error, 'Unable to delete trainer.')),
  });

  const filteredTrainers = trainers.filter(trainer =>
    trainer.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.speciality?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getImageUrl = (path) => {
    if (!path) return `https://ui-avatars.com/api/?name=${encodeURIComponent('Trainer')}&background=random`;
    if (path.startsWith('http')) return path;
    return `${IMAGE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-white font-sans">

      {/* Top Bar matching Image 1 */}
      <div className="flex flex-col md:flex-row gap-4 items-center w-full">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#16181d] border border-gray-800/80 rounded-xl h-12 pl-12 pr-4 text-sm text-gray-300 placeholder:text-gray-500 focus:outline-none focus:border-[#FBBF24] transition-colors shadow-sm"
            placeholder="Search by name or specialization..."
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button onClick={() => navigate('/trainers/add')} className="bg-[#FBBF24] text-black font-bold h-12 px-4 rounded-xl flex items-center gap-2 hover:bg-yellow-400 transition-colors shrink-0 whitespace-nowrap">
            <Plus className="h-5 w-5" /> Add Trainer
          </button>
        </div>
      </div>

      {isLoading && <div className="flex justify-center p-8 w-full"><Loader /></div>}
      {isError && <p className="text-sm text-red-500">Unable to load trainers.</p>}

      {/* Grid Layout replacing DataTable */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-6 md:gap-8 mt-4">
        {filteredTrainers.map(trainer => (
          <div
            key={trainer.id}
            onClick={() => navigate(`/trainers/${trainer.id}`)}
            className="cursor-pointer relative bg-gradient-to-b from-[#16181d] to-[#0a0a0a] border border-white/5 rounded-[10px] overflow-hidden shadow-2xl hover:shadow-[0_15px_50px_rgba(251,191,36,0.12)] hover:-translate-y-2 hover:border-[#FBBF24]/40 transition-all duration-500 group"
          >
            {/* Top Image Section */}
            <div className="h-44 relative w-full overflow-hidden bg-[#0a0a0a]">
              <img
                src={getImageUrl(trainer.profilephoto)}
                alt={trainer.fullname}
                className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(trainer.fullname || 'Trainer')}&background=0a0a0a&color=fff&size=200`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent"></div>

              {/* Badges Overlay */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                {trainer.status && (
                  <span className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-xl backdrop-blur-md border 
                    ${trainer.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'}
                  `}>
                    {trainer.status}
                  </span>
                )}
              </div>
            </div>

            {/* Info Section */}
            <div className="p-5 pt-0 relative z-10 flex flex-col h-[calc(100%-11rem)]">
              <h3 className="text-xl font-black text-white tracking-tight mb-1 group-hover:text-[#FBBF24] transition-colors">{trainer.fullname}</h3>
              {trainer.speciality && (
                <p className="text-[11px] text-[#FBBF24] font-bold tracking-[0.2em] uppercase mb-5">{trainer.speciality}</p>
              )}

              {/* Tags */}
              {trainer.speciality && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {trainer.speciality.split(',').map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 text-gray-300 rounded-md text-[10px] font-bold tracking-wider uppercase group-hover:bg-white/10 transition-colors">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex-1"></div>

              {/* Contact Info */}
              <div className="space-y-3 text-xs border-t border-white/10 pt-5 mt-auto">
                {trainer.phone && (
                  <div className="flex items-center gap-3 text-gray-400 group-hover:text-gray-200 transition-colors">
                    <Phone className="h-4 w-4 text-[#FBBF24]/70" />
                    <span className="font-medium tracking-wide">{trainer.phone}</span>
                  </div>
                )}
                {trainer.email && (
                  <div className="flex items-center gap-3 text-gray-400 group-hover:text-gray-200 transition-colors">
                    <Mail className="h-4 w-4 text-[#FBBF24]/70" />
                    <span className="font-medium truncate">{trainer.email}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 items-center mt-6 pt-5 border-t border-gray-800/80">
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/trainers/edit/${trainer.id}`, { state: { trainerData: trainer } }); }}
                  className="flex-1 text-[11px] font-bold text-black bg-[#FBBF24] hover:bg-yellow-400 border border-[#FBBF24] h-10 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(251,191,36,0.2)] hover:shadow-[0_0_25px_rgba(251,191,36,0.4)]"
                >
                  <Edit className="h-4 w-4" /> Edit Profile
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); if (window.confirm('Delete this trainer?')) deleteTrainer.mutate(trainer.id); }}
                  className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shrink-0 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {!isLoading && filteredTrainers.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500">
            No trainers found.
          </div>
        )}
      </div>

    </div>
  );
};

export default TrainersList;
