'use client'
import InputPasswordMaterialUi from '@/components/elements/InputPasswordMaterialUi'
import Title1 from '@/components/elements/Title1'
import { registerClient } from '@/lib/apiConnections'
import { Button, TextField } from '@mui/material'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

export default function Page() {
  const router = useRouter();

  const [dataClient, setDataClient] = useState({
    userName : "",
    password : ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange=(evt)=>{
    const target = evt.target;
    setDataClient({
      ...dataClient,
      [target.name] : target.value
    });
  }
  const handleSubmit=async(evt)=>{
    evt.preventDefault();
    try {
      setLoading(true);
      const newDataClient = {
        ...dataClient,
        role : {
          id : 1,
          value : "client"
        }
      }
      const response = await registerClient(newDataClient);
      const jsonResponseClient = await response.json();

      toast("Se guardo correctamente el cliente", {
        type : 'success'
      });
      router.back();
    } catch (err) {
      console.log(err);
      toast("Ocurrio un error",{
        type : 'error'
      });
    }finally{
      setLoading(false);
    }
  }
  return (
    <div className='p-6 flex-1 h-full bg-gray-200  flex justify-center items-center flex-col'>
      
      <form onSubmit={handleSubmit} className='bg-white p-4 rounded-sm shadow flex flex-col gap-4  w-full max-w-[600px] '>
        <section className='mb-6'>
          <Title1 className='text-2xl'>
            Nuevo Cliente
          </Title1>
          <p className='text-sm text-gray-600'>Ingresa información del nuevo cliente</p>
        </section>
        <TextField 
          label="Nombre de usuario" 
          className='font-poppins' 
          name='userName' 
          value={dataClient?.userName} 
          onChange={handleChange} />
        <InputPasswordMaterialUi
          value={dataClient?.password}
          onChange={handleChange}
        />
        <Button
          loading={loading}
          variant='outlined'
          type='submit'
        >
          Registrar 
        </Button>
      </form> 
    </div>
  )
}
