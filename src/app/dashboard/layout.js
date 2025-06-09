import { SideBarNavigation, TopBarNavigation } from '@/components/Navigation'
import React from 'react'

export default function RootLayout({ children }) {
  return (
    <section className='w-full min-h-screen flex flex-row bg-white text-black'>
        <SideBarNavigation/>
        <div className='w-full h-screen flex flex-col overflow-y'>
            <TopBarNavigation/>
            {children}
        </div>
    </section>
  )
};
