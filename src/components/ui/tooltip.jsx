"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

function TooltipProvider({
  delayDuration = 0,
  ...props
}.ComponentProps) {
  return (
    
  )
}

function Tooltip({
  ...props
}.ComponentProps) {
  return (
    
      
    
  )
}

function TooltipTrigger({
  ...props
}.ComponentProps) {
  return 
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}.ComponentProps) {
  return (
    
      
        {children}
        
      
    
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
