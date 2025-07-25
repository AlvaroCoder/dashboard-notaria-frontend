'use client'
import React, { Suspense, useState } from 'react'
import Title1 from '../elements/Title1'
import { Button } from '../ui/button'
import { FilePlus2, LayoutGrid, List, Loader2 } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { camelCaseToTitle, cn } from '@/lib/utils'
import { statusContracts } from '@/lib/commonJSON'
import { formatearFecha } from '@/lib/fechas'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const TableCellClient = dynamic(()=>import('@/components/Tables/TableCells/TableCellClient'),{
    ssr : false,
    loading: () => <span><Loader2 className='animate-spin'/></span>,
});
const TableCellStatus = dynamic(()=>import('@/components/Tables/TableCells/TableCellStatus'),{
    ssr : false,
    loading : ()=><span><Loader2 className='animate-spin'/></span>
});

const ButtonDownloadPdf = dynamic(()=>import('@/components/elements/ButtonDownloadPdf'),{
    ssr : false,
    loading : ()=><span><Loader2 className='animate-spin'/></span>
});

export default function TableManageDocuments({
    title="Documentos",
    handleAddDocument=()=>{},
    data=[],
    headers=[]
}) {    
    const [vista, setVista] = useState("tabla");
  return (
    <section className='w-full rounded-sm shadow-sm bg-white p-4'>
        <div className='flex flex-row items-center justify-between'>
            <section>
                <Title1 className='text-xl'>
                    {title}
                </Title1>
                <p className='text-sm text-gray-600'>Gestión de {title}</p>
            </section>
            <div className='flex justify-end gap-2'>
                <Button
                    onClick={handleAddDocument}
                >
                    Agregar {title}
                    <FilePlus2 className='w-4 h-4 ml-2' />
                </Button>
                <Button
                    className={"text-[#0C1019] text-center"}
                    variant={vista === "tabla" ? "outline" : 'ghost'}
                    onClick={()=>setVista("tabla")}
                >
                    <List className='w-4 h-8 text-lg' />
                </Button>
                <Button
                    className={"text-[#0C1019]"}
                    variant={vista === "canvas" ? "outline" : "ghost"}
                    onClick={()=>setVista("canvas")}
                >
                    <LayoutGrid className="w-4 h-8 text-lg" />
                </Button>
            </div>
        </div>
        {
            vista === "tabla" && (
                <Suspense fallback={<Loader2 className='animate-spin' />}>
                <div className='overflow-auto mt-8'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {
                                    headers?.map((header, idx) => (
                                        <TableHead key={idx}>
                                            {header?.value}
                                        </TableHead>
                                    ))
                                }
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                data?.length > 0 ? (
                                    data?.map((documento, idx) => (
                                        <TableRow key={idx}>
                                            {
                                                headers?.map((header, idxHeader) =>{
                                                    if (Array.isArray(header.head)) {
                                                        return (
                                                            <TableCell key={idxHeader}>
                                                                {header.head.map((headItem, idxHeadItem) => (
                                                                    <span key={idxHeadItem}>{documento[headItem]}</span>
                                                                ))}
                                                            </TableCell>
                                                        )
                                                    }
                                                    else if (header?.isPdf) {
                                                        return (
                                                            <TableCell key={idxHeader}>
                                                                <ButtonDownloadPdf
                                                                
                                                                minutaDirectory={documento[header?.head]}
                                                                />
                                                            </TableCell>
                                                        )
                                                    }
                                                    else if (header?.head === 'clientId') {
                                                        return (
                                                            <TableCellClient
                                                                key={idxHeader}
                                                                clientId={documento[header?.head]}
                                                            />
                                                        )   
                                                    }   
                                                    else if (header?.head === 'status') {
                                                        return (
                                                            <TableCellStatus
                                                                key={idxHeader}
                                                                idStatus={documento[header?.head]}
                                                            />
                                                        )
                                                    }
                                                    else if(header?.head === 'datesDocument'){
                                                        return (
                                                            <TableCell
                                                                key={idxHeader}
                                                            >   
                                                                {formatearFecha(documento[header?.head]?.processInitiate)}
                                                            </TableCell>
                                                        )
                                                    }
                                                    else if(header?.head === 'contractType'){
                                                        return(
                                                            <TableCell
                                                                key={idxHeader}
                                                            >
                                                                <Link
                                                                    href={"/dashboard/contracts/inmueble/"+documento?.id}
                                                                    className='underline text-blue-700'
                                                                >
                                                                    <p className=''>{camelCaseToTitle(documento[header?.head]) || '-'}</p>
                                                                </Link>
                                                            </TableCell>
                                                        )
                                                    }
                                                    else{
                                                        return(
                                                            <TableCell key={idxHeader}>
                                                                {camelCaseToTitle(documento[header?.head]) || "-"}
                                                            </TableCell>
                                                        )
                                                    }
                                                })
                                            }
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow key={0}>
                                        <TableCell colSpan={headers.length} className='text-center h-48'>
                                            <Title1>
                                            No hay documentos disponibles
                                            </Title1>
                                        </TableCell>
                                    </TableRow>
                                )
                            }
                        </TableBody>
                    </Table>
                </div>
                </Suspense>
            )
        }
        {
            vista === "canvas" && (
                <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-8'>
                    {
                        data?.length > 0 ? (
                            data?.map((documento, idx) => (
                                <div key={idx} className='p-4 border rounded-md shadow-sm'>
                                    <Title1 className='font-semibold text-lg'>{camelCaseToTitle(documento?.contractType)}</Title1>
                                    {
                                        statusContracts?.filter(({id})=>id === documento?.status).map((item, key)=><p key={key} className={cn('px-2 py-1 w-fit rounded-sm text-sm', item.bgColor)}>{item.title}</p>)
                                    }
                                    <section className='mt-2 py-2'>
                                        <p className='text-sm'>Pago : {documento?.processPayment}</p>
                                        <p className='text-sm'>Tipo :<b> {documento?.case}</b></p>
                                        <p className='text-sm'>Fecha : <b>{formatearFecha(documento?.datesDocument?.processInitiate)}</b></p>
                                        
                                    </section>
                                </div>
                            ))
                        ) : (
                            <div className='col-span-4 flex flex-col items-center justify-center h-48 border-3 border-gray-400 border-dotted rounded-sm'>
                                <Title1>
                                    No hay documentos disponibles
                                </Title1>
                                <p className='text-sm text-gray-600'>No se han subido documentos</p>
                            </div>
                        )
                    }
                </div>
            )
        }
    </section>
  )
};
