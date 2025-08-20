'use client';
import React, { useMemo, useState } from 'react'
import Title1 from '../elements/Title1'
import { Input } from '../ui/input'
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import CreateIcon from '@mui/icons-material/Create';

export default function TableSelectedUser({
    title="Selecciona un usuario",
    descripcion='',
    slugCrear,
    headers=[],
    data=[],
    handleClickSelect,
    showAddButton=true
}) {
    const router = useRouter();
    const [queryInput, setQueryInput] = useState('');
    const crearUsuario = ()=>router.push(slugCrear);

    const currentData = useMemo(()=>{
        return data?.filter((item)=>
            item?.firstName?.toUpperCase().includes(queryInput?.toUpperCase()) ||
            item?.userName?.toUpperCase().includes(queryInput?.toUpperCase())
        );
    },[data, queryInput]);

  return (
    <div >
        <section>
            <Title1 className='text-3xl font-bold'>{title}</Title1>
            <p className='text-gray-500 text-sm'>{descripcion}</p>
        </section>
        <section className='bg-white p-4 rounded-sm shadow-sm mt-4'>
            {
                showAddButton && (
                    <div className='flex flex-row gap-4 items-center justify-between mb-4'>
                        <Input
                            className={"w-full"}
                            placeholder = "Buscar por nombre, o apellido ..."
                            onChange={(e)=>setQueryInput(e.target.value)}
                        />
                        <Button
                            onClick={crearUsuario}
                        >
                            Agregar nuevo cliente
                        </Button>
                    </div>
                )
            }
            <div className='space-y-6'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            {
                                headers?.map((item, idx)=>
                                <TableHead key={idx}>
                                    {item?.value}
                                </TableHead>)
                            }
                            <TableHead>
                                <CreateIcon/>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            currentData?.length > 0 ?
                            (
                                currentData?.map((user, idx)=>(
                                    <TableRow key={idx}>
                                        {
                                            headers?.map((head, indexHead)=>{
                                                if (Array.isArray(head?.head)) {
                                                    return(
                                                        <TableCell key={indexHead}>
                                                            {
                                                                head?.head?.map((headItem, idxHead)=>(
                                                                    <span key={idxHead}>{user[headItem]}</span>
                                                                ))
                                                            }
                                                        </TableCell>
                                                    )
                                                }
                                                return (
                                                    <TableCell key={indexHead}>
                                                        {user[head?.head] || '-'}
                                                    </TableCell>
                                                )
                                            })
                                        }
                                        <TableCell>
                                            <Button
                                                onClick={()=>{
                                                    handleClickSelect(user);
                                                }}
                                            >
                                                Seleccionar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ):
                            (
                                <TableRow key={0}>
                                    <TableCell 
                                    colSpan={headers?.length} 
                                    className='text-center h-32 text-gray-500'>
                                    
                                        <p>No se encontro informacion</p>
                                    </TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </div>
        </section>
    </div>
  )
}
