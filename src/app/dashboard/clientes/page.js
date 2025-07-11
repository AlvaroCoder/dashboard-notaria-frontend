'use client'
import Title1 from '@/components/elements/Title1'
import TableroCarga from '@/components/Loading/TableroCarga'
import TableManageDocuments from '@/components/Tables/TableManageDocuments'
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
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [dataClientes, setDataClientes] = useState([]);
    const [queryInput, setQueryInput] = useState("");

    useEffect(()=>{
        async function fetchDataCliente() {
            try {
                setLoading(true);
                const responseClient = await fetch('http://localhost:8000/home/client');
                const jsonResponseClient = await responseClient.json();
                setDataClientes(jsonResponseClient?.data);
            } catch (err) {
                
            } finally{
                setLoading(false);
            }
        }  
        fetchDataCliente();
    },[]);
    const currentData = useMemo(()=>{
        return dataClientes.filter((item)=>item?.firstName?.toUpperCase().includes(queryInput.toUpperCase()) || item?.lastName?.toUpperCase().includes(queryInput.toUpperCase()))
    },[queryInput, dataClientes])
  return (
    <div className='p-6'>
        <section
            className='mb-6'
        >
            <Title1 className='text-2xl'>Gestión de clientes</Title1>
            <p className='text-gray-600'>Administra los clientes de forma eficiente</p>
        </section>

        <div className='space-y-6'>
            {
                loading ? 
                <TableroCarga
                    headers={headers}
                /> : 
                <TableManageDocuments
                    title='Tabla de clientes'
                    
                    handleAddDocument={()=>router.push("clientes/form-add")}
                    headers={headers}
                    data={currentData}
                />
            }
        </div>
    </div>
  )
};

