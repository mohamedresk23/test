/**
 * @file taskStore.ts
 * @description Global Zustand state management store for Tasks.
 * Handles client-side CRUD operations (Create, Read, Update, Delete) against
 * the local `Dexie.js` (`IndexedDB`) database and keeps UI reactivity synchronized.
 */

import { create } from 'zustand';
import { db, type Task } from '@/db/schema';
import { v4 as uuidv4 } from 'uuid';

/**
 * TaskState Interface
 * Defines the available properties and asynchronous actions inside the task store.
 */
interface TaskState {
  /** Array of currently loaded task items */
  tasks: Task[];
  /** Asynchronously fetches all stored tasks from IndexedDB into state */
  loadTasks: () => Promise<void>;
  /** Creates and stores a new task item with a generated UUID and pending status */
  addTask: (task: Omit<Task, 'id' | 'created_at' | 'status'>) => Promise<void>;
  /** Modifies existing task fields by ID and updates the local state */
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  /** Deletes a task from the local database and filters it out of state */
  deleteTask: (id: string) => Promise<void>;
  /** Toggles a task between 'pending' and 'completed' statuses */
  toggleComplete: (id: string) => Promise<void>;
}

/**
 * Zustand Hook: `useTaskStore`
 * Provides components across the app access to tasks and mutation helpers.
 */
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
