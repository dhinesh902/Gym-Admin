import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Dumbbell, PlayCircle } from 'lucide-react';
import { DataTable } from '../../components/tables/DataTable';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { workoutsApi, toCollection } from '../../services/api';
import { getApiErrorMessage } from '../../services/apiClient';

const WorkoutsList = () => {
  const navigate = useNavigate();
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

  const columns = useMemo(() => [
    { 
      accessorKey: 'title', 
      header: 'Workout Name', 
      cell: info => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 text-primary rounded-lg">
            <Dumbbell className="h-4 w-4" />
          </div>
          <span className="font-bold text-slate-800 dark:text-slate-200">{info.getValue()}</span>
        </div>
      ) 
    },
    { 
      accessorKey: 'targetmuscle', 
      header: 'Target Muscle',
      cell: info => <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md text-xs font-medium">{info.getValue()}</span>
    },
    { accessorKey: 'difficultlevel', header: 'Level' },
    { accessorKey: 'duration', header: 'Duration (min)' },
    { accessorKey: 'description', header: 'Description', cell: info => <div className="max-w-[200px] truncate">{info.getValue()}</div> },
    {
      id: 'actions',
      header: 'Actions',
      cell: info => (
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-slate-400 hover:text-primary transition-colors" title="View/Assign"><PlayCircle className="h-4 w-4" /></button>
          <button onClick={() => navigate(`/workouts/edit/${info.row.original.id}`)} className="p-1.5 text-slate-400 hover:text-secondary transition-colors" title="Edit"><Edit className="h-4 w-4" /></button>
          <button onClick={() => { if(window.confirm('Delete workout?')) deleteWorkout.mutate(info.row.original.id); }} disabled={deleteWorkout.isPending} className="p-1.5 text-slate-400 hover:text-danger transition-colors" title="Delete"><Trash2 className="h-4 w-4" /></button>
        </div>
      ),
    }
  ], [navigate, deleteWorkout]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Workout Templates</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage standard workout plans to assign to members.</p>
        </div>
        <button onClick={() => navigate('/workouts/add')} className="btn-primary text-sm flex items-center gap-2">
          <Plus className="h-4 w-4" /> Create Workout
        </button>
      </div>

      <DataTable columns={columns} data={workouts} searchPlaceholder="Search workouts by name or category..." />
      {isLoading && <p className="text-sm text-slate-500">Loading workouts...</p>}
      {isError && <p className="text-sm text-danger">Unable to load workouts.</p>}
    </div>
  );
};

export default WorkoutsList;
