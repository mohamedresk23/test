/**
 * @file Tasks.tsx
 * @description Task management page component.
 * Displays interactive task list with status filtering (`all`, `pending`, `completed`),
 * priority badges, due date formatting (`date-fns`), checkmark toggle with celebratory
 * canvas confetti animation, deletion capabilities, and creation modal trigger.
 */

import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTaskStore } from '@/store/taskStore';
import { Button } from '@/components/ui/Button';
import { Plus, CheckSquare, Trash2, Calendar as CalIcon, Clock } from 'lucide-react';
import { AddTaskModal } from '@/features/tasks/AddTaskModal';
import { Checkbox } from '@/components/ui/Checkbox';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import confetti from 'canvas-confetti';

/**
 * Tasks Page Component
 * 
 * Provides full client-side task management capabilities and status filters.
 */
export default function Tasks() {
  const { tasks, loadTasks, toggleComplete, deleteTask } = useTaskStore();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [filter, setFilter] = React.useState<'all' | 'pending' | 'completed'>('all');
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  React.useEffect(() => {
    if (new URLSearchParams(location.search).get('addTask') === '1') {
      setIsModalOpen(true);
      navigate('/tasks', { replace: true });
    }
  }, [location.search, navigate]);

  const handleToggle = (id: string, currentlyCompleted: boolean) => {
    toggleComplete(id);
    if (!currentlyCompleted) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563EB', '#16A34A', '#FBBF24', '#EF4444']
      });
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'pending') return t.status !== 'completed';
    if (filter === 'completed') return t.status === 'completed';
    return true;
  });

  const priorityColors = {
    high: 'danger',
    medium: 'warning',
    low: 'success',
  } as const;
  
  const priorityLabels = {
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6 animate-in fade-in duration-500 h-full flex flex-col">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Your Tasks</h1>
          <p className="text-slate-500 dark:text-slate-400">Organize your day and accomplish more.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
          <Plus className="w-5 h-5 rtl:ml-2 ltr:mr-2" /> Add Task
        </Button>
      </header>

      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto no-scrollbar shrink-0">
        <button 
          onClick={() => setFilter('all')} 
          className={cn("px-4 py-2 font-medium text-sm transition-colors whitespace-nowrap", filter === 'all' ? "text-primary-600 border-b-2 border-primary-600" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200")}
        >
          All ({tasks.length})
        </button>
        <button 
          onClick={() => setFilter('pending')} 
          className={cn("px-4 py-2 font-medium text-sm transition-colors whitespace-nowrap", filter === 'pending' ? "text-primary-600 border-b-2 border-primary-600" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200")}
        >
          In Progress ({tasks.filter(t => t.status !== 'completed').length})
        </button>
        <button 
          onClick={() => setFilter('completed')} 
          className={cn("px-4 py-2 font-medium text-sm transition-colors whitespace-nowrap", filter === 'completed' ? "text-primary-600 border-b-2 border-primary-600" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200")}
        >
          Completed ({tasks.filter(t => t.status === 'completed').length})
        </button>
      </div>

      <div className="flex-1 min-h-[400px]">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center h-full border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-white/50 dark:bg-slate-900/50">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <CheckSquare className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold mb-1">No Tasks Found</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">A blank page invites you to take your first step.</p>
            <Button variant="secondary" onClick={() => setIsModalOpen(true)}>Add a Task Now</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map(task => (
              <div 
                key={task.id} 
                className={cn(
                  "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex items-start gap-4 transition-all hover:border-primary-300 dark:hover:border-primary-700",
                  task.status === 'completed' && "opacity-60 bg-slate-50 dark:bg-slate-900/50"
                )}
              >
                <div className="pt-1">
                  <Checkbox 
                    checked={task.status === 'completed'} 
                    onCheckedChange={() => handleToggle(task.id, task.status === 'completed')}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className={cn("font-medium truncate", task.status === 'completed' && "line-through text-slate-500")}>
                      {task.title}
                    </h3>
                    <Badge variant={priorityColors[task.priority]} className="shrink-0 max-sm:text-[10px]">{priorityLabels[task.priority]}</Badge>
                  </div>
                  
                  {task.description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {task.due_date && (
                      <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-primary-700 dark:text-primary-300">
                        <CalIcon className="w-3.5 h-3.5" />
                        {format(new Date(task.due_date), 'dd MMM yyyy', { locale: enUS })}
                      </span>
                    )}
                    {task.estimated_minutes && (
                      <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                        <Clock className="w-3.5 h-3.5" />
                        {task.estimated_minutes} min
                      </span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 rounded-md transition-colors shrink-0"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
