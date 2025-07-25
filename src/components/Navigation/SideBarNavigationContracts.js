'use client';
import { routes } from '@/data/RoutesLink';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React, { useState } from 'react'

export default function SideBarNavigationContracts() {

    const [dataRoutes, setDataRoutes] = useState(routes);
    const handleChange=(idx)=>{
        const newDataRoutes = dataRoutes?.map((item, key)=> key === idx ? {...item, selected : true} : {...item, selected: false} )
        setDataRoutes(newDataRoutes);
    }

  return (
    <aside className={cn('h-full shadow w-20 xl:min-w-[180px] ')}>
        <ul className='flex flex-col px-2 gap-2 mt-4'>
            {
                dataRoutes.map((item, idx)=>{
                    const Icon = item.icon;
                    return(
                        <li 
                        key={idx} 
                        onClick={()=>handleChange(idx)}
                        className={cn('rounded-sm p-4 w-full ',item.selected && 'bg-[#F6DF9B] text-[#0C1019]')}>
                            <Link 
                            className='flex flex-row gap-2' 
                            href={item.routePath}>
                                <Icon/>
                                <p className='hidden xl:block'>{item.routename}</p>
                            </Link>
                        </li>
                    )
                })
            }
        </ul>
    </aside>
  )
};
