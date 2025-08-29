'use client'
import React, { useState, useEffect } from 'react'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { usePathname } from 'next/navigation';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { CircleUserIcon, HomeIcon, LogOut, UserIcon } from 'lucide-react';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import Link from 'next/link';
import Image from 'next/image';
import { getSession, logout } from '@/authentication/lib';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
; // tu función para leer cookie

export default function SideBarNavigation() {
  const URL_IMG_LOGO_NOTARIA = 'https://res.cloudinary.com/dabyqnijl/image/upload/v1750349721/ImagesNotariaRojas/z2znxywil3jx4r6htzra.png';

  const routes = [
    {
      routeName: "Inicio",
      routePath: "/dashboard",
      routeIcon: HomeIcon,
      selected: true
    },
    {
      routeName: "Contratos",
      routePath: "/dashboard/contracts",
      routeIcon: InsertDriveFileIcon,
      selected: false
    },
    {
      routeName: "Clientes",
      routePath: "/dashboard/clientes",
      routeIcon: UserIcon,
      selected: false
    },
    {
      routeName: "Juniors",
      routePath: "/dashboard/juniors",
      routeIcon: CircleUserIcon,
      selected: false
    },
    {
      routeName: "Seniors",
      routePath: "/dashboard/seniors",
      routeIcon: LocalPoliceIcon,
      selected: false
    }
  ];

  const [dataRoutes, setDataRoutes] = useState(routes);
  const [openSidebar, setOpenSidebar] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      const session = await getSession();
      const role = session?.user?.payload?.role;

      if (role === 'junior') {
        // Filtrar rutas para que no aparezcan Juniors y Seniors
        const filteredRoutes = routes.filter(
          route => route.routeName !== "Juniors" && route.routeName !== "Seniors" && route?.routeName !== "Inicio"
        );
        setDataRoutes(filteredRoutes);
      } else {
        setDataRoutes(routes);
      }
    };
    fetchUserRole();
  }, []);

  const handleClick = (index) => {
    const newDataRoutes = dataRoutes.map((item, idx) => ({
      ...item,
      selected: index === idx
    }));
    setDataRoutes(newDataRoutes);
  };

  const handleChangeOpenSidebar = () => setOpenSidebar(!openSidebar);
  const handleLogOut=async()=>{
    await logout();
  }
  return (
    <div className={`${openSidebar ? 'w-52' : 'w-20'} bg-[#0C1019] shadow-sm  flex flex-col justify-between z-50 relative duration-300`}>
      {openSidebar ? (
        <KeyboardDoubleArrowLeftIcon
          onClick={handleChangeOpenSidebar}
          className='absolute bg-white text-[#0C1019] text-3xl rounded-full top-9 border border-[#0C1019] -right-3 cursor-pointer z-50'
        />
      ) : (
        <KeyboardDoubleArrowRightIcon
          onClick={handleChangeOpenSidebar}
          className='absolute bg-white text-[#0C1019] text-3xl rounded-full top-9 border border-[#0C1019] -right-3 cursor-pointer z-50'
        />
      )}

      <div className='mt-12'>
        <div className='p-1 m-4 rounded-sm bg-[#1B2943]/20'>
          <Image
            src={URL_IMG_LOGO_NOTARIA}
            width={200}
            height={80}
            alt='Logo de la notaria'
          />
        </div>
        <ul className='block mt-6 text-white'>
          {dataRoutes.map((item, idx) => {
            const Icon = item.routeIcon;
            return (
              <Link key={idx} href={item.routePath}>
                <li
                  onClick={() => handleClick(idx)}
                  className={`border-l-4 border-l-[#0C1019] ${item.selected && "text-[#F6DF9B] border-l-[#F6DF9B]"} list-none hover:text-[#F6DF9B] cursor-pointer p-4 w-full flex flex-row items-center ${!openSidebar && 'justify-center'}`}
                >
                  <Icon />
                  {openSidebar && <p className='ml-2'>{item.routeName}</p>}
                </li>
              </Link>
            );
          })}
        </ul>
        
      </div>
      <div className={`${openSidebar ? 'w-52' : 'w-20'} bg-[#0C1019] shadow-sm flex flex-col justify-between z-50 relative duration-300`}>
        {/* ... resto del código ... */}

        <div className="p-4">
          <Button
            onClick={handleLogOut}
            className={cn('flex items-center gap-2 p-6 bg-white/40 rounded-sm w-full')}
          >
            <LogOut />
            {openSidebar && <p>Cerrar Sesión</p>}
          </Button>
        </div>
      </div>
    </div>
  );
}