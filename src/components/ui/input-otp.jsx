import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { MinusIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function InputOTP({
  className,
  containerClassName,
  ...props
}.ComponentProps & {
  containerClassName?
}) {
  return (
    
  )
}

function InputOTPGroup({ className, ...props }.ComponentProps) {
  return (
    
  )
}

function InputOTPSlot({
  index,
  className,
  ...props
}.ComponentProps & {
  index
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

  return (
    
      {char}
      {hasFakeCaret && (
        
          
        
      )}
    
  )
}

function InputOTPSeparator({ ...props }.ComponentProps) {
  return (
    
      
    
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
