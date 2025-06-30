'use client'
import React from 'react'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useRouter } from 'next/navigation';
import ContextCardComp from '@/context/ContextCard';

export default function Layout({
    children
}) {
    const {back} = useRouter();
  return (
    <ContextCardComp>
        <div>
            <nav className='p-4 w-full shadow-sm h-20 flex flex-row items-center'>
                <div className='flex flex-row items-center text-gray-500  text-sm'>
                    <ArrowBackIosIcon fontSize='20'/>
                    <p className='underline cursor-pointer' onClick={()=>back()} >
                        Regresar
                    </p>
                </div>
            </nav>
            <main className='w-full h-screen overflow-y-auto'>
                {children}
            </main>
        </div>
    </ContextCardComp>
  )
}
