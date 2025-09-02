'use client'
import { useFetch } from '@/hooks/useFetch'
import React from 'react';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Title1 from '@/components/elements/Title1';
import dynamic from 'next/dynamic';

const TableroContratos = dynamic(()=>import('@/components/Tables/TableroContratos'),{
    ssr : false,
    loading : ()=><>Cargando tabla de inmuebles ... </>
})

export default function Page() {
    const typeContract = "compraVentaVehiculo"
    const URL_CONTRACTS_INMUEBLES = process.env.NEXT_PUBLIC_URL_HOME_CONTRACTS+`/${typeContract}`
    const {data : dataResponseVehicles, loading : loadingDataVehicles, error : errorDataProperties} = useFetch(URL_CONTRACTS_INMUEBLES);
    
  return (
    <div className='p-6 space-y-6'>
        <div className=''>
            <Title1 className='text-4xl'>Contratos Vehículos</Title1>
            <p className="text-gray-600">Gestión de los contratos subidos por los clientes.</p>
            <p className='text-gray-600'>Contratos <ChevronRightIcon/> Vehiculos</p>
        </div>
        <div>
        <TableroContratos
                    slugCreateProcess='/dashboard/contracts/vehiculo/form-add'
                    baseSlugIdContract='/dashboard/contracts/vehiculo/'
                    dataContracts={typeof(dataResponseVehicles?.data) ==='string'?[]: dataResponseVehicles?.data }
                    showMinuta={false}
                />
        </div>
    </div>
  )
}
