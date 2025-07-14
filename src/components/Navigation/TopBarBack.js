'use client'
import { useRouter } from 'next/navigation'
import React from 'react'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

export default function TopBarBack() {
    const {back} = useRouter();

  return (
    <nav className='p-4 w-full shadow-sm h-20 flex flex-row items-center'>
        <div className='flex flex-row items-center text-gray-500 text-sm'>
            <ArrowBackIosIcon fontSize='20'/>
            <p className='underline cursor-pointer' onClick={()=>back()} >
                Regresar
            </p>
        </div>
    </nav>
  )
}