/**
 * @file Button.tsx
 * @description Reusable, accessible UI button component.
 * Supports multiple visual styling variants (`primary`, `secondary`, `danger`, `ghost`),
 * button dimensions (`sm`, `md`, `lg`), and an interactive loading indicator (`isLoading`).
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

/**
 * ButtonProps Interface
 * Extends standard HTML button attributes with custom styling and loading flags.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual theme preset of the button */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  /** Sizing profile of the button */
  size?: 'sm' | 'md' | 'lg';
  /** If true, disables the button and displays a spinning loader icon */
  isLoading?: boolean;
}

/**
 * Button Component (`React.forwardRef`)
 * 
 * Standard application button with dynamic Tailwind styling via utility merging (`cn`).
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    
    const variants = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 disabled:bg-primary-300 dark:disabled:bg-primary-900',
      secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300 active:bg-slate-400 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 disabled:opacity-50',
      danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:bg-red-300 dark:disabled:bg-red-900/50',
      ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 disabled:opacity-50'
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 py-2 text-sm',
      lg: 'h-12 px-8 text-base'
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin rtl:ml-2 rtl:mr-0" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button };
