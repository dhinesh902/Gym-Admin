import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Apple, Flame } from 'lucide-react';
import { DataTable } from '../../components/tables/DataTable';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { dietsApi, toCollection } from '../../services/api';
import { getApiErrorMessage } from '../../services/apiClient';

const DietList = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({ queryKey: ['diets'], queryFn: dietsApi.list, onError: error => toast.error(getApiErrorMessage(error, 'Unable to load diets.')) });
  const diets = toCollection(data, ['diets', 'items']);
  const queryClient = useQueryClient();

  const deleteDiet = useMutation({
    mutationFn: dietsApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diets'] });
      toast.success('Diet deleted successfully!');
    },
    onError: error => toast.error(getApiErrorMessage(error, 'Unable to delete diet.')),
  });

  const columns = useMemo(() => [
    { 
      accessorKey: 'title', 
      header: 'Diet Plan Name', 
      cell: info => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/10 text-accent rounded-lg">
            <Apple className="h-4 w-4" />
          </div>
          <span className="font-bold text-slate-800 dark:text-slate-200">{info.getValue()}</span>
        </div>
      ) 
    },
    { 
      accessorKey: 'diettype', 
      header: 'Diet Type',
      cell: info => <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md text-xs font-medium">{info.getValue()}</span>
    },
    { 
      accessorKey: 'calories', 
      header: 'Daily Calories',
      cell: info => (
        <div className="flex items-center gap-1 font-bold text-warning">
          <Flame className="h-4 w-4" /> {info.getValue()} kcal
        </div>
      )
    },
    { accessorKey: 'dietgoal', header: 'Goal' },
    { accessorKey: 'restrictions', header: 'Restrictions', cell: info => <div className="max-w-[150px] truncate">{info.getValue()}</div> },
    {
      id: 'actions',
      header: 'Actions',
      cell: info => (
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(`/diet/edit/${info.row.original.id}`)} className="p-1.5 text-slate-400 hover:text-secondary transition-colors" title="Edit"><Edit className="h-4 w-4" /></button>
          <button onClick={() => { if(window.confirm('Delete diet plan?')) deleteDiet.mutate(info.row.original.id); }} disabled={deleteDiet.isPending} className="p-1.5 text-slate-400 hover:text-danger transition-colors" title="Delete"><Trash2 className="h-4 w-4" /></button>
        </div>
      ),
    }
  ], [navigate, deleteDiet]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Diet Plans</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage nutritional templates and macros.</p>
        </div>
        <button onClick={() => navigate('/diet/add')} className="btn-primary text-sm flex items-center gap-2">
          <Plus className="h-4 w-4" /> Create Diet Plan
        </button>
      </div>

      <DataTable columns={columns} data={diets} searchPlaceholder="Search diet plans..." />
      {isLoading && <p className="text-sm text-slate-500">Loading diets...</p>}
      {isError && <p className="text-sm text-danger">Unable to load diets.</p>}
    </div>
  );
};

export default DietList;
