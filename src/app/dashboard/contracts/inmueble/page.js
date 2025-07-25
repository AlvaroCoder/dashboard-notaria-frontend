'use client'
import React from 'react';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Title1 from '@/components/elements/Title1';
import { useDataContracts } from '@/hooks/useDataContracts';
import dynamic from 'next/dynamic';

const TableroContratos = dynamic(()=>import('@/components/Tables/TableroContratos'),{
    ssr : false,
    loading : ()=><span>Cargando tabla de inmuebles ...</span>
})

export default function Page() {
    const typeContract = "compraVentaPropiedad"

    const { data: dataResponseProperty} = useDataContracts(typeContract);

    return (
    <div className='p-6 space-y-6 h-screen overflow-y-auto'>
        <div className=''>
            <Title1 className='text-4xl'>Contratos Inmuebles</Title1>
            <p className="text-gray-600">Gestión de los contratos subidos por los clientes.</p>
            <p className='text-gray-600'>Contratos <ChevronRightIcon/> Inmuebles</p>
        </div>

        <div>
        <TableroContratos
                        dataContracts={dataResponseProperty}
                    />
        </div>
    </div>
  )
}