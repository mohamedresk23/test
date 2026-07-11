import Dexie, { type EntityTable } from 'dexie';

export interface Task {
  id: string; // uuid
  user_id?: string;
  title: string;
  description?: string;
  due_date?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  estimated_minutes?: number;
  recurrence?: 'daily' | 'weekly' | 'monthly' | 'custom' | null;
  goal_id?: string;
  created_at: string;
  completed_at?: string;
  category?: string;
}

export const db = new Dexie('TaskFlowDB') as Dexie & {
  tasks: EntityTable<Task, 'id'>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  syncQueue: EntityTable<any, 'id'>
};

db.version(1).stores({
  tasks: 'id, due_date, priority, status, goal_id',
  syncQueue: '++id, endpoint, method, timestamp'
});
