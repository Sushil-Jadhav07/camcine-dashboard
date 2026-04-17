"use client"

import * as React from "react"
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function ContextMenu({
  ...props
}.ComponentProps) {
  return 
}

function ContextMenuTrigger({
  ...props
}.ComponentProps) {
  return (
    
  )
}

function ContextMenuGroup({
  ...props
}.ComponentProps) {
  return (
    
  )
}

function ContextMenuPortal({
  ...props
}.ComponentProps) {
  return (
    
  )
}

function ContextMenuSub({
  ...props
}.ComponentProps) {
  return 
}

function ContextMenuRadioGroup({
  ...props
}.ComponentProps) {
  return (
    
  )
}

function ContextMenuSubTrigger({
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

function ContextMenuSubContent({
  className,
  ...props
}.ComponentProps) {
  return (
    
  )
}

function ContextMenuContent({
  className,
  ...props
}.ComponentProps) {
  return (
    
      
    
  )
}

function ContextMenuItem({
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

function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}.ComponentProps) {
  return (
    
      
        
          
        
      
      {children}
    
  )
}

function ContextMenuRadioItem({
  className,
  children,
  ...props
}.ComponentProps) {
  return (
    
      
        
          
        
      
      {children}
    
  )
}

function ContextMenuLabel({
  className,
  inset,
  ...props
}.ComponentProps & {
  inset?
}) {
  return (
    
  )
}

function ContextMenuSeparator({
  className,
  ...props
}.ComponentProps) {
  return (
    
  )
}

function ContextMenuShortcut({
  className,
  ...props
}.ComponentProps) {
  return (
    
  )
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
}
