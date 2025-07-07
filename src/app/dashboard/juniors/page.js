'use client'
import Title1 from '@/components/elements/Title1';
import TableroCarga from '@/components/Loading/TableroCarga';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LayoutGrid, Table2 } from 'lucide-react';
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MoreVert } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const headers=[
    {value : "Nombre"},
    {value : "Usuario"},
    {value : "DNI"},
    {value : "Email"},
    {value : "Telefono"},
    {value : "Dirección"},
    {value : <ModeEditIcon/>}
]

function JuniorsTablero({
    data=[]
}) {
    const [viewType, setViewType] = useState("table");
    const handleEditBlock=(idBlock)=>{

    }
    const handleDeleteBlock=(idBlock)=>{
        
    }
    const handlerViewType=()=>{
        switch (viewType) {
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
                                    data?.map((junior)=>(
                                        <TableRow key={junior?.id}>
                                            <TableCell>
                                                <span>{junior?.firstName} {junior?.lastName}</span>
                                            </TableCell>
                                            <TableCell>
                                                {junior?.userName}
                                            </TableCell>
                                            <TableCell>
                                                {junior?.dni}
                                            </TableCell>
                                            <TableCell>
                                                {junior?.email}
                                            </TableCell>
                                            <TableCell>
                                                {junior?.phone}
                                            </TableCell>
                                            <TableCell>
                                                {junior?.address?.name}
                                            </TableCell>
                                            <TableCell>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button variant={"outline"}>
                                                            <MoreVert/>
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className={"w-fit p-2"}>
                                                        <div className='flex flex-col gap-2 w-fit'>
                                                            <Button
                                                                
                                                                variant={"ghost"}
                                                            >
                                                                <EditIcon/> Editar
                                                            </Button>
                                                            <Button
                                                                onClick={()=>handleDeleteBlock(junior?.id)}
                                                            >
                                                                <DeleteIcon/> Eliminar
                                                            </Button>
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>                        
                    </div>
                )
                
        
            default:
                return (
                    <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
                        {
                            data?.map((junior)=>(
                                <Card key={junior?.id}>
                                    <CardContent className={"flex flex-col items-center text-center space-y-2"}>
                                        <div className='font-semibold font-oxford text-2xl'>
                                            <span>{junior?.firstName} {junior?.lastName}</span>
                                        </div>
                                        <div className='text-sm text-gray-500'>
                                            {junior?.userName}
                                        </div>
                                        <div className='text-sm text-gray-500'>
                                            {junior?.dni}
                                        </div>
                                        <div className='text-sm text-gray-500'>
                                            {junior?.email}
                                        </div>
                                        <div className='text-sm text-gray-500'>
                                            {junior?.phone}
                                        </div>
                                        <div className='text-sm text-gray-500'>
                                            {junior?.address?.name}
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
                    variant={viewType === "Card" ? "default" : "outline"}
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
    const [dataJuniors, setDataJuniors] = useState([]);
    useEffect(()=>{
        async function fetchDataJuniors() {
            try {
                setLoading(true);
                const responseJunior = await fetch('http://localhost:8000/home/junior')
                const jsonReponseJunior = await responseJunior.json();
                setDataJuniors(jsonReponseJunior?.data);
            
            } catch (err) {
                
            } finally {
                setLoading(false);
            }
        }
        fetchDataJuniors();
    },[]);
  return (
    <div className='p-6'>
        <section className='mb-6'>
            <Title1 className='text-2xl'>
                Gestión de juniors
            </Title1>
            <p className='text-gray-600'>Administra los juniors de forma rapida</p>
        </section>
        <section
            className='flex flex-col md:flex-row md:items-center md:justify-center gap-4 mb-6`'
        >
            <Input
                className={"w-full"}
                placeholder="Buscar por usuario, nombre o correo ..."
            />
            <Button
                className={"w-full md:w-auto"}
                onClick={()=>router.push("juniors/form-add")}
            >
                Agregar Nuevo Junior
            </Button>
        </section>
        <div className='space-y-4 mt-4'>
            {
                loading?
                <TableroCarga
                    headers={headers}
                /> :
                <JuniorsTablero 
                    data={dataJuniors} 
                />
            }
        </div>
    </div>
  )
}