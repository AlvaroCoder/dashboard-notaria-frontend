'use client'
import Title1 from '@/components/elements/Title1'
import React, { useEffect, useState } from 'react'
import DescriptionIcon from '@mui/icons-material/Description';
import { LayoutGrid, List, ShieldUser, User } from 'lucide-react';
import Person4Icon from '@mui/icons-material/Person4';
import CardIndicator from '@/components/elements/CardIndicator';
import CardIndicatorLoading from '@/components/elements/CardIndicatorLoading';
import { Input } from '@/components/ui/input';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@mui/material';
import Separator from '@/components/elements/Separator';
import { toast } from 'react-toastify';

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [queryCliente, setQueryCliente] = useState('');
  const [vista, setVista] = useState("tabla");
  const [dataDocumentos, setdataDocumentos] = useState([]);
  const [indicadoresGeneral, setIndicadoresGeneral] = useState([]);

  useEffect(()=>{
    async function getData() {
        try {
            setLoading(true);
            const responseSenior = await fetch('http://localhost:8000/home/senior');
            const jsonResponseSenior = await responseSenior.json();

            const responseJunior = await fetch('http://localhost:8000/home/junior');
            const jsonResponseJunior = await responseJunior.json();

            const responseClient = await fetch('http://localhost:8000/home/client');
            const jsonResponseClient = await responseClient.json();
            
            const nuevaLista = [
              {id : 1, title : 'Clientes', value : jsonResponseClient?.data?.length, icon : Person4Icon},
              {id : 2, title : 'Juniors', value : jsonResponseJunior?.data?.length, icon : User},
              {id : 3, title : 'Seniors', value : jsonResponseSenior?.data?.length, icon : ShieldUser},

            ];
            toast("Data enviada correctamente",{
              type : 'success',
              position : 'top-right'
            });
            setIndicadoresGeneral(nuevaLista);

        } catch (err) {
          toast("Error",{
            type : 'error'
          });

        } finally {
          setLoading(false)
        }
        
    }
    getData();
  },[]);

  return (
    <main className='w-full min-h-screen p-8'>
      <Title1 className='text-3xl '>
        Indicadores
      </Title1>
      <section className='w-full my-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3'>
        {
          loading ? 
          Array.from(['a','b','c','d']).map((_, key)=><CardIndicatorLoading key={key} />) : 
          indicadoresGeneral?.map((item, key)=><CardIndicator key={key} indicator={item} />)
        }
      </section>
      
      <section className='w-full rounded-sm shadow-sm bg-white p-4'>
        <div className='flex flex-row items-center justify-between'>
          <Title1 className='text-2xl'>
            Documentos documentos en proceso
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
              {
                dataDocumentos?.length > 0 ?
                dataDocumentos?.map((item, idx)=>(
                  <section key={idx}>
                    <h1>{item?.title}</h1>
                  </section>
                )):
                <section className='col-span-4 flex justify-center items-center border-3 border-gray-400  border-dotted rounded-sm h-[400px]'>
                  <Title1>No hay documento en proceso</Title1>
                </section>
              }
            </div>
          )
        }
      </section>
    </main>
  )
};