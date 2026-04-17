"use client"

import * as React from "react"
import type * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider

type FormFieldContextValue = FieldPath,
> = {
  name
}

const FormFieldContext = React.createContext(
  {} as FormFieldContextValue
)

const FormField =  = FieldPath,
>({
  ...props
}, TName>) => {
  return (
    
      
    
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext.name })
  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within ")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id
}

const FormItemContext = React.createContext(
  {} as FormItemContextValue
)

function FormItem({ className, ...props }.ComponentProps) {
  const id = React.useId()

  return (
    
      
    
  )
}

function FormLabel({
  className,
  ...props
}.ComponentProps) {
  const { error, formItemId } = useFormField()

  return (
    
  )
}

function FormControl({ ...props }.ComponentProps) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    
  )
}

function FormDescription({ className, ...props }.ComponentProps) {
  const { formDescriptionId } = useFormField()

  return (
    
  )
}

function FormMessage({ className, ...props }.ComponentProps) {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? "") : props.children

  if (!body) {
    return null
  }

  return (
    
      {body}
    
  )
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
