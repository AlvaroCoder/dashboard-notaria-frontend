'use client'

import Title1 from '@/components/elements/Title1';
import TableroCarga from '@/components/Loading/TableroCarga';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useContextCard } from '@/context/ContextCard';
import { useFetch } from '@/hooks/useFetch';
import { Divider, Step, StepLabel, Stepper, TextField } from '@mui/material';
import React, {  useMemo, useState } from 'react'
import { toast } from 'react-toastify';
import CreateIcon from '@mui/icons-material/Create';
import { useRouter } from 'next/navigation';
import CardRequirements from '@/components/Cards/CardRequirements';
import FormUploadMinuta from '@/components/Forms/FormUploadMinuta';
import FormStepper from '@/components/Forms/FormStepper';
import { useContratoContext } from '@/context/ContratosContext';


const formsInmueble = [
    {
        nombre : "Compra de Inmuebles", 
        slug : 'compra',
        descripcion : "Formulario para iniciar un proceso de compra de inmuebles", 
        requisitos :[
            "Requisito 1",
            "Requisito 2",
            "Requisito 3",
            "Requisito 4"
        ]
    },
    {
        nombre : "Venta de Inmuebles",
        slug : 'venta',
        descripcion : "Esto es una descripcion para los procesos de venta",
        requisitos : [
            "Requisitos 1",
            "Requisitos 2",
            "Requisito 3"
        ]
    }
];

function RenderCardsFormStepper() {
    const {initializeClient, activeStep} = useContextCard();
    const {handleChangeDataPreMinuta} = useContratoContext();
    const [queryInput, setQueryInput] = useState('');
    const router = useRouter();
    const {
        data : dataClientes, 
        loading : loadingDataClientes, 
        error : errorDataClientes
    } = useFetch('http://localhost:8000/home/client');
    const currentData = useMemo(()=>{
        return dataClientes?.data?.filter((item)=>item?.firstName?.toUpperCase().includes(queryInput.toUpperCase()))
    },[queryInput, dataClientes]);
    
    const crearCliente =()=>router.push('/dashboard/clientes/form-add');

    switch(activeStep) {
        case 0:
            return (
                <div>
                    <section>
                        <Title1 className='text-3xl font-bold'>Selecciona un cliente </Title1>
                        <p className='text-gray-500 text-sm'>Selecciona un cliente para continuar</p>
                    </section>
                    <section className='bg-white p-4 rounded-sm shadow-sm mt-4'>
                        <div className='flex flex-row gap-4 items-center justify-between mb-4'>
                            <Input
                                className={"w-full"}
                                placeholder="Buscar cliente por nombre, correo, DNI..."
                                onChange={(e)=>setQueryInput(e.target.value)}
                            />
                            <Button
                                onClick={crearCliente}
                            >
                                Agregar nuevo cliente
                            </Button> 
                        </div>                  
                        <div className='space-y-6'>
                        {
                            loadingDataClientes ?
                            <TableroCarga
                                headers={['Nombre', 'Apellido', 'DNI', 'Correo']}
                            /> : 
                            <section>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>
                                                Nombre
                                            </TableHead>
                                            <TableHead>
                                                Usuario
                                            </TableHead>
                                            <TableHead>
                                                <CreateIcon/>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody >
                                       {
                                            currentData?.length > 0 ? (
                                                currentData?.map((cliente, idx)=>(
                                                    <TableRow 
                                                        key={idx} className='cursor-pointer hover:bg-gray-100'>
                                                        <TableCell>
                                                            {cliente?.firstName} {cliente?.lastName}
                                                        </TableCell>
                                                        <TableCell>
                                                            {cliente?.userName}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button 
                                                                onClick={()=>{
                                                                    handleChangeDataPreMinuta('clientId', cliente?.id);
                                                                    initializeClient(cliente);
                                                                    toast("Cliente seleccionado",{ type : 'success'});
                                                                }}
                                                                variant={"ghost"}
                                                                className={"border-gray-700 border hover:bg-gray-200"}>
                                                                Seleccionar
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow key={0} >
                                                    <TableCell colSpan={3} className='text-center h-32 text-gray-500'>
                                                        <p> No se encontraron clientes</p>
                                                        <Button
                                                            onClick={crearCliente}
                                                        >
                                                            Crear nuevo cliente
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                       }
                                    </TableBody>
                                </Table>
                            </section>
                        }
                        </div>

                    </section>

                </div>
            )
        case 1:
            return(
                <div className='w-full'>
                <section className='flex flex-col items-center mb-4'>
                    <Title1 className='text-4xl font-bold'>Formularios de inmuebles</Title1>
                    <p className='text-sm text-gray-400'>Selecciona un proceso a realizar para el contrato de inmuebles</p>
                </section>
                <Divider/>
                <section className='flex flex-row items-start justify-center gap-4 mt-5'>
                    {
                        formsInmueble?.map((item, idx)=><CardRequirements key={idx} {...item} />)
                    }
                </section>
            </div>
            )
        case 2:
            return (<FormUploadMinuta/>);
        case 3 :
            return (<FormStepper/>)
    }
}

export default function Page() {

    return (
        <section className='w-full min-h-screen pb-24 grid grid-cols-1 p-8 gap-2'>
            <RenderCardsFormStepper/>
        </section>
  )
};
