import type * as React from "react"
import { Toggle } from "@base-ui/react/toggle"
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleGroupItemVariants = cva(
  "inline-flex min-w-0 items-center justify-center rounded-lg border border-transparent px-3 py-2 text-sm font-medium whitespace-nowrap text-muted-foreground transition-all outline-none select-none hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px data-[pressed]:bg-primary data-[pressed]:text-primary-foreground disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      size: {
        default: "min-h-10",
        sm: "min-h-8 px-2.5 py-1.5 text-xs",
        lg: "min-h-11 px-4 py-2.5 text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

function ToggleGroup({
  className,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive>) {
  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-xl border border-border/70 bg-background/80 p-1 shadow-xs",
        className
      )}
      {...props}
    />
  )
}

function ToggleGroupItem({
  className,
  size,
  ...props
}: React.ComponentProps<typeof Toggle> &
  VariantProps<typeof toggleGroupItemVariants>) {
  return (
    <Toggle
      data-slot="toggle-group-item"
      className={cn(toggleGroupItemVariants({ className, size }))}
      {...props}
    />
  )
}

export { ToggleGroup, ToggleGroupItem }
