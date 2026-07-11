import * as React from "react"
import { cn } from "@/lib/utils"

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
