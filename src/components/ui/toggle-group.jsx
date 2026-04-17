import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { toggleVariants } from "@/components/ui/toggle"

const ToggleGroupContext = React.createContext & {
    spacing?
  }
>({
  size: "default",
  variant: "default",
  spacing: 0,
})

function ToggleGroup({
  className,
  variant,
  size,
  spacing = 0,
  children,
  ...props
}.ComponentProps &
  VariantProps & {
    spacing?
  }) {
  return (
    
      
        {children}
      
    
  )
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  ...props
}.ComponentProps &
  VariantProps) {
  const context = React.useContext(ToggleGroupContext)

  return (
    
      {children}
    
  )
}

export { ToggleGroup, ToggleGroupItem }
