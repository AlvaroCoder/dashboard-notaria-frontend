'use client'
import React, { useState } from 'react'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { usePathname } from 'next/navigation';

export default function SideBarNavigation() {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const routes=[
    {
        routeName : "Libros",
        routePath : "/dashboard/libros",
        routeIcon : BookIcon,
        selected : true
    },
    {
        routeName : "Equipos",
        routePath : "/dashboard/equipos",
        routeIcon : LaptopChromebookIcon,
        selected : false
    },
    {
        routeName : "Usuarios",
        routePath : "/dashboard/miembros",
        routeIcon : GroupIcon,
        selected : false
    },
    {
        routeName : "Proyectos",
        routePath : "/dashboard/proyectos",
        routeIcon : LightbulbIcon,
        selected : false
    },
    {
        routeName : "Trabajos",
        routePath : "/dashboard/trabajos",
        routeIcon :  MenuBookIcon,
        selected : false
    },
    {
        routeName : "Papers",
        routePath : "/dashboard/papers",
        routeIcon : InsertDriveFileIcon,
        selected : false
    }
]
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

      </div>
    </div>
  )
}