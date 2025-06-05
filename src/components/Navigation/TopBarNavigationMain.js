'use client'
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Button } from '../ui/button';

export default function TopBarNavigationMain() {
    const router = useRouter();
    const [isFixed, setIsFixed] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const existeRutaAdmin = pathname.split("/").includes("login") || pathname.split("/").includes("dashboard") ;
  return (
    <nav
        className={`
        w-full h-32 px-4 flex flex-row justify-between items-center shadow-lg 
        ${existeRutaAdmin ? 'hidden' : 'block'}
        `}
    >
        <section>
            <Image
                objectFit='cover'
                alt='Logo Notaria'
                src={'https://res.cloudinary.com/dabyqnijl/image/upload/v1747943739/Notaria/g9rd5eldgeea4epvzcuo.jpg'}
                width={200}
                height={100}
            />
        </section>
        <section>
            <button
                className='px-4 py-3  rounded-lg bg-amarillo hover:bg-yellow-500 text-black cursor-pointer'
                onClick={()=>router.push("/login")}
            >   
                <p>Iniciar Sesión</p>
            </button>
        </section>
    </nav>
  )
}