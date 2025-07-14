'use client'
import Title1 from '@/components/elements/Title1'
import TableroCarga from '@/components/Loading/TableroCarga'
import TableManageDocuments from '@/components/Tables/TableManageDocuments'
import { useFetch } from '@/hooks/useFetch'
import { useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react';

const headers = [
    {value : "Nombre", head : ["firstName", "lastName"]},
    {value : "Usuario", head : "userName"},
    {value : "Email", head : "email"},
    {value : "Telefono", head : "phone"},
    {value : "Direccion"}
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
    <div className='p-6'>
        <div className='space-y-6'>
            {
                loadingDataClientes ? 
                <TableroCarga
                    headers={headers}
                /> : 
                <TableManageDocuments
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

