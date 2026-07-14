/**
 * @file ProgressBar.tsx
 * @description Accessible linear progress bar component (`role="progressbar"`).
 * Dynamically computes width percentages based on `value` / `max` inputs with
 * smooth CSS width transitions (`duration-500`).
 */

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * ProgressBarProps Interface
 * Defines progress value, ceiling, and optional bar fill color customization.
 */
interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current progress value */
  value: number;
  /** Maximum threshold capacity (default: 100) */
  max?: number;
  /** Tailwind background class for the fill indicator (default: `bg-primary-500`) */
  colorClass?: string;
}

/**
 * ProgressBar Component
 * 
 * Renders an animated horizontal status bar.
 */
export function ProgressBar({ className, value, max = 100, colorClass = "bg-primary-500", ...props }: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  return (
    <div className={cn("w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700 h-2", className)} {...props} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
      <div
        className={cn("h-full transition-all duration-500 ease-out", colorClass)}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}
