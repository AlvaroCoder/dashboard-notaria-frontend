'use client';
import Title1 from '@/components/elements/Title1';
import { useDataContracts } from '@/hooks/useDataContracts';
import { ChevronRight } from 'lucide-react';
import dynamic from 'next/dynamic'
import React from 'react'

const TableroContratos=dynamic(()=>import('@/components/Tables/TableroContratos'),{
  ssr : false,
  loading : ()=><span>Cargando tabla de contratos ...</span>
});

export default function Page() {
  const typeContract = "SCRL";
  const {data : dataReponseSCRL} = useDataContracts(typeContract);
  return (
    <section className='p-6 space-y-6 h-screen overflow-y-auto'>
      <div className=''>
        <Title1 className='text-4xl'>Contrato de Constitucion de Asociacion</Title1>
        <p className='text-gray-600'>Gestion de los contratos de constitución de asociacion</p>
        <p className='text-gray-600 flex flex-row'>Contratos <ChevronRight/> Asociacion</p>
      </div>
      <div>
        <TableroContratos
          dataContracts={dataReponseSCRL}
        />
      </div>
    </section>
  )
};