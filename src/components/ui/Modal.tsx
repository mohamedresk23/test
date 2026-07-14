/**
 * @file Modal.tsx
 * @description Accessible overlay dialog window (`role="dialog"`).
 * Locks body scroll when open and closes automatically when `Escape` key is pressed
 * or the close button (`X`) is clicked.
 */

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * ModalProps Interface
 * Defines visibility trigger, callbacks, and content options for modal dialogs.
 */
interface ModalProps {
  /** Controls whether the modal window is currently mounted and visible */
  isOpen: boolean;
  /** Callback triggered when user clicks close button or presses Escape */
  onClose: () => void;
  /** Optional header title displayed at the top of the dialog */
  title?: string;
  /** Dialog inner content */
  children: React.ReactNode;
  /** Additional container styling classes */
  className?: string;
}

/**
 * Modal Component
 * 
 * Renders a centered dialog over a dark backdrop with scroll locking.
 */
export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  // Listen for Escape keyboard shortcuts and lock background body scroll while open
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div 
        role="dialog"
        aria-modal="true"
        className={cn("bg-white dark:bg-slate-900 w-full max-w-md rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]", className)}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
