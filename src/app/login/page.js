import { LoginForm } from '@/components/Forms'
import React from 'react'

export default function Page() {
  return (
    <div className='w-full min-h-screen bg-white flex flex-row'>
      <section className='flex-1 h-screen bg-guinda-oscuro'>

      </section>
     <section className='flex-1 min-h-screen flex justify-center items-center'>
      <div className='w-lg'>
        <LoginForm/>
      </div>
     </section>
    </div>
  )
};