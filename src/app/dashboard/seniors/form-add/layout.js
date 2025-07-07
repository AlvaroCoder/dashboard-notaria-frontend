'use client'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function Layout({
    children
}) {
    const {back} = useRouter();
  return (
    <section className='w-full h-screen overflow-y-hidden flex flex-col'>
        <nav className='w-full bg-white h-20 flex flex-row items-center p-6  text-gray-500'>
            <ChevronLeft fontSize={'20'}/>
            <p className='underline cursor-pointer text-sm' onClick={()=>back()}> 
                Regresar
            </p>
        </nav>
        {children}
    </section>
  )
}
