import * as React from "react"
import { GripVerticalIcon } from "lucide-react"
import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@/lib/utils"

function ResizablePanelGroup({
  className,
  ...props
}.ComponentProps) {
  return (
    
  )
}

function ResizablePanel({
  ...props
}.ComponentProps) {
  return 
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}.ComponentProps & {
  withHandle?
}) {
  return (
    div]:rotate-90",
        className
      )}
      {...props}
    >
      {withHandle && (
        
          
        
      )}
    
  )
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
