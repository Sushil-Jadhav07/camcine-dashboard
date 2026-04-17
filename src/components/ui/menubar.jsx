import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Menubar({
  className,
  ...props
}.ComponentProps) {
  return (
    
  )
}

function MenubarMenu({
  ...props
}.ComponentProps) {
  return 
}

function MenubarGroup({
  ...props
}.ComponentProps) {
  return 
}

function MenubarPortal({
  ...props
}.ComponentProps) {
  return 
}

function MenubarRadioGroup({
  ...props
}.ComponentProps) {
  return (
    
  )
}

function MenubarTrigger({
  className,
  ...props
}.ComponentProps) {
  return (
    
  )
}

function MenubarContent({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  ...props
}.ComponentProps) {
  return (
    
      
    
  )
}

function MenubarItem({
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

function MenubarCheckboxItem({
  className,
  children,
  checked,
  ...props
}.ComponentProps) {
  return (
    
      
        
          
        
      
      {children}
    
  )
}

function MenubarRadioItem({
  className,
  children,
  ...props
}.ComponentProps) {
  return (
    
      
        
          
        
      
      {children}
    
  )
}

function MenubarLabel({
  className,
  inset,
  ...props
}.ComponentProps & {
  inset?
}) {
  return (
    
  )
}

function MenubarSeparator({
  className,
  ...props
}.ComponentProps) {
  return (
    
  )
}

function MenubarShortcut({
  className,
  ...props
}.ComponentProps) {
  return (
    
  )
}

function MenubarSub({
  ...props
}.ComponentProps) {
  return 
}

function MenubarSubTrigger({
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

function MenubarSubContent({
  className,
  ...props
}.ComponentProps) {
  return (
    
  )
}

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
}
