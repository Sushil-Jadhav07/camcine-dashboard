import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"

function Breadcrumb({ ...props }.ComponentProps) {
  return 
}

function BreadcrumbList({ className, ...props }.ComponentProps) {
  return (
    
  )
}

function BreadcrumbItem({ className, ...props }.ComponentProps) {
  return (
    
  )
}

function BreadcrumbLink({
  asChild,
  className,
  ...props
}.ComponentProps & {
  asChild?
}) {
  const Comp = asChild ? Slot : "a"

  return (
    
  )
}

function BreadcrumbPage({ className, ...props }.ComponentProps) {
  return (
    
  )
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}.ComponentProps) {
  return (
    svg]:size-3.5", className)}
      {...props}
    >
      {children ?? }
    
  )
}

function BreadcrumbEllipsis({
  className,
  ...props
}.ComponentProps) {
  return (
    
      
      More
    
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
