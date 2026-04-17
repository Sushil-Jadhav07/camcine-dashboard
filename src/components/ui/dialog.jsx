import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Dialog({
  ...props
}.ComponentProps) {
  return 
}

function DialogTrigger({
  ...props
}.ComponentProps) {
  return 
}

function DialogPortal({
  ...props
}.ComponentProps) {
  return 
}

function DialogClose({
  ...props
}.ComponentProps) {
  return 
}

function DialogOverlay({
  className,
  ...props
}.ComponentProps) {
  return (
    
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}.ComponentProps & {
  showCloseButton?
}) {
  return (
    
      
      
        {children}
        {showCloseButton && (
          
            
            Close
          
        )}
      
    
  )
}

function DialogHeader({ className, ...props }.ComponentProps) {
  return (
    
  )
}

function DialogFooter({ className, ...props }.ComponentProps) {
  return (
    
  )
}

function DialogTitle({
  className,
  ...props
}.ComponentProps) {
  return (
    
  )
}

function DialogDescription({
  className,
  ...props
}.ComponentProps) {
  return (
    
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
