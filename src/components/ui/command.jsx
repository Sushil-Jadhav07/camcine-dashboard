import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

function Command({
  className,
  ...props
}.ComponentProps) {
  return (
    
  )
}

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = true,
  ...props
}.ComponentProps & {
  title?
  description?
  className?
  showCloseButton?
}) {
  return (
    
      
        {title}
        {description}
      
      
        
          {children}
        
      
    
  )
}

function CommandInput({
  className,
  ...props
}.ComponentProps) {
  return (
    
      
      
    
  )
}

function CommandList({
  className,
  ...props
}.ComponentProps) {
  return (
    
  )
}

function CommandEmpty({
  ...props
}.ComponentProps) {
  return (
    
  )
}

function CommandGroup({
  className,
  ...props
}.ComponentProps) {
  return (
    
  )
}

function CommandSeparator({
  className,
  ...props
}.ComponentProps) {
  return (
    
  )
}

function CommandItem({
  className,
  ...props
}.ComponentProps) {
  return (
    
  )
}

function CommandShortcut({
  className,
  ...props
}.ComponentProps) {
  return (
    
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
