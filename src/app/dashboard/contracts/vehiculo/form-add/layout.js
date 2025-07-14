'use client';
import React from 'react';
import { TopBarBack } from '@/components/Navigation';

export default function Layout({
    children
}) {
  return (
    <div className='w-full h-screen flex flex-col'>
        <TopBarBack/>
        <main>
            {children}
        </main>
    </div>
  )
};

