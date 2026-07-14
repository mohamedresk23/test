import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface Goal {
  id: string;
  title: string;
  description?: string;
  target_date?: string;
  progress: number; // 0 to 100
  status: 'active' | 'completed';
}

interface GoalState {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'status' | 'progress'>) => void;
  updateProgress: (id: string, progress: number) => void;
  deleteGoal: (id: string) => void;
}

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
