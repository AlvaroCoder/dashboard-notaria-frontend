'use client'
import { TopBarBack } from '@/components/Navigation'
import ContractContext from '@/context/ContextContract'
import React from 'react'

export default function Layout({
    children
}) {
  return (
    <ContractContext>
      <div className='w-full h-screen flex flex-col'>
      <TopBarBack/>
      <main className='w-full h-screen overflow-y-auto'>
          {children}
      </main>
      </div>
    </ContractContext>
  )
};
