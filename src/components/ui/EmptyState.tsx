/**
 * @file EmptyState.tsx
 * @description Empty state placeholder UI component.
 * Rendered when lists, tables, or sections have no data available. Displays a centered
 * icon (`FileQuestion` fallback), title, explanatory description, and optional action trigger.
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import { FileQuestion } from 'lucide-react';

/**
 * EmptyStateProps Interface
 * Defines heading title, description text, custom icon element, and interactive action node.
 */
interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Main headline indicating why the area is empty */
  title: string;
  /** Optional supporting explanation text */
  description?: string;
  /** Custom icon node (falls back to `FileQuestion` icon) */
  icon?: React.ReactNode;
  /** Optional CTA button or action element */
  action?: React.ReactNode;
}

/**
 * EmptyState Component
 * 
 * Centered placeholder container used across views when no records exist.
 */
export function EmptyState({ className, title, description, icon, action, ...props }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4 text-center h-full", className)} {...props}>
      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4 text-slate-400 dark:text-slate-500">
        {icon || <FileQuestion className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">{title}</h3>
      {description && <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">{description}</p>}
      {action}
    </div>
  );
}
