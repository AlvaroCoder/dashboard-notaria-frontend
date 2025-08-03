'use client';
import React from 'react';
import { TopBarBack } from '@/components/Navigation';
import ContractContext from '@/context/ContextContract';

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

