import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Utensils, Apple } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dietsApi } from '../../services/api';
import { getApiErrorMessage } from '../../services/apiClient';

const AddDiet = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  
  const { data: dietsList } = useQuery({ queryKey: ['diets'], queryFn: dietsApi.list });
  
  React.useEffect(() => {
    if (isEdit && dietsList) {
      const diet = dietsList.find(d => d.id === Number(id) || d.id === id);
      if (diet) reset(diet);
    }
  }, [isEdit, id, dietsList, reset]);

  const saveDiet = useMutation({
    mutationFn: (data) => isEdit ? dietsApi.update({ id, ...data }) : dietsApi.create(data),
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['diets'] }); 
      toast.success(isEdit ? 'Diet Plan updated successfully!' : 'Diet Plan created successfully!'); 
      navigate('/diet'); 
    },
    onError: error => toast.error(getApiErrorMessage(error, isEdit ? 'Unable to update diet plan.' : 'Unable to create diet plan.')),
  });

  const onSubmit = (data) => {
    saveDiet.mutate({ 
      title: data.title, 
      dietgoal: data.dietgoal, 
      calories: Number(data.calories),
      diettype: data.diettype,
      morning: data.morning,
      lunch: data.lunch,
      dinner: data.dinner,
      restrictions: data.restrictions,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{isEdit ? 'Edit Diet Plan' : 'Create Diet Plan'}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{isEdit ? 'Update the nutritional plan.' : 'Design a new nutritional plan.'}</p>
        </div>
        <div className="flex gap-2">
          <button 
            type="button"
            onClick={() => navigate('/diet')}
            className="btn-outline text-sm flex items-center gap-2"
          >
            <X className="h-4 w-4" /> Cancel
          </button>
          <button 
            type="submit"
            form="add-diet-form"
            disabled={saveDiet.isPending}
            className="btn-primary text-sm flex items-center gap-2"
          >
            <Save className="h-4 w-4" /> {isEdit ? 'Update Diet Plan' : 'Save Diet Plan'}
          </button>
        </div>
      </div>

      <form id="add-diet-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card overflow-hidden">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <Apple className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-slate-800 dark:text-white">Plan Overview</h3>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Plan Name *</label>
              <input 
                {...register('title', { required: 'Plan name is required' })} 
                className="input-field" 
                placeholder="e.g. Keto Weight Loss"
              />
              {errors.title && <p className="text-xs text-danger mt-1">{errors.title.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Diet Goal</label>
              <select {...register('dietgoal')} className="input-field">
                <option value="Weight Loss">Weight Loss</option>
                <option value="Muscle Building">Muscle Building</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Detox">Detox</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Daily Calories Goal</label>
              <input 
                type="number"
                {...register('calories')} 
                className="input-field" 
                placeholder="2000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Diet Type</label>
              <select {...register('diettype')} className="input-field">
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="High Protein">High Protein</option>
                <option value="Vegan">Vegan</option>
                <option value="Keto">Keto</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <Utensils className="h-5 w-5 text-secondary" />
            <h3 className="font-bold text-slate-800 dark:text-white">Meals & Restrictions</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Morning</label>
                <textarea 
                  {...register('morning')} 
                  className="input-field min-h-[60px]" 
                  placeholder="Breakfast details..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Lunch</label>
                <textarea 
                  {...register('lunch')} 
                  className="input-field min-h-[60px]" 
                  placeholder="Lunch details..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Dinner</label>
                <textarea 
                  {...register('dinner')} 
                  className="input-field min-h-[60px]" 
                  placeholder="Dinner details..."
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Restrictions / Foods to Avoid</label>
              <textarea 
                {...register('restrictions')} 
                className="input-field min-h-[80px]" 
                placeholder="Avoid sugar, processed foods, deep fried items..."
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddDiet;
