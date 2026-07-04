import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "gradient"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-300 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-neutral-50 text-neutral-900 shadow hover:bg-neutral-50/90": variant === "default",
            "bg-red-900 text-neutral-50 shadow-sm hover:bg-red-900/90": variant === "destructive",
            "border border-neutral-800 bg-transparent shadow-sm hover:bg-neutral-800 hover:text-neutral-50": variant === "outline",
            "bg-neutral-800 text-neutral-50 shadow-sm hover:bg-neutral-800/80": variant === "secondary",
            "hover:bg-neutral-800 hover:text-neutral-50": variant === "ghost",
            "text-neutral-50 underline-offset-4 hover:underline": variant === "link",
            "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/25 hover:opacity-90 transition-opacity border-0": variant === "gradient",
            "h-9 px-4 py-2": size === "default",
            "h-8 rounded-full px-3 text-xs": size === "sm",
            "h-11 rounded-full px-8 text-base": size === "lg",
            "h-9 w-9": size === "icon",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
