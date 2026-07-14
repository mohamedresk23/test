/**
 * @file goalStore.ts
 * @description Global Zustand state management store for Goals.
 * Persists goals across browser sessions using `localStorage` via Zustand's
 * `persist` middleware and provides methods to track completion progress.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

/**
 * Goal Interface
 * Represents a long-term goal that tasks can be linked against.
 */
export interface Goal {
  id: string; // Unique identifier (UUID)
  title: string;
  description?: string;
  target_date?: string; // ISO 8601 date string
  progress: number; // Completion percentage (0 to 100)
  status: 'active' | 'completed';
}

/**
 * GoalState Interface
 * Defines state fields and actions for managing goals.
 */
interface GoalState {
  /** List of stored long-term goals */
  goals: Goal[];
  /** Adds a new goal with initial 0% progress and 'active' status */
  addGoal: (goal: Omit<Goal, 'id' | 'status' | 'progress'>) => void;
  /** Updates the progress percentage of an existing goal by ID */
  updateProgress: (id: string, progress: number) => void;
  /** Deletes a goal by its ID */
  deleteGoal: (id: string) => void;
}

/**
 * Zustand Hook: `useGoalStore`
 * Persisted in localStorage under key `taskflow-goals`.
 */
export const useGoalStore = create<GoalState>()(
  persist(
    (set) => ({
      goals: [
        { id: '1', title: 'Learn Programming', progress: 65, status: 'active' },
        { id: '2', title: 'Read 12 Books', progress: 10, status: 'active' },
      ],
      addGoal: (data) => set((state) => ({
        goals: [{ ...data, id: uuidv4(), status: 'active', progress: 0 }, ...state.goals]
      })),
      updateProgress: (id, progress) => set((state) => ({
        goals: state.goals.map((g) => g.id === id ? { ...g, progress } : g)
      })),
      deleteGoal: (id) => set((state) => ({
        goals: state.goals.filter((g) => g.id !== id)
      }))
    }),
    { name: 'taskflow-goals' }
  )
);
