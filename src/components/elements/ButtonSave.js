import React from 'react'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'

export default function ButtonSave({
    loading=false,
    onClick,
    children,
    type="button"
}) {
  return (
   <Button 
    type={type}
    onClick={onClick} 
    disabled={loading}
    className='w-full p-6 bg-[#515A7B]'>
        {
            loading ?
            <Loader2 className='animate-spin'/>:
            <p className='font-oxford text-lg font-semibold'>
                {children}
            </p>
        }
   </Button>
  )
};
