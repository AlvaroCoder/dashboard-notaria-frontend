'use client'
import TableroCarga from '@/components/Loading/TableroCarga'
import TableMangeUser from '@/components/Tables/TableManageUser'
import { useFetch } from '@/hooks/useFetch'
import { useRouter } from 'next/navigation'
import React from 'react';

const headers = [
    {value : "Nombre", head : ["firstName", "lastName"]},
    {value : "Usuario", head : "userName"},
    {value : "Email", head : "email"},
    {value : "Telefono", head : "phone"},
    {value : "Direccion", head : 'address'}
];

export default function Page() {
    const URL_DATA_CLIENTES = "http://localhost:8000/home/client/";
    const router = useRouter();
    const {
        data : dataClientes,
        loading : loadingDataClientes,
        error : errorDataClientes
    } = useFetch(URL_DATA_CLIENTES);

  return (
    <div className='p-6 h-screen overflow-y-auto'>
        <div className='space-y-6'>
            {
                loadingDataClientes ? 
                <TableroCarga
                    headers={headers}
                /> : 
                <TableMangeUser
                    title='Clientes'
                    handleAddDocument={()=>router.push("clientes/form-add")}
                    headers={headers}
                    data={dataClientes?.data}
                />
            }
        </div>
    </div>
  )
};

