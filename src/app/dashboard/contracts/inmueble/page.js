'use client'
import { useFetch } from '@/hooks/useFetch'
import React from 'react';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TableroContratos } from '@/components/Tables';
import TableroContratosCarga from '@/components/Tables/TableroContratoCarga';

export default function Page() {
    const typeContract = "propertyCompraVenta"
    const URL_CONTRACTS_INMUEBLES = `http://localhost:8000/home/contracts/${typeContract}`
    const URL_CONTRACT_STATUS = "http://localhost:8000/home/contractStatus/";
    
    const {data : dataResponseProperty, loading : loadingDataProperties, error : errorDataProperties} = useFetch(URL_CONTRACTS_INMUEBLES);
    console.log(dataResponseProperty);
    const {data : dataResponseStatus, loading : loadingDataStatus, error : erroDataStatus} = useFetch(URL_CONTRACT_STATUS);
    console.log(dataResponseStatus);
    
    return (
    <div className='p-6 space-y-6'>
        <div className=''>
            <h1 className='text-3xl font-bold text-gray-800'>Contratos</h1>
            <p className="text-gray-600">Gestión de los contratos subidos por los clientes.</p>
            <p className='text-gray-600'>Contratos <ChevronRightIcon/> Inmuebles</p>
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
                loadingDataProperties ?
                <TableroContratosCarga/> :
                <TableroContratos
                    dataContracts={dataResponseProperty?.data}
                />
            }
        </div>
    </div>
  )
}