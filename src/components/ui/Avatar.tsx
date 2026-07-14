/**
 * @file Avatar.tsx
 * @description Circular user profile avatar component.
 * Displays an image (`src`) if provided, falling back to uppercase text (`initials`)
 * inside a rounded placeholder circle. Supports `sm`, `md`, and `lg` sizing profiles.
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * AvatarProps Interface
 * Defines image source URL, fallback text initials, and avatar dimensions.
 */
interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Profile image URL */
  src?: string;
  /** Fallback initials string (e.g. 'JD') shown if image is absent or broken */
  initials?: string;
  /** Avatar profile icon dimensions (`sm`, `md`, or `lg`) */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Avatar Component
 * 
 * Renders a circular profile badge with automatic fallback handling.
 */
export function Avatar({ className, src, initials, size = 'md', ...props }: AvatarProps) {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base'
  };

  return (
    <div
      className={cn(
        'relative flex shrink-0 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800 items-center justify-center font-medium',
        sizes[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img className="aspect-square h-full w-full object-cover" src={src} alt="Avatar" />
      ) : (
        <span className="text-slate-700 dark:text-slate-300 uppercase">{initials || '?'}</span>
      )}
    </div>
  );
}
