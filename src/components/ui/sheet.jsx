import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Sheet({ ...props }.ComponentProps) {
  return 
}

function SheetTrigger({
  ...props
}.ComponentProps) {
  return 
}

function SheetClose({
  ...props
}.ComponentProps) {
  return 
}

function SheetPortal({
  ...props
}.ComponentProps) {
  return 
}

function SheetOverlay({
  className,
  ...props
}.ComponentProps) {
  return (
    
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  ...props
}.ComponentProps & {
  side: "top" | "right" | "bottom" | "left"
}) {
  return (
    
      
      
        {children}
        
          
          Close
        
      
    
  )
}

function SheetHeader({ className, ...props }.ComponentProps) {
  return (
    
  )
}

function SheetFooter({ className, ...props }.ComponentProps) {
  return (
    
  )
}

function SheetTitle({
  className,
  ...props
}.ComponentProps) {
  return (
    
  )
}

function SheetDescription({
  className,
  ...props
}.ComponentProps) {
  return (
    
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
