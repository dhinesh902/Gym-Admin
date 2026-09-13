import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Dumbbell, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { workoutsApi } from '../../services/api';
import { getApiErrorMessage } from '../../services/apiClient';

const AddWorkout = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  
  const { data: workoutsList } = useQuery({ queryKey: ['workouts'], queryFn: workoutsApi.list });
  
  React.useEffect(() => {
    if (isEdit && workoutsList) {
      const workout = workoutsList.find(w => w.id === Number(id) || w.id === id);
      if (workout) reset(workout);
    }
  }, [isEdit, id, workoutsList, reset]);

  const saveWorkout = useMutation({
    mutationFn: (data) => isEdit ? workoutsApi.update({ id, ...data }) : workoutsApi.create(data),
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['workouts'] }); 
      toast.success(isEdit ? 'Workout updated successfully!' : 'Workout created successfully!'); 
      navigate('/workouts'); 
    },
    onError: error => toast.error(getApiErrorMessage(error, isEdit ? 'Unable to update workout.' : 'Unable to create workout.')),
  });

  const onSubmit = (data) => {
    saveWorkout.mutate({ 
      title: data.title, 
      targetmuscle: data.targetmuscle, 
      difficultlevel: data.difficultlevel,
      duration: Number(data.duration),
      description: data.description,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{isEdit ? 'Edit Workout Plan' : 'Create Workout Plan'}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{isEdit ? 'Update the workout details.' : 'Design a new workout routine.'}</p>
        </div>
        <div className="flex gap-2">
          <button 
            type="button"
            onClick={() => navigate('/workouts')}
            className="btn-outline text-sm flex items-center gap-2"
          >
            <X className="h-4 w-4" /> Cancel
          </button>
          <button 
            type="submit"
            form="add-workout-form"
            disabled={saveWorkout.isPending}
            className="btn-primary text-sm flex items-center gap-2"
          >
            <Save className="h-4 w-4" /> {isEdit ? 'Update Workout' : 'Save Workout'}
          </button>
        </div>
      </div>

      <form id="add-workout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card overflow-hidden">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-slate-800 dark:text-white">Workout Details</h3>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Workout Name *</label>
              <input 
                {...register('title', { required: 'Workout name is required' })} 
                className="input-field" 
                placeholder="e.g. Full Body Strength"
              />
              {errors.title && <p className="text-xs text-danger mt-1">{errors.title.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target Muscle Group</label>
              <select {...register('targetmuscle')} className="input-field">
                <option value="Full Body">Full Body</option>
                <option value="Upper Body">Upper Body</option>
                <option value="Lower Body">Lower Body</option>
                <option value="Core">Core</option>
                <option value="Cardio">Cardio</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Difficulty Level</label>
              <select {...register('difficultlevel')} className="input-field">
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Duration (Minutes) *</label>
              <input 
                type="number"
                {...register('duration', { required: 'Duration is required' })} 
                className="input-field" 
                placeholder="45"
              />
              {errors.duration && <p className="text-xs text-danger mt-1">{errors.duration.message}</p>}
            </div>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-secondary" />
            <h3 className="font-bold text-slate-800 dark:text-white">Exercises List</h3>
          </div>
          <div className="p-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Detailed Routine</label>
            <textarea 
              {...register('description')} 
              className="input-field min-h-[120px]" 
              placeholder="1. Squats: 3 sets x 12 reps&#10;2. Bench Press: 3 sets x 10 reps&#10;3. Deadlifts: 3 sets x 8 reps"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddWorkout;
