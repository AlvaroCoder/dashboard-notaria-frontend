import { SideBarNavigationContracts } from '@/components/Navigation'
import React from 'react'

export default function RootLayout({children}) {
  return (
    <div className='flex flex-row w-full h-full'>
        <SideBarNavigationContracts/>
       <main className='w-full'>
       {children}
       </main>
    </div>
  )
}
