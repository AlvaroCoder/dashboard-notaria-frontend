'use client';
import Title1 from '@/components/elements/Title1';
import { useDataContracts } from '@/hooks/useDataContracts';
import { ChevronRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import React from 'react'

const TableroContratos = dynamic(()=>import('@/components/Tables/TableroContratos'),{
    ssr : false,
    loading : ()=><span>Cargando tabla de razon social ...</span>
});

export default function Page() {
    const typeContract="RS";
    const {data : dataResponseRS} = useDataContracts(typeContract);
    
    return (
    <section className='p-6 space-y-6 h-screen overflow-y-auto'>
        <div>
            <Title1 className='text-4xl'>Contrato de constitucion de Razon Social (RS)</Title1>
            <p className='text-gray-600'>Gestion de los contratos de cónstitucion de razon social (RS)</p>
            <p className='text-gray-600 flex flex-row'>Contratos <ChevronRight/> Razon Social</p>
        </div>
        <div>
            <TableroContratos
                titulo='Constitucion de SAC'
                dataContracts={typeof(dataResponseRS)==='string' ? [] : dataResponseRS}
                baseSlugIdContract='/dashboard/contracts/rs'
                slugCreateProcess='/dashboard/contracts/rs/form-add'
            />
        </div>
    </section>
  )
};
