import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Save, X, Utensils, Apple } from 'lucide-react';
import toast from 'react-hot-toast';

const AddDiet = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    toast.success('Diet Plan created successfully!');
    navigate('/diet');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Create Diet Plan</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Design a new nutritional plan.</p>
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
            className="btn-primary text-sm flex items-center gap-2"
          >
            <Save className="h-4 w-4" /> Save Diet Plan
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
                {...register('planName', { required: 'Plan name is required' })} 
                className="input-field" 
                placeholder="e.g. Keto Weight Loss"
              />
              {errors.planName && <p className="text-xs text-danger mt-1">{errors.planName.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Diet Goal</label>
              <select {...register('goal')} className="input-field">
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="maintenance">Maintenance</option>
                <option value="detox">Detox</option>
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
              <select {...register('dietType')} className="input-field">
                <option value="vegetarian">Vegetarian</option>
                <option value="non_vegetarian">Non-Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="keto">Keto</option>
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
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meals Breakdown</label>
              <textarea 
                {...register('meals')} 
                className="input-field min-h-[120px]" 
                placeholder="Breakfast: Oats with milk and fruits&#10;Lunch: 2 Roti, Dal, Salad&#10;Dinner: Grilled Chicken, Veggies"
              />
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
