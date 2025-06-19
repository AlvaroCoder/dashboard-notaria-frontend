import { cn } from '@/lib/utils'
import { XCircle } from 'lucide-react'
import React from 'react'

export default function ErrorCard({
    title='',
    message,
    className,
    onClose,
}) {
  return (
    <div 
        className={cn(
            "flex items-start gap-4 p-4 rounded-sm border border-red-300 bg-red-50 text-red-800 shadow-sm",
            className
        )}
    >
        <XCircle className="h-6 w-6 text-red-500 mt-1" />
        <section className='flex-1'>
            <h4 className="text-lg font-semibold">{title}</h4>
            <p className="text-sm">{message}</p>
        </section>
        {
            onClose && (
                <button
                className="text-red-500 hover:text-red-700 transition"
                onClick={onClose}
              >
                <span className="sr-only">Cerrar</span>
                ✕
              </button>
            )
        }
    </div>
  )
}
