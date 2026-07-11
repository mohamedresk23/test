import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, checked, onChange, ...props }, ref) => {
    return (
      <label className="relative flex cursor-pointer items-center justify-center">
        <input
          type="checkbox"
          className="peer sr-only"
          ref={ref}
          checked={checked}
          onChange={(e) => {
            onChange?.(e);
            onCheckedChange?.(e.target.checked);
          }}
          {...props}
        />
        <div className={cn(
          "flex h-5 w-5 items-center justify-center rounded border-2 border-slate-300 transition-all dark:border-slate-600 peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 peer-focus-visible:ring-offset-2 dark:peer-focus-visible:ring-offset-slate-900",
          "peer-checked:border-green-500 peer-checked:bg-green-500 dark:peer-checked:border-green-500 dark:peer-checked:bg-green-500",
          className
        )}>
          <Check className={cn("h-3.5 w-3.5 text-white transition-transform scale-0", checked ? "scale-100" : "scale-0")} />
        </div>
      </label>
    );
  }
)
Checkbox.displayName = "Checkbox"
