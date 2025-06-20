'use client'
import { useRouter } from 'next/navigation'
import React from 'react'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Button } from '@/components/ui/button';
import SaveIcon from '@mui/icons-material/Save';

export default function Layout({children}) {
    const router = useRouter();
  return (
    <div className='flex flex-col h-full w-full'>
        <nav className='p-4 w-full shadow-sm h-20 flex flex-row items-center justify-between'>
            <div className='flex flex-row items-center text-gray-500  text-sm'>
                <ArrowBackIosIcon fontSize='20'/>
                <p className='underline cursor-pointer' onClick={()=>router.back()}>
                    Regresar
                </p>
            </div>
            <div>
                <Button className={'bg-green-900 rounded-sm hover:opacity-30 text-white'} variant={"outlined"}>
                    <SaveIcon/>
                    <p>Guardar</p>
                </Button>
            </div>
        </nav>
        <main className='w-full h-screen overflow-y-hidden'>
            {children}
        </main>
    </div>
  )
};