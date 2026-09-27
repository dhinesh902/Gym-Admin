import Loader from '../../components/ui/Loader.jsx';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Clock, ClipboardList, Edit, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { workoutsApi, toCollection } from '../../services/api';
import { getApiErrorMessage, IMAGE_URL } from '../../services/apiClient';

const WorkoutsList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data, isLoading, isError } = useQuery({ queryKey: ['workouts'], queryFn: workoutsApi.list, onError: error => toast.error(getApiErrorMessage(error, 'Unable to load workouts.')) });
  const workouts = toCollection(data, ['workouts', 'items']);
  const queryClient = useQueryClient();

  const deleteWorkout = useMutation({
    mutationFn: workoutsApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
      toast.success('Workout deleted successfully!');
    },
    onError: error => toast.error(getApiErrorMessage(error, 'Unable to delete workout.')),
  });

  const getImageUrl = (path, title) => {
    if (!path) return `https://ui-avatars.com/api/?name=${encodeURIComponent(title || 'W')}&background=1a1d24&color=FBBF24`;
    if (path.startsWith('http')) return path;
    return `${IMAGE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  };

  const filteredWorkouts = workouts.filter(w => 
    w.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    w.targetmuscle?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans text-white">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-wide">Workouts</h2>
          <p className="text-sm text-gray-400 mt-1">Manage and assign workout routines for your members</p>
        </div>
        <button onClick={() => navigate('/workouts/add')} className="bg-[#FBBF24] hover:bg-yellow-400 text-black font-bold h-10 px-5 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-yellow-500/10">
          <Plus className="h-4 w-4" /> Add Workout
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center w-full mt-4">
        <div className="relative flex-1 w-full max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-500" />
          </div>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#16181d] border border-gray-800 rounded-lg h-10 pl-11 pr-4 text-sm text-gray-300 placeholder:text-gray-500 focus:outline-none focus:border-[#FBBF24] transition-colors shadow-sm"
            placeholder="Search workouts..."
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <select className="bg-[#16181d] border border-gray-800 rounded-lg h-10 px-4 text-sm text-gray-300 focus:outline-none focus:border-[#FBBF24] cursor-pointer outline-none min-w-[140px]">
            <option>All Goals</option>
            <option>Muscle Gain</option>
            <option>Fat Loss</option>
          </select>
          <select className="bg-[#16181d] border border-gray-800 rounded-lg h-10 px-4 text-sm text-gray-300 focus:outline-none focus:border-[#FBBF24] cursor-pointer outline-none min-w-[140px]">
            <option>All Levels</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
          <select className="bg-[#16181d] border border-gray-800 rounded-lg h-10 px-4 text-sm text-gray-300 focus:outline-none focus:border-[#FBBF24] cursor-pointer outline-none min-w-[140px]">
            <option>All Trainers</option>
          </select>
        </div>
      </div>

      {isLoading && <div className="flex justify-center p-8 w-full"><Loader /></div>}
      {isError && <p className="text-sm text-red-500">Unable to load workouts.</p>}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-6">
        {filteredWorkouts.map((workout) => (
          <div key={workout.id} className="relative bg-[#0d0e12] border border-white/5 rounded-xl overflow-hidden shadow-2xl hover:shadow-[0_8px_30px_rgba(251,191,36,0.08)] hover:-translate-y-1 hover:border-[#FBBF24]/30 transition-all duration-500 group">
            
            <div className="h-32 md:h-36 relative w-full overflow-hidden bg-[#0a0a0a]">
              <img 
                src={getImageUrl(workout.workoutimage, workout.title)} 
                alt={workout.title} 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e12] via-transparent to-transparent"></div>
            </div>

            <div className="p-4 relative z-10">
              <h3 className="text-[15px] font-bold text-gray-50 tracking-wide mb-3 truncate group-hover:text-[#FBBF24] transition-colors">{workout.title}</h3>
              
              {/* Pills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {workout.targetmuscle && (
                  <span className="px-2 py-0.5 border border-blue-500/30 text-blue-400 rounded-md text-[10px] font-bold tracking-wider uppercase">
                    {workout.targetmuscle}
                  </span>
                )}
                {workout.difficultlevel && (
                  <span className="px-2 py-0.5 border border-emerald-500/30 text-emerald-400 rounded-md text-[10px] font-bold tracking-wider uppercase">
                    {workout.difficultlevel}
                  </span>
                )}
              </div>

              {/* Specs */}
              <div className="flex items-center gap-4 text-[11px] text-gray-400 font-medium mb-5">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3 w-3 text-[#FBBF24]" />
                  <span>{workout.duration || 0} mins</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ClipboardList className="h-3 w-3 text-[#FBBF24]" />
                  <span>{workout.sets ? `${workout.sets} Exercises` : '0 Exercises'}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-2 border-t border-white/5">
                <button 
                  onClick={() => navigate(`/workouts/${workout.id}`)}
                  className="text-[11px] font-bold text-[#FBBF24] hover:text-black hover:bg-[#FBBF24] border border-[#FBBF24]/30 px-3 py-1.5 rounded-md transition-colors"
                >
                  View Details
                </button>
                <div className="flex gap-1.5">
                  <button 
                    onClick={() => navigate(`/workouts/edit/${workout.id}`)}
                    className="w-7 h-7 rounded-md bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#FBBF24]/20 hover:text-[#FBBF24] transition-colors"
                    title="Edit Workout"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button 
                    onClick={() => { if(window.confirm('Delete workout?')) deleteWorkout.mutate(workout.id); }} 
                    className="w-7 h-7 rounded-md bg-white/5 flex items-center justify-center text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                    title="Delete Workout"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {!isLoading && filteredWorkouts.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500">
            No workouts found.
          </div>
        )}
      </div>

    </div>
  );
};

export default WorkoutsList;
