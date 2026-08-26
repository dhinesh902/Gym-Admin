import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Dumbbell, PlayCircle } from 'lucide-react';
import { DataTable } from '../../components/tables/DataTable';

const MOCK_WORKOUTS = [
  { id: 'WKT-01', name: 'Beginner Full Body', category: 'Strength', level: 'Beginner', duration: '45 mins', exercises: 8, creator: 'Mike Johnson' },
  { id: 'WKT-02', name: 'Advanced Core Crusher', category: 'Core', level: 'Advanced', duration: '30 mins', exercises: 6, creator: 'Sarah Davis' },
  { id: 'WKT-03', name: 'HIIT Cardio Blast', category: 'Cardio', level: 'Intermediate', duration: '40 mins', exercises: 10, creator: 'Emily Chen' },
  { id: 'WKT-04', name: 'Hypertrophy Push', category: 'Strength', level: 'Advanced', duration: '60 mins', exercises: 7, creator: 'Mike Johnson' },
  { id: 'WKT-05', name: 'Yoga for Recovery', category: 'Flexibility', level: 'All Levels', duration: '45 mins', exercises: 12, creator: 'Sarah Davis' },
];

const WorkoutsList = () => {
  const navigate = useNavigate();
  const columns = useMemo(() => [
    { 
      accessorKey: 'name', 
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
      accessorKey: 'category', 
      header: 'Category',
      cell: info => <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md text-xs font-medium">{info.getValue()}</span>
    },
    { accessorKey: 'level', header: 'Level' },
    { accessorKey: 'duration', header: 'Duration' },
    { accessorKey: 'exercises', header: 'Exercises' },
    { accessorKey: 'creator', header: 'Created By' },
    {
      id: 'actions',
      header: 'Actions',
      cell: () => (
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-slate-400 hover:text-primary transition-colors" title="View/Assign"><PlayCircle className="h-4 w-4" /></button>
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
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Workout Templates</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage standard workout plans to assign to members.</p>
        </div>
        <button onClick={() => navigate('/workouts/add')} className="btn-primary text-sm flex items-center gap-2">
          <Plus className="h-4 w-4" /> Create Workout
        </button>
      </div>

      <DataTable columns={columns} data={MOCK_WORKOUTS} searchPlaceholder="Search workouts by name or category..." />
    </div>
  );
};

export default WorkoutsList;
