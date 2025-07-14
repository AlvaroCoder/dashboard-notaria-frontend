'use client'
import React, { useState } from 'react'
import Title1 from '../elements/Title1'
import { Button } from '../ui/button'
import { FilePlus2, LayoutGrid, List } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import ButtonDownloadPdf from '../elements/ButtonDownloadPdf'

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
                                                    if (header?.isPdf) {
                                                        return (
                                                            <TableCell>
                                                                <ButtonDownloadPdf
                                                                key={idx}
                                                                minutaDirectory={documento[header?.head]}
                                                                />
                                                            </TableCell>
                                                        )
                                                    }
                                                    return(
                                                        <TableCell key={idxHeader}>
                                                            {documento[header?.head] || "-"}
                                                        </TableCell>
                                                    )
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
            )
        }
        {
            vista === "canvas" && (
                <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-8'>
                    {
                        data?.length > 0 ? (
                            data?.map((documento, idx) => (
                                <div key={idx} className='p-4 border rounded-md shadow-sm'>
                                    <Title1 className='font-semibold text-lg'>{documento.title}</Title1>
                                    <p className='text-sm text-gray-500'>{documento.description || "No description available"}</p>
                                    <p className='text-sm text-gray-500'>Created at: {new Date(documento.createdAt).toLocaleDateString()}</p>
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
