import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Apple, Flame } from 'lucide-react';
import { DataTable } from '../../components/tables/DataTable';

const MOCK_DIETS = [
  { id: 'DT-01', name: 'Weight Loss Standard', type: 'Keto / Low Carb', calories: '1600', protein: '120g', meals: 4, activeUsers: 45 },
  { id: 'DT-02', name: 'Muscle Gain Bulk', type: 'High Protein', calories: '3200', protein: '180g', meals: 6, activeUsers: 28 },
  { id: 'DT-03', name: 'Vegan Endurance', type: 'Plant Based', calories: '2400', protein: '100g', meals: 5, activeUsers: 12 },
  { id: 'DT-04', name: 'Lean Maintenance', type: 'Balanced', calories: '2100', protein: '140g', meals: 4, activeUsers: 64 },
];

const DietList = () => {
  const navigate = useNavigate();
  const columns = useMemo(() => [
    { 
      accessorKey: 'name', 
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
      accessorKey: 'type', 
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
    { accessorKey: 'protein', header: 'Protein' },
    { accessorKey: 'meals', header: 'Meals per Day' },
    { accessorKey: 'activeUsers', header: 'Active Users' },
    {
      id: 'actions',
      header: 'Actions',
      cell: () => (
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-slate-400 hover:text-secondary transition-colors" title="Edit"><Edit className="h-4 w-4" /></button>
          <button className="p-1.5 text-slate-400 hover:text-danger transition-colors" title="Delete"><Trash2 className="h-4 w-4" /></button>
        </div>
      ),
    }
  ], []);

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

      <DataTable columns={columns} data={MOCK_DIETS} searchPlaceholder="Search diet plans..." />
    </div>
  );
};

export default DietList;
