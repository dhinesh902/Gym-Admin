import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Save, X, Dumbbell, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

const AddWorkout = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    toast.success('Workout Plan created successfully!');
    navigate('/workouts');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Create Workout Plan</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Design a new workout routine.</p>
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
            className="btn-primary text-sm flex items-center gap-2"
          >
            <Save className="h-4 w-4" /> Save Workout
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
                {...register('workoutName', { required: 'Workout name is required' })} 
                className="input-field" 
                placeholder="e.g. Full Body Strength"
              />
              {errors.workoutName && <p className="text-xs text-danger mt-1">{errors.workoutName.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target Muscle Group</label>
              <select {...register('muscleGroup')} className="input-field">
                <option value="full_body">Full Body</option>
                <option value="upper_body">Upper Body</option>
                <option value="lower_body">Lower Body</option>
                <option value="core">Core</option>
                <option value="cardio">Cardio</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Difficulty Level</label>
              <select {...register('difficulty')} className="input-field">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
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
              {...register('exercises')} 
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
