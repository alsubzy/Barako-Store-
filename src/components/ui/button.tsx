import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3338A0]/20 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#0B1221] text-white hover:bg-[#0B1221]/90 hover:shadow-lg hover:shadow-[#0B1221]/10 hover:scale-[1.02]",
        destructive:
          "bg-rose-600 text-white hover:bg-rose-700 hover:scale-[1.02]",
        outline:
          "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900",
        secondary:
          "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:scale-[1.02]",
        ghost: "hover:bg-slate-100 text-slate-600 hover:text-slate-900",
        link: "text-primary underline-offset-4 hover:underline",
        premium: "bg-gradient-to-r from-[#3338A0] to-[#4B51C9] text-white hover:opacity-90 shadow-lg shadow-[#3338A0]/20 hover:scale-[1.02]",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  icon?: LucideIcon
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, icon: Icon, children, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {Icon && <Icon className="mr-0.5" />}
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
