'use client'
import Title1 from '@/components/elements/Title1'
import TableroCarga from '@/components/Loading/TableroCarga'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { LayoutGrid, Table2 } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react';

const headers = [
    {value : "Nombre"},
    {value : "Usuario"},
    {value : "Email"},
    {value : "Telefono"},
    {value : "Direccion"}
];

function ClienteTablero({
    data=[]
}) {
    const [viewType, setViewType] = useState("table");
    const handlerViewType=()=>{
        switch(viewType){
            case "table":
                return(
                    <div className='overflow-x-auto rounded-sm border border-gray-200'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {
                                        headers?.map((item, idx)=>
                                        <TableHead
                                            key={idx}
                                        >
                                            {item?.value}
                                        </TableHead>)
                                    }
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    data?.map((cliente)=>(
                                        <TableRow key={cliente.id}>
                                            <TableCell>
                                                <span>{cliente?.firstName} {cliente?.lastName}</span>
                                            </TableCell>
                                            <TableCell>
                                                {cliente?.userName}
                                            </TableCell>
                                            <TableCell>
                                                {cliente?.email}
                                            </TableCell>
                                            <TableCell>
                                                {cliente?.phone}
                                            </TableCell>
                                            <TableCell>
                                                direccion
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </div>
                )
            case "card":
                return(
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {
                            data?.map((cliente)=>(
                                <Card key={cliente.id}>
                                    <CardContent className={"flex flex-col items-center text-center space-y-2"}>
                                        <div className='font-semibold text-lg'>
                                            {cliente?.firstName} {cliente?.lastName}
                                        </div>
                                        <div className='text-sm text-gray-500'>
                                            {cliente?.username}
                                        </div>
                                        <div className='text-sm text-gray-500'>
                                            {cliente?.email}
                                        </div>
                                        <div className='text-sm text-gray-500'>
                                            {cliente?.phone}
                                        </div>
                                        <div className='text-sm text-gray-500'>
                                            direccion
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        }
                    </div>
                )
        }
    }
    return(
        <div className='space-y-4'>
            <div className='flex justify-end gap-2'>
                <Button
                    variant={viewType === "table" ? "default" : "outline"}
                    onClick={()=>setViewType("table")}
                >
                    <Table2/>
                </Button>
                <Button
                    variant={viewType === "card" ? "default" : "outline"}
                    onClick={()=>setViewType("card")}
                >
                    <LayoutGrid/>
                </Button>
            </div>
            {handlerViewType()}
        </div>
    )
}



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
    },[queryInput])
  return (
    <div className='p-6'>
        <section
            className='mb-6'
        >
            <Title1 className='text-2xl'>Gestión de clientes</Title1>
            <p className='text-gray-600'>Administra los clientes de forma eficiente</p>
        </section>

        <section
            className='flex flex-col md:flex-row md:items-center md:justify-center gap-4 mb-6' 
        >   
            <Input
                className={"w-full"}
                placeholder="Buscar usuario por nombre, correo ..."
                onChange={(evt)=>setQueryInput(evt.target.value)}
            />
            <Button
                className={"w-full md:w-auto"}
                onClick={()=>router.push("clientes/form-add")}
            >
                Agregar nuevo cliente
            </Button>
        </section>
        <div className='space-y-6'>
            {
                loading ? 
                <TableroCarga
                    headers={headers}
                /> : 
                <ClienteTablero
                    data={currentData}
                />
            }
        </div>
    </div>
  )
};

