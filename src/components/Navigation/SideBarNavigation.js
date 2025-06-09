'use client'
import React, { useState } from 'react'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { usePathname } from 'next/navigation';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { HomeIcon } from 'lucide-react';

import PersonIcon from '@mui/icons-material/Person';
import Link from 'next/link';

export default function SideBarNavigation() {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const routes=[
    {
        routeName : "Inicio",
        routePath : "/dashboard",
        routeIcon : HomeIcon,
        selected : true
    },
    {
        routeName : "Contratos",
        routePath : "/dashboard/contracts/inmueble",
        routeIcon : InsertDriveFileIcon,
        selected : false
    },
    {
        routeName : "Usuarios",
        routePath : "/dashboard/usuarios",
        routeIcon : PersonIcon,
        selected : false
    }
];
  const [dataRoutes, setDataRoutes] = useState(routes);
const handleClick = (index)=>{
  const newDataRoutes = dataRoutes.map((item, idx)=>{
      if (index === idx) {
          return {
              ...item,
              selected : true
          }
      }
      return {
          ...item,
          selected : false
      }
  })
  setDataRoutes(newDataRoutes)
}
  const [openSidebar, setOpenSidebar] = useState(false);
  const handleChangeOpenSidebar =()=>setOpenSidebar(!openSidebar);
  return (
    <div className={`${openSidebar ? 'w-48' : 'w-20'}  bg-guinda-oscuro shadow-sm h-screen flex flex-col justify-between z-50 relative duration-300`}>
      {
        openSidebar ? <KeyboardDoubleArrowLeftIcon
          onClick={handleChangeOpenSidebar}
          className='absolute bg-white text-guinda-oscuro text-3xl  rounded-full top-9 border border-guinda-claro -right-3 cursor-pointer z-50'
        /> :
        <KeyboardDoubleArrowRightIcon
          className='absolute bg-white text-guinda-oscuro text-3xl rounded-full top-9 border border-guinda-claro -right-3 cursor-pointer z-50'
          onClick={handleChangeOpenSidebar}
        /> 
      } 
      <div className='mt-12`'>
        <ul className='block mt-6'>
            {
              dataRoutes.map((item, idx)=>{
                const Icon = item.routeIcon;
                return (
                  <Link 
                    key={idx} 
                    href={item.routePath}>
                    <li 
                    onClick={()=>handleClick(idx)}
                    className={`${item.selected && "bg-guinda-claro"} list-none text-white cursor-pointer p-4 hover:bg-guinda-claro w-full flex flex-row items-center ${!openSidebar && 'justify-center'}`} >
                        <Icon/>
                      {
                        openSidebar &&  <p className='ml-2'>{item.routeName}</p> 
                      }
                    </li>
                  </Link>
                )
              })
            }
        </ul>
      </div>
    </div>
  )
}