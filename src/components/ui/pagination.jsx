import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants, type Button } from "@/components/ui/button"

function Pagination({ className, ...props }.ComponentProps) {
  return (
    
  )
}

function PaginationContent({
  className,
  ...props
}.ComponentProps) {
  return (
    
  )
}

function PaginationItem({ ...props }.ComponentProps) {
  return 
}

type PaginationLinkProps = {
  isActive?
} & Pick, "size"> &
  React.ComponentProps

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}) {
  return (
    
  )
}

function PaginationPrevious({
  className,
  ...props
}.ComponentProps) {
  return (
    
      
      Previous
    
  )
}

function PaginationNext({
  className,
  ...props
}.ComponentProps) {
  return (
    
      Next
      
    
  )
}

function PaginationEllipsis({
  className,
  ...props
}.ComponentProps) {
  return (
    
      
      More pages
    
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}
