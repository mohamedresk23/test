/**
 * @file SkeletonLoader.tsx
 * @description Animated loading placeholder (`animate-pulse`).
 * Used to display shimmering shape mockups while asynchronous data fetches complete.
 */

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * SkeletonLoader Component
 * 
 * Renders a pulsing block element matching the specified width, height, and border dimensions.
 */
function SkeletonLoader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200 dark:bg-slate-700 w-full h-full", className)}
      {...props}
    />
  )
}

export { SkeletonLoader }
