import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Accordion({
  ...props
}.ComponentProps) {
  return 
}

function AccordionItem({
  className,
  ...props
}.ComponentProps) {
  return (
    
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}.ComponentProps) {
  return (
    
      svg]:rotate-180",
          className
        )}
        {...props}
      >
        {children}
        
      
    
  )
}

function AccordionContent({
  className,
  children,
  ...props
}.ComponentProps) {
  return (
    
      {children}
    
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
