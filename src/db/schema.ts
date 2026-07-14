/**
 * @file schema.ts
 * @description Local Dexie.js (IndexedDB) database configuration.
 * Defines the persistent client-side storage schema for tasks and offline
 * synchronization queue (`syncQueue`).
 */

import Dexie, { type EntityTable } from 'dexie';

/**
 * Task Interface
 * Represents a single task stored locally in the browser IndexedDB.
 */
export interface Task {
  id: string; // Unique identifier (UUID)
  user_id?: string;
  title: string;
  description?: string;
  due_date?: string; // ISO 8601 date string
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  estimated_minutes?: number;
  recurrence?: 'daily' | 'weekly' | 'monthly' | 'custom' | null;
  goal_id?: string; // Foreign key linking to a long-term Goal
  created_at: string;
  completed_at?: string;
  category?: string;
}

/**
 * Dexie Database Instance (`TaskFlowDB`)
 * Provides typed table collections for local persistence and offline-first queueing.
 */
export const db = new Dexie('TaskFlowDB') as Dexie & {
  tasks: EntityTable<Task, 'id'>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  syncQueue: EntityTable<any, 'id'>
};

// Define indexed properties for fast queries and sorting
db.version(1).stores({
  tasks: 'id, due_date, priority, status, goal_id',
  syncQueue: '++id, endpoint, method, timestamp'
});
