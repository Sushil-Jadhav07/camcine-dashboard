import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Select({
  ...props
}.ComponentProps) {
  return 
}

function SelectGroup({
  ...props
}.ComponentProps) {
  return 
}

function SelectValue({
  ...props
}.ComponentProps) {
  return 
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}.ComponentProps & {
  size: "sm" | "default"
}) {
  return (
    
      {children}
      
        
      
    
  )
}

function SelectContent({
  className,
  children,
  position = "item-aligned",
  align = "center",
  ...props
}.ComponentProps) {
  return (
    
      
        
        
          {children}
        
        
      
    
  )
}

function SelectLabel({
  className,
  ...props
}.ComponentProps) {
  return (
    
  )
}

function SelectItem({
  className,
  children,
  ...props
}.ComponentProps) {
  return (
    
      
        
          
        
      
      {children}
    
  )
}

function SelectSeparator({
  className,
  ...props
}.ComponentProps) {
  return (
    
  )
}

function SelectScrollUpButton({
  className,
  ...props
}.ComponentProps) {
  return (
    
      
    
  )
}

function SelectScrollDownButton({
  className,
  ...props
}.ComponentProps) {
  return (
    
      
    
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
