'use client'
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { getSession } from '@/authentication/lib';
import { UserIcon } from 'lucide-react';

export default function TopBarNavigationMain() {
    const router = useRouter();
    const pathname = usePathname();
    const [username, setUsername] = useState(null);
    const existeRutaAdmin = pathname.split("/").includes("login") || pathname.split("/").includes("dashboard") ;
    useEffect(()=>{
        async function getDataUsername() {
            const session = await getSession();
            
            const user = session?.user?.username;
            setUsername(user);
        }
        getDataUsername();

    },[]);
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
                {
                    username ? <p className='flex flex-row items-center gap-4'><UserIcon/> {username}</p> : <p>Iniciar Sesión</p>
                }
            </button>
        </section>
    </nav>
  )
}