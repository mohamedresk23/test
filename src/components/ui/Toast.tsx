/* eslint-disable react-refresh/only-export-components */
import { cn } from '@/lib/utils';
import { create } from 'zustand';

export interface Toast {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

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
