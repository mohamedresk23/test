/**
 * @file Badge.tsx
 * @description Small status indicator (`Badge`) UI component.
 * Displays categorization or status pills with variant color schemes (`default`,
 * `primary`, `success`, `warning`, `danger`).
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * BadgeProps Interface
 * Extends standard HTML div attributes with visual variant options.
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Color theme preset for the badge pill */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

/**
 * Badge Component
 * 
 * Renders an inline pill-shaped label indicator.
 */
export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100',
    primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
