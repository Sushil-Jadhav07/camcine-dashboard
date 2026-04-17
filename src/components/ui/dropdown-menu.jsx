import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function DropdownMenu({
  ...props
}.ComponentProps) {
  return 
}

function DropdownMenuPortal({
  ...props
}.ComponentProps) {
  return (
    
  )
}

function DropdownMenuTrigger({
  ...props
}.ComponentProps) {
  return (
    
  )
}

function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}.ComponentProps) {
  return (
    
      
    
  )
}

function DropdownMenuGroup({
  ...props
}.ComponentProps) {
  return (
    
  )
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}.ComponentProps & {
  inset?
  variant: "default" | "destructive"
}) {
  return (
    
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}.ComponentProps) {
  return (
    
      
        
          
        
      
      {children}
    
  )
}

function DropdownMenuRadioGroup({
  ...props
}.ComponentProps) {
  return (
    
  )
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}.ComponentProps) {
  return (
    
      
        
          
        
      
      {children}
    
  )
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}.ComponentProps & {
  inset?
}) {
  return (
    
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}.ComponentProps) {
  return (
    
  )
}

function DropdownMenuShortcut({
  className,
  ...props
}.ComponentProps) {
  return (
    
  )
}

function DropdownMenuSub({
  ...props
}.ComponentProps) {
  return 
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}.ComponentProps & {
  inset?
}) {
  return (
    
      {children}
      
    
  )
}

function DropdownMenuSubContent({
  className,
  ...props
}.ComponentProps) {
  return (
    
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
