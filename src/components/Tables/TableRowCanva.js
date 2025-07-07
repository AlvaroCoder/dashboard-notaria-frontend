'use client';

import React, { useState } from 'react'
import Title1 from '../elements/Title1';
import { Button } from '../ui/button';
import { LayoutGrid, List } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Card, CardContent } from '../ui/card';

/**
 * 
 * [
 *  ["firstName","lastName"],
 *  "userName"
 * 
 * ]
 */

export default function TableRowCanva({
    title='Titulo',
    description='Descripcion breve de la tabla',
    data=[],
    headers=[],
    columnsKeys=[],
    handleAdd
}) {
    const [viewType, setViewType] = useState('table');
    const handlerViewType=()=>{
        switch (viewType) {
            case 'table':
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
                                    data?.map((row)=>(
                                        <TableRow key={row?.id}>
                                            {
                                                columnsKeys?.map((colKey, indexHead)=>{
                                                    let cellValue = ''
                                                    if (Array.isArray(colKey)) {
                                                        cellValue = colKey?.map((keyVal)=>row[keyVal]).join(' ');
                                                    } else{
                                                        cellValue = row[colKey];
                                                    }
                                                    return (<TableCell key={indexHead}>{cellValue}</TableCell>)
                                                })
                                            }
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </div>
                )
        
            case 'canvas':
                return (
                    <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
                        {
                            data?.map((row)=>
                                <Card key={row?.id}>
                                    <CardContent
                                        className={'flex flex-col items-center space-y-2'}
                                    >   
                                        
                                    </CardContent>
                                </Card>
                            )
                        }
                    </div>
                )
        }
    }
  return (
    <main className='w-full rounded-sm shadow bg-white p-4'>
        <section className='flex flex-row items-center justify-between'>
            <div>
                <Title1 className='text-2xl'>{title}</Title1>
                <p>{description}</p>
            </div>
            <div className='flex justify-end gap-2'>
                <Button
                    className='text-[#0C1019] text-center'
                    variant={viewType === "table" ? "outline" : 'ghost'}
                    onClick={()=>setViewType('table')}
                >
                    <List className='w-4 h-8 text-lg'/>
                </Button>
                <Button
                    className={'text-[#0C1019]'}
                    variant={viewType === 'canvas' ? 'outline' : 'ghost'}
                    onClick={()=>setViewType('canvas')}
                >
                    <LayoutGrid className='w-4 h-8 text-lg' />
                </Button>
            </div>
        </section>

    </main>
  )
}
