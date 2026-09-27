import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Save, X, Apple, Utensils, Hash, Scale, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dietsApi } from '../../services/api';
import { getApiErrorMessage } from '../../services/apiClient';

const AddDiet = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const isEdit = Boolean(id);
  const queryClient = useQueryClient();
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      isQuantity: true,
      isGrams: false,
      session: 'breakfast'
    }
  });

  const isQuantity = watch('isQuantity');
  const isGrams = watch('isGrams');

  useEffect(() => {
    if (isEdit && location.state?.dietData) {
      reset({
        ...location.state.dietData,
        session: location.state.dietData.session?.toLowerCase().replace(' ', '')
      });
    }
  }, [isEdit, location.state, reset]);

  const saveDiet = useMutation({
    mutationFn: (data) => isEdit ? dietsApi.update({ id, ...data }) : dietsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diets'] });
      toast.success(isEdit ? 'Diet Plan updated successfully!' : 'Diet item created successfully!');
      navigate('/diet');
    },
    onError: error => toast.error(getApiErrorMessage(error, isEdit ? 'Unable to update diet item.' : 'Unable to create diet item.')),
  });

  const onSubmit = (data) => {
    saveDiet.mutate({
      foodimageurl: data.foodimageurl,
      session: data.session.toLowerCase().replace(' ', ''),
      foodName: data.foodName,
      isQuantity: Boolean(data.isQuantity),
      isGrams: Boolean(data.isGrams),
      quantity: data.isQuantity ? Number(data.quantity) : null,
      grams: data.isGrams ? Number(data.grams) : null,
      description: data.description
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans text-white pb-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0d0e12] p-4 rounded-xl border border-white/5 shadow-lg">
        <div>
          <h2 className="text-xl font-bold tracking-wide">{isEdit ? 'Edit Diet Item' : 'Add Diet Item'}</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">{isEdit ? 'Update existing food schedule' : 'Schedule a new food item'}</p>
        </div>
        <div className="flex gap-3 items-center">
          <button
            type="button"
            onClick={() => navigate('/diet')}
            className="h-9 px-4 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 text-[11px] font-bold transition-colors flex items-center gap-2"
          >
            <X className="h-3.5 w-3.5" /> Cancel
          </button>
          <button
            type="submit"
            form="add-diet-form"
            disabled={saveDiet.isPending}
            className="bg-[#FBBF24] hover:bg-yellow-400 text-black h-9 px-4 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-2 shadow-lg shadow-yellow-500/10"
          >
            <Save className="h-3.5 w-3.5" /> {isEdit ? 'Update Item' : 'Save Item'}
          </button>
        </div>
      </div>

      <form id="add-diet-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Basic Details */}
        <div className="bg-[#16181d] border border-gray-800/80 rounded-xl overflow-hidden shadow-xl">
          <div className="bg-[#1a1d24] p-4 border-b border-gray-800/80 flex items-center gap-2">
            <Apple className="h-4 w-4 text-[#FBBF24]" />
            <h3 className="font-bold text-sm tracking-wide">Food Details</h3>
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Food Name *</label>
              <input
                {...register('foodName', { required: 'Food name is required' })}
                className="w-full bg-[#0d0e12] border border-gray-800 rounded-lg h-10 px-3 text-sm text-gray-200 focus:border-[#FBBF24] focus:outline-none transition-colors shadow-inner"
                placeholder="e.g. Boiled Egg"
              />
              {errors.foodName && <p className="text-xs text-red-500 mt-1">{errors.foodName.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Food Image URL</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ImageIcon className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  {...register('foodimageurl')}
                  className="w-full bg-[#0d0e12] border border-gray-800 rounded-lg h-10 pl-9 pr-3 text-sm text-gray-200 focus:border-[#FBBF24] focus:outline-none transition-colors shadow-inner"
                  placeholder="https://example.com/image.png"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Diet Session</label>
              <select {...register('session')} className="w-full bg-[#0d0e12] border border-gray-800 rounded-lg h-10 px-3 text-sm text-gray-200 focus:border-[#FBBF24] focus:outline-none transition-colors appearance-none shadow-inner cursor-pointer">
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="eveningsnack">Evening Snack</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>
          </div>
        </div>

        {/* Portions & Macros */}
        <div className="bg-[#16181d] border border-gray-800/80 rounded-xl overflow-hidden shadow-xl">
          <div className="bg-[#1a1d24] p-4 border-b border-gray-800/80 flex items-center gap-2">
            <Utensils className="h-4 w-4 text-[#FBBF24]" />
            <h3 className="font-bold text-sm tracking-wide">Portions & Description</h3>
          </div>

          <div className="p-6 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">

              {/* Quantity Toggle & Input */}
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input type="checkbox" {...register('isQuantity')} className="sr-only peer" />
                    <div className="w-10 h-5.5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-[#FBBF24]"></div>
                  </div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-gray-300 transition-colors">Has Quantity</span>
                </label>

                {isQuantity && (
                  <div className="animate-in slide-in-from-top-2 duration-300">
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Hash className="h-3.5 w-3.5" /> Quantity</label>
                    <input
                      type="number"
                      {...register('quantity', { required: isQuantity ? 'Quantity is required' : false })}
                      className="w-full bg-[#0d0e12] border border-gray-800 rounded-lg h-10 px-3 text-sm text-gray-200 focus:border-[#FBBF24] focus:outline-none transition-colors shadow-inner"
                      placeholder="e.g. 4"
                    />
                    {errors.quantity && <p className="text-xs text-red-500 mt-1">{errors.quantity.message}</p>}
                  </div>
                )}
              </div>

              {/* Grams Toggle & Input */}
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input type="checkbox" {...register('isGrams')} className="sr-only peer" />
                    <div className="w-10 h-5.5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-[#FBBF24]"></div>
                  </div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-gray-300 transition-colors">Has Grams</span>
                </label>

                {isGrams && (
                  <div className="animate-in slide-in-from-top-2 duration-300">
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Scale className="h-3.5 w-3.5" /> Grams (g)</label>
                    <input
                      type="number"
                      {...register('grams', { required: isGrams ? 'Grams is required' : false })}
                      className="w-full bg-[#0d0e12] border border-gray-800 rounded-lg h-10 px-3 text-sm text-gray-200 focus:border-[#FBBF24] focus:outline-none transition-colors shadow-inner"
                      placeholder="e.g. 150"
                    />
                    {errors.grams && <p className="text-xs text-red-500 mt-1">{errors.grams.message}</p>}
                  </div>
                )}
              </div>

            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Description</label>
              <textarea
                {...register('description')}
                className="w-full bg-[#0d0e12] border border-gray-800 rounded-lg p-3 text-sm text-gray-200 focus:border-[#FBBF24] focus:outline-none transition-colors min-h-[100px] shadow-inner"
                placeholder="Optional notes about preparation, ingredients, or brand..."
              />
            </div>

          </div>
        </div>

      </form>
    </div>
  );
};

export default AddDiet;
