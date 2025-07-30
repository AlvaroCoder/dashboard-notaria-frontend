import { TopBarBack } from '@/components/Navigation'
import React from 'react'

export default function Layout({
    children
}) {
  return (
    <div className='w-full flex flex-col min-h-screen'>
        <TopBarBack/>
        <main>
            {children}
        </main>
    </div>
  )
}
