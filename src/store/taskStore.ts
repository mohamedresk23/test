import { create } from 'zustand';
import { db, type Task } from '@/db/schema';
import { v4 as uuidv4 } from 'uuid';

interface TaskState {
  tasks: Task[];
  loadTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'created_at' | 'status'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loadTasks: async () => {
    const tasks = await db.tasks.toArray();
    set({ tasks: tasks.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) });
  },
  addTask: async (taskData) => {
    const newTask: Task = {
      ...taskData,
      id: uuidv4(),
      status: 'pending',
      created_at: new Date().toISOString()
    };
    await db.tasks.add(newTask);
    set((state) => ({ tasks: [newTask, ...state.tasks] }));
  },
  updateTask: async (id, updates) => {
    await db.tasks.update(id, updates);
    set((state) => ({
      tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
    }));
  },
  deleteTask: async (id) => {
    await db.tasks.delete(id);
    set((state) => ({ tasks: state.tasks.filter(t => t.id !== id) }));
  },
  toggleComplete: async (id) => {
    const task = get().tasks.find(t => t.id === id);
    if (!task) return;
    const isCompleted = task.status === 'completed';
    const updates: Partial<Task> = {
      status: isCompleted ? 'pending' : 'completed',
      completed_at: isCompleted ? undefined : new Date().toISOString()
    };
    await db.tasks.update(id, updates);
    set((state) => ({
      tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
    }));
  }
}));
