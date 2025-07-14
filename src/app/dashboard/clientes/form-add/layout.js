'use client'
import { TopBarBack } from '@/components/Navigation'
import React from 'react'

export default function Layout({
    children
}) {

  return (
    <div className='h-screen flex flex-col'>
        <TopBarBack/>
        {children}
    </div>
  )
}