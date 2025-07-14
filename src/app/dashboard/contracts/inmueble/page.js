'use client'
import React, { useEffect, useState } from 'react';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { TableroContratos } from '@/components/Tables';
import TableroContratosCarga from '@/components/Tables/TableroContratoCarga';
import Title1 from '@/components/elements/Title1';

export default function Page() {
    const typeContract = "compraVentaPropiedad"
    const URL_CONTRACTS_INMUEBLES = `http://localhost:8000/home/contracts/${typeContract}`
    const [loadingDataProperties, setLoadingDataProperties] = useState(false);
    const [error, setError] = useState(null);
    
    const [dataResponseProperty, setDataResponseProperty] = useState(null);
    useEffect(() => {
      async function fetchData() {
        try {
            setLoadingDataProperties(true);
            console.log(URL_CONTRACTS_INMUEBLES);
            
            const response = await fetch(URL_CONTRACTS_INMUEBLES, {
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'GET',
                mode: 'cors',
                redirect  : 'follow'
            });
            if (!response.ok) {
                const jsonResponse = await response.json();
                setError(jsonResponse?.detail);
                return;
            }
            const jsonResponse = await response.json();
            console.log(jsonResponse);
            
            setDataResponseProperty(jsonResponse);
            
        } catch (err) {
            console.log(err);
            
        } finally{
            setLoadingDataProperties(false);
        }
      }
      fetchData();
    }, [])
    

    return (
    <div className='p-6 space-y-6 h-screen overflow-y-auto'>
        <div className=''>
            <Title1 className='text-4xl'>Contratos Inmuebles</Title1>
            <p className="text-gray-600">Gestión de los contratos subidos por los clientes.</p>
            <p className='text-gray-600'>Contratos <ChevronRightIcon/> Inmuebles</p>
        </div>

        <div>
            {
                (loadingDataProperties ) ?
                <TableroContratosCarga/> :
                <TableroContratos
                    dataContracts={dataResponseProperty?.data}
                />
            }
        </div>
    </div>
  )
}