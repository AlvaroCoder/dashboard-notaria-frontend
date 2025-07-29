'use client'
import dynamic from 'next/dynamic';

const TableroCarga = dynamic(()=>import('@/components/Loading/TableroCarga'))
const TableMangeUser = dynamic(()=>import('@/components/Tables/TableManageUser'))
import { useFetch } from '@/hooks/useFetch'
import { useRouter } from 'next/navigation'
import React from 'react';

export default function Page() {
    const headers = [
        {value : "Nombre", head : ["firstName", "lastName"]},
        {value : "Usuario", head : "userName"},
        {value : "Email", head : "email"},
        {value : "Telefono", head : "phone"},
        {value : "Direccion", head : 'address'}
    ];

    const URL_DATA_CLIENTES = process.env.NEXT_PUBLIC_URL_HOME+"/client/";
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

