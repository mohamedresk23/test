/**
 * @file Calendar.tsx
 * @description Advanced calendar scheduling and visual task tracking page.
 * Uses `@fullcalendar/react` (`dayGrid`, `timeGrid`, `interaction`) to render tasks
 * directly onto interactive monthly, weekly, or daily schedules. Supports date-click
 * task creation, drag/drop adjustments, priority/status filtering, and task detail modals.
 */

import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventContentArg } from '@fullcalendar/core';
import './calendar.css';
import { useTaskStore } from '@/store/taskStore';
import { AddTaskModal } from '@/features/tasks/AddTaskModal';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useToastStore } from '@/components/ui/Toast';
import type { Task } from '@/db/schema';
import { 
  CalendarDays, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Filter, 
  Trash2, 
  Check, 
  Flag, 
  Sparkles,
  Calendar as CalendarIcon,
  Timer
} from 'lucide-react';

/**
 * Calendar Page Component
 * 
 * Interactive calendar matrix with quick-add dialogs and filtering controls.
 */
export default function Calendar() {
  const { tasks, loadTasks, toggleComplete, deleteTask } = useTaskStore();
  const addToast = useToastStore((state) => state.addToast);

  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<string>();
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Filters state
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'pending' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = React.useState<'all' | 'high' | 'medium' | 'low'>('all');

  React.useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  React.useEffect(() => {
    if (new URLSearchParams(location.search).get('addTimeBlock') === '1') {
      setSelectedDate(new Date().toISOString().split('T')[0]);
      setIsAddModalOpen(true);
      navigate('/calendar', { replace: true });
    }
  }, [location.search, navigate]);

  // Statistics calculation
  const stats = React.useMemo(() => {
    const scheduled = tasks.filter(t => t.due_date);
    const total = scheduled.length;
    const completed = scheduled.filter(t => t.status === 'completed').length;
    const pending = scheduled.filter(t => t.status !== 'completed' && t.status !== 'cancelled').length;
    
    const todayStr = new Date().toISOString().split('T')[0];
    const todayCount = scheduled.filter(t => t.due_date?.startsWith(todayStr) && t.status !== 'completed').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, todayCount, completionRate };
  }, [tasks]);

  // Filter and map events
  const events = React.useMemo(() => {
    return tasks
      .filter(t => t.due_date)
      .filter(t => {
        if (statusFilter === 'pending') return t.status !== 'completed' && t.status !== 'cancelled';
        if (statusFilter === 'completed') return t.status === 'completed';
        return true;
      })
      .filter(t => {
        if (priorityFilter !== 'all') return t.priority === priorityFilter;
        return true;
      })
      .map(t => ({
        id: t.id,
        title: t.title,
        start: t.due_date,
        allDay: !t.due_date?.includes('T'),
        extendedProps: { ...t },
      }));
  }, [tasks, statusFilter, priorityFilter]);

  // Custom Event Content Rendering
  const renderEventContent = (arg: EventContentArg) => {
    const priority = arg.event.extendedProps.priority || 'medium';
    const status = arg.event.extendedProps.status || 'pending';
    const isCompleted = status === 'completed';

    const priorityClasses = {
      high: 'border-r-[3.5px] border-rose-500 bg-rose-50/95 dark:bg-rose-950/45 text-rose-950 dark:text-rose-100 hover:bg-rose-100/90 dark:hover:bg-rose-900/60 shadow-sm shadow-rose-500/10',
      medium: 'border-r-[3.5px] border-amber-500 bg-amber-50/95 dark:bg-amber-950/45 text-amber-950 dark:text-amber-100 hover:bg-amber-100/90 dark:hover:bg-amber-900/60 shadow-sm shadow-amber-500/10',
      low: 'border-r-[3.5px] border-indigo-500 bg-indigo-50/95 dark:bg-indigo-950/45 text-indigo-950 dark:text-indigo-100 hover:bg-indigo-100/90 dark:hover:bg-indigo-900/60 shadow-sm shadow-indigo-500/10'
    }[priority as 'high' | 'medium' | 'low'];

    const completedClasses = 'border-r-[3.5px] border-emerald-500 bg-slate-100/90 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 opacity-80';

    return (
      <div 
        className={`w-full px-2 py-1.5 rounded-lg transition-all duration-200 flex items-center justify-between gap-1.5 overflow-hidden select-none ${
          isCompleted ? completedClasses : priorityClasses
        }`}
        title={arg.event.title}
      >
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          {isCompleted ? (
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
          ) : (
            <div className={`w-2 h-2 rounded-full shrink-0 ${
              priority === 'high' ? 'bg-rose-500 animate-pulse' : priority === 'medium' ? 'bg-amber-500' : 'bg-indigo-500'
            }`} />
          )}
          <span className={`text-xs font-semibold truncate ${isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
            {arg.event.title}
          </span>
        </div>
        {arg.timeText && (
          <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 shrink-0">
            {arg.timeText}
          </span>
        )}
      </div>
    );
  };

  // Handlers
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.dateStr);
    setIsAddModalOpen(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEventClick = (arg: any) => {
    const task = tasks.find(t => t.id === arg.event.id);
    if (task) {
      setSelectedTask(task);
    }
  };

  const handleToggleStatus = async () => {
    if (!selectedTask) return;
    try {
      await toggleComplete(selectedTask.id);
      setSelectedTask(prev => prev ? {
        ...prev,
        status: prev.status === 'completed' ? 'pending' : 'completed'
      } : null);
      addToast({ title: 'Success', message: 'Task status updated successfully', type: 'success' });
    } catch {
      addToast({ title: 'Error', message: 'Failed to update task status', type: 'error' });
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;
    try {
      await deleteTask(selectedTask.id);
      addToast({ title: 'Success', message: 'Task deleted successfully', type: 'success' });
      setSelectedTask(null);
    } catch {
      addToast({ title: 'Error', message: 'Failed to delete task', type: 'error' });
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6 animate-in fade-in duration-300 pt-2">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 rounded-2xl border border-indigo-500/20 flex items-center justify-center shadow-inner">
            <CalendarDays className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Calendar & Schedule</h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                <Sparkles className="w-3 h-3" /> Interactive
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">A comprehensive view of your schedule with easy coordination and event management.</p>
          </div>
        </div>

        <Button 
          onClick={() => {
            setSelectedDate(new Date().toISOString().split('T')[0]);
            setIsAddModalOpen(true);
          }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 rounded-xl px-5 py-2.5 flex items-center gap-2.5 transition-all duration-300 font-semibold text-sm shrink-0 w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Task for Date</span>
        </Button>
      </div>

      {/* Quick Summary Cards Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Scheduled */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3 hover:border-indigo-500/30 transition-all duration-200 group">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Scheduled Tasks</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">{stats.total}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
            <CalendarIcon className="w-6 h-6" />
          </div>
        </div>

        {/* Due Today */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3 hover:border-rose-500/30 transition-all duration-200 group">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Remaining Today</p>
            <p className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1">{stats.todayCount}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Scheduled */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3 hover:border-amber-500/30 transition-all duration-200 group">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">In Progress & Pending</p>
            <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">{stats.pending}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3 hover:border-emerald-500/30 transition-all duration-200 group">
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
              <span>Schedule Completion Rate</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{stats.completionRate}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden mt-2">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <Filter className="w-4 h-4 text-indigo-500" />
          <span>Filter Tasks & Events:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          {/* Status Filter Tabs */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'all' 
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'pending' 
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm font-bold' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'completed' 
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm font-bold' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Completed ({stats.completed})
            </button>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 dark:text-slate-400 hidden md:inline">Priority:</span>
            <select
              value={priorityFilter}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 px-3 py-1.5 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">⚡ All Priorities</option>
              <option value="high">🔴 High Priority</option>
              <option value="medium">🟡 Medium Priority</option>
              <option value="low">🟢 Low Priority</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Calendar Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-100 dark:border-slate-800 p-3 sm:p-6 overflow-hidden calendar-container transition-all">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale="en"
          direction="ltr"
          headerToolbar={{
            right: 'prev,next today',
            center: 'title',
            left: 'dayGridMonth,timeGridWeek'
          }}
          events={events}
          eventContent={renderEventContent}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          height="auto"
          contentHeight="750px"
          navLinks={true}
          dayMaxEvents={3}
        />
      </div>

      {/* Add Task Modal */}
      <AddTaskModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        defaultDate={selectedDate} 
      />

      {/* Task Detail View Modal */}
      <Modal 
        isOpen={!!selectedTask} 
        onClose={() => setSelectedTask(null)} 
        title="Scheduled Task Details"
      >
        {selectedTask && (
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Task Title</span>
                <h3 className={`text-base font-bold text-slate-900 dark:text-slate-100 ${
                  selectedTask.status === 'completed' ? 'line-through text-slate-400 dark:text-slate-500' : ''
                }`}>
                  {selectedTask.title}
                </h3>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 shrink-0 ${
                selectedTask.priority === 'high' 
                  ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800' :
                selectedTask.priority === 'medium' 
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800' :
                'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
              }`}>
                <Flag className="w-3 h-3" />
                {selectedTask.priority === 'high' ? 'High' : selectedTask.priority === 'medium' ? 'Medium' : 'Low'}
              </span>
            </div>

            {selectedTask.description && (
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Description & Details:</span>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {selectedTask.description}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
                <CalendarIcon className="w-4 h-4 text-indigo-500" />
                <div>
                  <span className="block text-slate-400">Due Date</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                    {selectedTask.due_date ? new Date(selectedTask.due_date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Not specified'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
                <Timer className="w-4 h-4 text-purple-500" />
                <div>
                  <span className="block text-slate-400">Estimated Time</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
                    {selectedTask.estimated_minutes ? `${selectedTask.estimated_minutes} min` : 'Not specified'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <Button
                variant="ghost"
                onClick={handleDeleteTask}
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 w-full sm:w-auto flex items-center justify-center gap-2 text-xs font-semibold"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Task</span>
              </Button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button variant="ghost" onClick={() => setSelectedTask(null)} className="flex-1 sm:flex-none text-xs">
                  Close
                </Button>
                <Button
                  onClick={handleToggleStatus}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                    selectedTask.status === 'completed'
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20'
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>{selectedTask.status === 'completed' ? 'Mark as Pending' : 'Mark as Completed'}</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

