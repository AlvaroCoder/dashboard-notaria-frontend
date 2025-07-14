'use client'
import { TopBarBack } from '@/components/Navigation';
import React from 'react'

export default function Layout({
    children
}) {
  return (
    <section className='w-full h-screen overflow-y-hidden flex flex-col'>
        <TopBarBack/>
        {children}
    </section>
  )
}
