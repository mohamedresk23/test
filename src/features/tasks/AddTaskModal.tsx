import * as React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useTaskStore } from '@/store/taskStore';
import { useToastStore } from '@/components/ui/Toast';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: string;
}

export function AddTaskModal({ isOpen, onClose, defaultDate }: AddTaskModalProps) {
  const addTask = useTaskStore((state) => state.addTask);
  const addToast = useToastStore((state) => state.addToast);
  
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [priority, setPriority] = React.useState<'high' | 'medium' | 'low'>('medium');
  const [estimatedMinutes, setEstimatedMinutes] = React.useState<number | ''>('');
  const [dueDate, setDueDate] = React.useState(defaultDate || '');

  React.useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setEstimatedMinutes('');
      setDueDate(defaultDate || '');
    }
  }, [isOpen, defaultDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      addToast({ title: 'Error', message: 'Please enter task title', type: 'error' });
      return;
    }
    
    try {
      await addTask({
        title,
        description,
        priority,
        estimated_minutes: estimatedMinutes ? Number(estimatedMinutes) : undefined,
        due_date: dueDate ? new Date(dueDate).toISOString() : undefined,
      });
      addToast({ title: 'Done', message: 'Task added successfully', type: 'success' });
      onClose();
    } catch {
      addToast({ title: 'Error', message: 'An error occurred while adding task', type: 'error' });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Task Title <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Review monthly report..."
            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            autoFocus
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1.5">Description</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task details (optional)..."
            rows={3}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Priority</label>
            <select 
              value={priority}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Estimated Time (minutes)</label>
            <input 
              type="number" 
              value={estimatedMinutes}
              onChange={(e) => setEstimatedMinutes(e.target.value ? Number(e.target.value) : '')}
              placeholder="e.g. 30"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Due Date</label>
          <input 
            type="date" 
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="px-6">
            Save Task
          </Button>
        </div>
      </form>
    </Modal>
  );
}
