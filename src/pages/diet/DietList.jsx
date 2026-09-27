import Loader from '../../components/ui/Loader.jsx';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Flame, Utensils, Trash2, Sun, Coffee, Sunset, Moon, Scale, Hash, Info } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { dietsApi } from '../../services/api';
import { getApiErrorMessage } from '../../services/apiClient';

const DietList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeSession, setActiveSession] = useState('breakfast');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['diets', activeSession],
    queryFn: () => dietsApi.list({ session: activeSession }),
    onError: error => toast.error(getApiErrorMessage(error, 'Unable to load diets.'))
  });

  const counts = data?.counts || { breakfast: 0, lunch: 0, eveningsnack: 0, dinner: 0 };
  const records = data?.records || [];

  const deleteDiet = useMutation({
    mutationFn: dietsApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diets'] });
      toast.success('Diet deleted successfully!');
    },
    onError: error => toast.error(getApiErrorMessage(error, 'Unable to delete diet.')),
  });

  const getImageUrl = (foodimageurl, foodName) => {
    if (foodimageurl) return foodimageurl;
    const query = encodeURIComponent(foodName || 'healthy food');
    return `https://source.unsplash.com/random/400x300/?${query},food`;
  };

  const sessions = [
    { id: 'breakfast', label: 'Breakfast', icon: Sun, color: 'text-amber-400', count: counts.breakfast },
    { id: 'lunch', label: 'Lunch', icon: Utensils, color: 'text-orange-400', count: counts.lunch },
    { id: 'eveningsnack', label: 'Evening Snack', icon: Coffee, color: 'text-rose-400', count: counts.eveningsnack },
    { id: 'dinner', label: 'Dinner', icon: Moon, color: 'text-indigo-400', count: counts.dinner },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans text-white pb-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-wide">Diet Plans</h2>
          <p className="text-sm text-gray-400 mt-1">Manage nutrition schedules for your members</p>
        </div>
        <button onClick={() => navigate('/diet/add')} className="bg-[#FBBF24] hover:bg-yellow-400 text-black font-bold h-10 px-5 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-yellow-500/10">
          <Plus className="h-4 w-4" /> Add Diet Item
        </button>
      </div>

      {/* Session Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {sessions.map((session) => (
          <button
            key={session.id}
            onClick={() => setActiveSession(session.id)}
            className={`relative p-4 rounded-xl border transition-all duration-300 text-left overflow-hidden group ${activeSession === session.id
              ? 'bg-[#16181d] border-[#FBBF24] shadow-[0_0_20px_rgba(251,191,36,0.15)]'
              : 'bg-[#0d0e12] border-white/5 hover:border-white/20 hover:bg-[#16181d]'
              }`}
          >
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full bg-gradient-to-bl from-white/5 to-transparent transition-transform duration-500 ${activeSession === session.id ? 'scale-110' : 'group-hover:scale-110'}`}></div>
            <div className="flex justify-between items-start relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <session.icon className={`h-5 w-5 ${session.color}`} />
                <h3 className={`font-bold tracking-wide ${activeSession === session.id ? 'text-[#FBBF24]' : 'text-gray-300'}`}>
                  {session.label}
                </h3>
              </div>
            </div>
            <p className="text-xs text-gray-500 font-medium relative z-10 mt-1">
              <span className="text-gray-300 font-bold text-lg mr-1">{session.count}</span> Items Scheduled
            </p>
          </button>
        ))}
      </div>

      {isLoading && <div className="flex justify-center p-12 w-full"><Loader /></div>}
      {isError && <p className="text-sm text-red-500 bg-red-500/10 p-4 rounded-lg border border-red-500/20">Unable to load diet data. Please try again.</p>}

      {/* List Layout */}
      {!isLoading && !isError && (
        <div className="space-y-4 mt-8">
          {records.map((diet) => (
            <div key={diet.id} className="relative bg-[#0d0e12] border border-gray-800/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-5 hover:border-[#FBBF24]/30 hover:bg-[#16181d] transition-all duration-300 shadow-lg group">

              {/* Image */}
              <div className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-lg overflow-hidden relative bg-[#0a0a0a]">
                <img
                  src={getImageUrl(diet.foodimageurl, diet.foodName)}
                  alt={diet.foodName}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-base font-bold text-gray-50 tracking-wide truncate group-hover:text-[#FBBF24] transition-colors">
                    {diet.foodName}
                  </h3>
                  <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] font-bold text-[#FBBF24] tracking-wider uppercase">
                    {diet.session}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-2">
                  {diet.isQuantity && diet.quantity && (
                    <div className="px-2 py-0.5 border border-blue-500/30 bg-blue-500/10 text-blue-400 rounded text-[10px] font-bold tracking-wider flex items-center gap-1">
                      <Hash className="h-3 w-3" /> Qty: {diet.quantity}
                    </div>
                  )}
                  {diet.isGrams && diet.grams && (
                    <div className="px-2 py-0.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 rounded text-[10px] font-bold tracking-wider flex items-center gap-1">
                      <Scale className="h-3 w-3" /> {diet.grams}g
                    </div>
                  )}
                </div>

                {diet.description && (
                  <p className="text-[11px] text-gray-400 line-clamp-1 sm:pr-8">
                    {diet.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 sm:ml-auto w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-gray-800/60 sm:border-t-0">
                <button
                  onClick={() => navigate(`/diet/edit/${diet.id}`, { state: { dietData: diet } })}
                  className="flex-1 sm:flex-none px-4 bg-white/5 hover:bg-[#FBBF24] text-gray-300 hover:text-black font-bold text-[11px] h-9 rounded-lg transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => { if (window.confirm('Delete this diet item?')) deleteDiet.mutate(diet.id); }}
                  className="h-9 w-9 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

            </div>
          ))}

          {records.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-[#0d0e12] rounded-xl border border-white/5 shadow-inner">
              <div className="w-16 h-16 bg-[#16181d] rounded-full flex items-center justify-center mb-4 border border-gray-800">
                <Utensils className="h-8 w-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-300 mb-2">No items scheduled</h3>
              <p className="text-sm text-gray-500 max-w-sm">
                There are currently no food items scheduled for the {activeSession} session. Click the "Add Diet Item" button to create one.
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default DietList;
