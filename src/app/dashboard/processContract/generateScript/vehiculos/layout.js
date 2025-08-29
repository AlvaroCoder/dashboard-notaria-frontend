import { TopBarBack } from '@/components/Navigation'
import ContractContext from '@/context/ContextContract'
import React from 'react'

export default function RootLayout({
    children
}) {
  return (
    <ContractContext>   
        <main className='w-full h-screen flex flex-col'>
            <TopBarBack/>
            <section className='w-full h-screen overflow-y-auto'>
                {children}
            </section>  
        </main>
    </ContractContext>
  )
};
