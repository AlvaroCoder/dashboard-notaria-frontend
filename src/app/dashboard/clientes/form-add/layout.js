'use client'
import { ChevronLeft } from '@mui/icons-material'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function Layout({
    children
}) {
    const {back} = useRouter();

  return (
    <div className='h-screen flex flex-col'>
        <nav className='w-full bg-white h-20 flex flex-row items-center p-6'>
            <div className='flex flex-row items-center text-gray-500  text-sm'>
                <ChevronLeft fontSize='20'/>
                <p className='underline cursor-pointer' onClick={()=>back()} >
                    Regresar
                </p>
            </div>
        </nav>
        {children}
    </div>
  )
}