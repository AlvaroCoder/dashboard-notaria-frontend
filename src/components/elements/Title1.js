import { cn } from '@/lib/utils'
import React from 'react'

export default function Title1({className="",children}) {
  return (
    <h1 className={cn('font-oxford font-bold text-lg text-[#0C1019]', className)}>
        {children}
    </h1>
  )
}
