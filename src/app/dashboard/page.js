'use client'
import Title1 from '@/components/elements/Title1'
import React, { useState } from 'react'
import DescriptionIcon from '@mui/icons-material/Description';
import { LayoutGrid, List, ShieldUser, User } from 'lucide-react';
import Person4Icon from '@mui/icons-material/Person4';
import CardIndicator from '@/components/elements/CardIndicator';
import CardIndicatorLoading from '@/components/elements/CardIndicatorLoading';
import { Input } from '@/components/ui/input';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@mui/material';
import { cn } from '@/lib/utils';

const estadosContrato = [
  {title : "PROCESO INICIADO", bgColor : "bg-green-50"},
  {title : "EN REVISIÓN", bgColor : "bg-amber-100"},
  {title : "OBSERVADO", bgColor : "bg-slate-100"},
  {title : "PENDIENTE DE FIRMA", bgColor : "bg-blue-200 "},
  {title : "FIRMADO", bgColor : "bg-amber-200"},
  {title : "PENDIENTE DE RESPUESTA DEL SID", bgColor : "bg-gray-50"},
  {title : "TACHADO", bgColor : "bg-red-100"},
  {title : "INSCRITO", bgColor : "bg-green-100"},
];

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [queryCliente, setQueryCliente] = useState('');
  const [vista, setVista] = useState("tabla");
  const [dataDocumentos, setdataDocumentos] = useState([]);

  const indicatorsGeneral=[
    {id:1, title : 'Contratos', value : 200, icon : DescriptionIcon},
    {id:2, title : 'Clientes', value : 20, icon : Person4Icon},
    {id:3, title : 'Juniors', value : 120, icon : User},
    {id:4, title : 'Seniors', value : 60, icon : ShieldUser}
  ];


  return (
    <main className='w-full min-h-screen p-8'>
      <Title1 className='text-3xl '>
        Indicadores
      </Title1>
      <section className='w-full my-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3'>
        {
          loading ? 
          Array.from(['a','b','c','d']).map((item, key)=><CardIndicatorLoading key={key} indicator={item}/>) : 
          indicatorsGeneral?.map((item, key)=><CardIndicator key={key} indicator={item} />)
        }
      </section>
      <section className='w-full rounded-sm shadow-sm bg-white p-4'>
        <div className='flex flex-row items-center justify-between'>
          <Title1 className='text-2xl'>
            Documentos en proceso
          </Title1>
          <Input
            className={"flex-1 mx-8 rounded-sm outline-none focus:outline-none"}
            placeholder="Buscar nombre de cliente ..."
          />
          <div className="flex justify-end gap-2">
            <Button
              className='text-[#0C1019] text-center'
              variant={vista === "tabla" ? "outline" : 'ghost'}
              onClick={() => setVista("tabla")}
            >
              <List className="w-4 h-8 text-lg" /> 
            </Button>
            <Button
              className='text-[#0C1019]'
              variant={vista === "canvas" ? "outline" : "ghost"}
              onClick={() => setVista("canvas")}
            >
              <LayoutGrid className="w-4 h-8 text-lg" /> 
            </Button>
          </div>
        </div>
        {
          vista === "tabla" && (
            <div className="overflow-auto mt-8">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Tipo de Contrato</TableHead>
                    <TableHead>Tipo de Bien</TableHead>
                    <TableHead>Compradores</TableHead>
                    <TableHead>Vendedores</TableHead>
                    <TableHead>Minuta</TableHead>
                    <TableHead>Tipo de Pago</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    loading ? 
                    Array.from(["","","",""]).map((_, key)=>
                    <TableRow key={key}>
                      <TableCell><Skeleton variant='rounded'/></TableCell>
                      <TableCell><Skeleton variant='rounded'/></TableCell>
                      <TableCell><Skeleton variant='rounded'/></TableCell>
                      <TableCell><Skeleton variant='rounded'/></TableCell>
                      <TableCell><Skeleton variant='rounded'/></TableCell>
                      <TableCell><Skeleton variant='rounded'/></TableCell>
                      <TableCell><Skeleton variant='rounded'/></TableCell>
                      <TableCell><Skeleton variant='rounded'/></TableCell>
                    </TableRow> 
                    ):
                    dataDocumentos > 0 ? 
                    dataDocumentos?.map((item, idx)=>
                      <TableRow key={idx}>
                        <TableCell><h1>Columna</h1></TableCell>
                        <TableCell><h1>Columna</h1></TableCell>
                        <TableCell><h1>Columna</h1></TableCell>
                        <TableCell><h1>Columna</h1></TableCell>
                        <TableCell><h1>Columna</h1></TableCell>
                        <TableCell><h1>Columna</h1></TableCell>
                        <TableCell><h1>Columna</h1></TableCell>
                        <TableCell><h1>Columna</h1></TableCell>
                      </TableRow>
                    ) :
                    <TableRow >
                      <TableCell className={"text-center h-48"} colSpan={8}><Title1>No hay documentos</Title1></TableCell>
                    </TableRow>
                  }
                </TableBody>
              </Table>
            </div>
          )
        }
        {
          vista === "canvas" && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
              {estadosContrato?.map((estado, idx)=>(
                <div key={idx}>
                  <h3 className={cn('text-sm p-2 rounded-lg', estado.bgColor)}>{estado?.title}</h3>
                  <section className='space-y-2'>
                    
                  </section>
                </div>
              ))}
            </div>
          )
        }
      </section>
    </main>
  )
};