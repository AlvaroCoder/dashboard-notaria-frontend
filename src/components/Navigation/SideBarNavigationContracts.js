import { Car, HomeIcon } from 'lucide-react'
import Link from 'next/link';
import React from 'react'

export default function SideBarNavigationContracts() {
    const routes = [
        {routename : "Inmuebles", routePath : "/dashboard/contracts/inmueble", icon : HomeIcon},
        {routename : "Vehiculos", routePath : "/dashboard/contracts/vehiculo", icon : Car}
    ]
  return (
    <aside className='min-w-[200px] h-full shadow'>
        <ul className='flex flex-col px-2 gap-2 mt-4'>
            {
                routes.map((item, idx)=>{
                    const Icon = item.icon;
                    return(
                        <li key={idx} className='rounded-lg p-4 w-full '>
                            <Link className='flex flex-row gap-2' href={item.routePath}>
                                <Icon/>
                                {item.routename}
                            </Link>
                        </li>
                    )
                })
            }
        </ul>
    </aside>
  )
};
