'use client'

import Title1 from '@/components/elements/Title1'
import TableroCarga from '@/components/Loading/TableroCarga';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LayoutGrid, Table2 } from 'lucide-react';
import { useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'

const headers = [
  {value : "Nombre", head : ['firstName', 'lastName']},
  {value : "DNI", head : 'dni'},
  {value : "RUC", head : 'ruc'},
  {value : "Usuario", head : 'userName'},  
  {value : "Email", head : 'email'},
  {value : "Telefono", head : 'phone'},
  {value : "Direccion", head : ''}
];

function SeniorsTablero({
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
                  data?.map((senior)=>(
                    <TableRow key={senior?.id}>
                      <TableCell>
                        <span>{senior?.firstName} {senior?.lastName}</span>
                      </TableCell>
                      <TableCell>
                        {senior?.dni}
                      </TableCell>
                      <TableCell>
                        {senior?.ruc}
                      </TableCell>
                      <TableCell>
                        {senior?.userName}
                      </TableCell>

                      <TableCell>
                        {senior?.email}
                      </TableCell>
                      <TableCell>
                        {senior?.phone}
                      </TableCell>
                      <TableCell>
                        {senior?.address?.name}
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
          <div className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
            {
              data?.map((senior)=>(
                <Card key={senior?.id}>
                  <CardContent className={"flex flex-col items-center text-center space-y-2"}>
                    <div className='font-semibold font-oxford text-2xl'>
                      <span>{senior?.firstName} {senior?.lastName}</span>
                    </div>
                    <div className='text-sm text-gray-500'>
                      {senior?.dni}
                    </div>
                    <div className='text-sm text-gray-500'>
                      {senior?.ruc}
                    </div>
                    <div className='text-sm text-gray-500'>
                      {senior?.userName}
                    </div>
                    <div className='text-sm text-gray-500'>
                      {senior?.email}
                    </div>
                    <div className='text-sm text-gray-500'>
                      {senior?.phone}
                    </div>
                    <div className='text-sm text-gray-500'>
                      {senior?.address?.name}
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
  const [dataSeniors, setDataSeniors] = useState([]);
  const [queryInput, setQueryInput] = useState("");

  useEffect(()=>{
    async function fetchDatSeniors() {
      try {
        setLoading(true);
        const responseSenior = await fetch('http://localhost:8000/home/senior');
        const jsonResponseSenior = await responseSenior.json();
        setDataSeniors(jsonResponseSenior?.data);
        
      } catch (err) {
        
      } finally{
        setLoading(false);
      }
    }
    fetchDatSeniors();
  },[]);
  const currentData = useMemo(()=>{
    return dataSeniors.filter((item)=>item?.firstName?.toUpperCase().includes(queryInput.toUpperCase()) || item?.lastName?.toUpperCase().includes(queryInput.toUpperCase()))
  }, [queryInput, dataSeniors])
  return (
    <div className='p-6'>
      <section className='mb-6'>
        <Title1 className='text-2xl'>
          Gestión de Seniors  
        </Title1>
        <p className='text-gray-600'>Adminsitra los seniors de forma eficiente</p>
      </section>
      <section
        className='flex flex-col md:flex-row md:items-center md:justify-center gap-4 mb-6'
      >
        <Input
          className={"w-full"}
          placeholder="Buscar por usuario o nombre"
          onChange={(evt)=>setQueryInput(evt.target.value)}
        />
        <Button
          onClick={()=>router.push("seniors/form-add")}
          className={"w-full md:w-auto"}
        >
          Agregar Nuevo Senior
        </Button>
      </section>
      <div className='space-y-4'>
        {
          loading?
          <TableroCarga
            headers={headers}
          />:
          <SeniorsTablero data={currentData} />
        }
      </div>
    </div>
  )
};
