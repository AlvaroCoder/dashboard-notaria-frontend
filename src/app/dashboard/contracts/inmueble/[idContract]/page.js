'use client'
import { CompradoresList, VendedoresList } from '@/components/Tables';
import { TextEditor } from '@/components/Views';
import { useFetch } from '@/hooks/useFetch';
import { Button } from '@mui/material';
import { useParams } from 'next/navigation'
import React from 'react'

export default function Page() {
  const URL_CONTRACT_ID = "http://localhost:8000/home/contract/?idContract=";
    const {idContract} = useParams();
    const {
      data : dataResponseContract, 
      loading : loadingDataContract, 
      error : errorDataContract} = useFetch(URL_CONTRACT_ID + idContract);   
    const dataContract = dataResponseContract?.data || null;
    console.log(dataResponseContract);
  if (loadingDataContract) {
    return (
      <div className='p-6 space-y-6'>
        <h1 className='text-3xl font-bold text-gray-800'>Cargando contrato...</h1>
      </div>
    )
  }
  if (errorDataContract) {
    return (
      <div className='p-6 space-y-6'>
        <h1 className='text-3xl font-bold text-red-600'>Error al cargar el contrato</h1>
      </div>
    )
  }
  if (!dataResponseContract || dataResponseContract.data.length === 0) {
    return (
      <div className='p-6 space-y-6'>
        <h1 className='text-3xl font-bold text-gray-800'>Contrato no encontrado</h1>
      </div>
    )
  }
  return (
    <div className='p-8 space-y-6 '>
      <section>
      <h1 className='text-3xl font-bold text-gray-800'>Detalles del Contrato</h1>
      <p>Información detallada del contrato</p> 
      </section>
      <div className='w-full flex flex-row  gap-4 bg-gray-100 p-4 rounded-lg '>
        <Button>
          Editar Contrato
        </Button>
      </div>
      <CompradoresList
        dataCompradores={dataContract?.buyers?.people || []}
      />
      <VendedoresList
        dataVendedores={dataContract?.sellers?.people || []}
      />
      <TextEditor/>
    </div>
  )
}
