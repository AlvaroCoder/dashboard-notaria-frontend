'use client'
import { useFetch } from '@/hooks/useFetch'
import React from 'react';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import TableroContratosCarga from '@/components/Tables/TableroContratoCarga';
import { TableroContratos } from '@/components/Tables';
import Title1 from '@/components/elements/Title1';

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
        <div className="w-full flex flex-row sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative w-full ">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                    type="text"
                    placeholder="Buscar contratos..."
                    className="pl-10 w-full"
                />
            </div>
            <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Agregar contrato
            </Button>              
        </div>
        <div>
            {
                loadingDataVehicles ?
                <TableroContratosCarga/> :
                <TableroContratos
                    dataContracts={typeof(dataResponseVehicles?.data) ==='string'?[]: dataResponseVehicles?.data }
                />
            }
        </div>
    </div>
  )
}
