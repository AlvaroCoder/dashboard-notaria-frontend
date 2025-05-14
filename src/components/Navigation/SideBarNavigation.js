'use client'
import React, { useState } from 'react'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

export default function SideBarNavigation() {
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
    </div>
  )
}