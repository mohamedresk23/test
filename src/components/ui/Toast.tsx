/**
 * @file Toast.tsx
 * @description Global notification (`Toast`) system using Zustand and Tailwind CSS.
 * Provides `useToastStore` to trigger temporary floating alerts across the app
 * and `<ToastContainer />` to render active alerts with auto-dismiss timers.
 */

/* eslint-disable react-refresh/only-export-components */
import { cn } from '@/lib/utils';
import { create } from 'zustand';

/**
 * Toast Interface
 * Represents a single alert banner notification.
 */
export interface Toast {
  /** Unique alert ID */
  id: string;
  /** Primary bold headline */
  title: string;
  /** Optional secondary details */
  message?: string;
  /** Visual severity color theme (`success`, `error`, `warning`, `info`) */
  type?: 'success' | 'error' | 'warning' | 'info';
}

/**
 * ToastStore Interface
 * Defines state items and addition/removal triggers for toast notifications.
 */
interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

/**
 * Zustand Hook: `useToastStore`
 * Automatically removes added toasts after a 4,000ms (4-second) timeout.
 */
export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).slice(2, 9);
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

/**
 * ToastContainer Component
 * 
 * Fixed positioning wrapper mounted in `AppShell` that renders all active notifications.
 */
export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();
  
  return (
    <div className="fixed bottom-20 sm:bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "pointer-events-auto flex items-center justify-between p-4 rounded-lg shadow-lg min-w-[300px] border transform transition-all duration-300 animate-in slide-in-from-bottom-5",
            {
              'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700': toast.type === 'info' || !toast.type,
              'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300': toast.type === 'success',
              'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300': toast.type === 'error',
              'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300': toast.type === 'warning',
            }
          )}
        >
          <div className="flex flex-col">
            <span className="font-semibold text-sm">{toast.title}</span>
            {toast.message && <span className="text-xs opacity-90 mt-1">{toast.message}</span>}
          </div>
          <button onClick={() => removeToast(toast.id)} className="ml-4 opacity-70 hover:opacity-100">
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
