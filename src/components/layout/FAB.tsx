/**
 * @file FAB.tsx
 * @description Floating Action Button (`FAB`) layout component.
 * Renders an expandable circular action button positioned at the bottom corner of the
 * viewport. When clicked, reveals quick-action buttons such as adding tasks or goals.
 * Closes automatically on outside click or navigation change.
 */

import * as React from 'react';
import { Plus, Edit3, Video, Target, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useTaskStore } from '@/store/taskStore';
import { useToastStore } from '@/components/ui/Toast';

/**
 * FAB Component
 * 
 * Interactive floating button menu supporting quick creation triggers.
 */
export function FAB() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isYoutubeModalOpen, setIsYoutubeModalOpen] = React.useState(false);
  const [youtubeUrl, setYoutubeUrl] = React.useState('');
  const [isImporting, setIsImporting] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const addTask = useTaskStore((state) => state.addTask);
  const addToast = useToastStore((state) => state.addToast);

  // Close popup menu automatically whenever route location changes
  React.useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Close popup menu when user clicks outside the menu container
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const actions = [
    { icon: Edit3, label: 'Add Task Manually', color: 'bg-blue-500 text-white hover:bg-blue-600', onClick: () => navigate('/tasks?addTask=1') },
    { icon: Video, label: 'Import from YouTube', color: 'bg-red-500 text-white hover:bg-red-600', onClick: () => setIsYoutubeModalOpen(true) },
    { icon: Target, label: 'Add Goal', color: 'bg-amber-500 text-white hover:bg-amber-600', onClick: () => navigate('/goals?addGoal=1') },
    { icon: Clock, label: 'Add Time Block', color: 'bg-green-500 text-white hover:bg-green-600', onClick: () => navigate('/calendar?addTimeBlock=1') },
  ];

  const importYoutubeTask = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isYouTubeUrl = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(youtubeUrl.trim());
    if (!isYouTubeUrl) {
      addToast({ title: 'Invalid link', message: 'Please enter a valid YouTube URL.', type: 'error' });
      return;
    }

    setIsImporting(true);
    try {
      await addTask({
        title: 'Watch YouTube video',
        description: youtubeUrl.trim(),
        priority: 'medium',
        estimated_minutes: 30,
      });
      addToast({ title: 'Video added', message: 'A task was created from your YouTube link.', type: 'success' });
      setYoutubeUrl('');
      setIsYoutubeModalOpen(false);
      navigate('/tasks');
    } catch {
      addToast({ title: 'Import failed', message: 'The video task could not be created.', type: 'error' });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed bottom-24 md:bottom-8 rtl:left-6 rtl:right-auto ltr:right-6 ltr:left-auto z-50 pointer-events-none" ref={menuRef}>
      <div 
        className={cn(
          "absolute bottom-full mb-4 rtl:left-0 rtl:right-auto ltr:right-0 ltr:left-auto flex flex-col items-center gap-3 transition-all duration-300 transform rtl:origin-bottom-left ltr:origin-bottom-right pointer-events-auto",
          isOpen ? "scale-100 opacity-100" : "scale-50 opacity-0 pointer-events-none"
        )}
      >
        {actions.map((action, i) => (
          <button 
            key={i} 
            onClick={() => { action.onClick(); setIsOpen(false); }}
            className="flex items-center gap-3 group rtl:flex-row-reverse w-full"
          >
            <span className="hidden md:block px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium rounded-lg shadow-md whitespace-nowrap opacity-0 md:group-hover:opacity-100 transition-opacity">
              {action.label}
            </span>
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-black/10 hover:scale-110 active:scale-95 transition-all text-sm shrink-0", action.color)} title={action.label}>
              <action.icon className="w-5 h-5" />
            </div>
          </button>
        ))}
      </div>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl shadow-primary-600/30 transition-transform duration-300 pointer-events-auto",
          isOpen ? "bg-slate-800 dark:bg-slate-700 rotate-45" : "bg-primary-600 hover:bg-primary-700 active:scale-95 hover:scale-105"
        )}
      >
        <Plus className="w-6 h-6" />
      </button>

      <div className="pointer-events-auto">
        <Modal isOpen={isYoutubeModalOpen} onClose={() => setIsYoutubeModalOpen(false)} title="Import from YouTube">
          <form onSubmit={importYoutubeTask} className="space-y-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">Paste a YouTube link to create a task for watching it.</p>
            <div>
              <label htmlFor="youtube-url" className="mb-1.5 block text-sm font-medium">YouTube URL</label>
              <input id="youtube-url" type="url" required value={youtubeUrl} onChange={(event) => setYoutubeUrl(event.target.value)} placeholder="https://youtube.com/watch?v=..." dir="ltr" className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500 dark:border-slate-800 dark:bg-slate-900" autoFocus />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsYoutubeModalOpen(false)}>Cancel</Button>
              <Button type="submit" isLoading={isImporting}>Add video task</Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
