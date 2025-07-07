'use client';
import CardIndicator from '@/components/elements/CardIndicator'
import CardIndicatorLoading from '@/components/elements/CardIndicatorLoading'
import Separator from '@/components/elements/Separator';
import Title1 from '@/components/elements/Title1'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Building2, Car, FilePlus2, LayoutGrid, List, Plus, Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

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
  const URL_TIPO_CONTRATOS = "";

  const [loading, setLoading] = useState(false);
  const [vista, setVista] = useState("tabla");
  const [dataDocumentos, setDataDocumentos] = useState([]);
  const [dataInmuebles, setDataInmuebles] = useState([]);
  const [dataVehiculos, setDataVehiculos] = useState([]);
  const [indicators, setIndicators] = useState([]);

  useEffect(() => {
    async function getData() {
      try {
        setLoading(true);
        const responseInmuebles = await fetch('http://localhost:8000/home/contracts/propertyCompraVenta');
        const jsonResponseImuebles = await responseInmuebles.json();
        const dInmuebles = typeof(jsonResponseImuebles?.data) === 'string' ? [] : jsonResponseImuebles?.data;
        setDataInmuebles(dInmuebles);

        const responseVehiculos = await fetch('http://localhost:8000/home/contracts/vehicleCompraVenta');
        const jsonResponseVehiculos = await responseVehiculos.json();
        const dVehiculos = typeof(jsonResponseVehiculos?.data) === 'string' ? [] : jsonResponseVehiculos?.data;
        setDataVehiculos(dVehiculos);


        setIndicators([
          {id : 1, title : 'Inmuebles', value : dInmuebles?.length, icon : Building2},
          {id : 2, title : 'Vehiculos', value : dVehiculos?.length, icon : Car}
        ]);
        toast("Data exitosa",{
          type : 'success'
        })
      } catch (error) {
        console.log(error);
        toast("Ocurrio un error ",{
          type : 'error'
        });
      } finally{
        setLoading(false);
      }
    }
    getData();
  }, [])
  
  return (
    <div className="p-6 space-y-6">
      <div>
        <Title1 className='text-4xl'>Gestión de Contratos</Title1>
        <p className="text-gray-600">Gestión de los contratos subidos por los clientes.</p>
      </div>
      <Title1>Indicadores</Title1>
      <section className='w-full my-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3'>
        {
          loading ? 
          Array.from({length : 4},(_, idx)=><CardIndicatorLoading key={idx} />) : 
          indicators?.map((item, key)=><CardIndicator key={key} indicator={item} />)
        }
      </section>
      <Separator/>
      <section className='w-full rounded-sm shadow-sm bg-white p-4'>
        <div className='flex flex-row items-center justify-between'>
          <Title1 className='text-2xl'>
            Documentos
          </Title1>
          <div className='flex justify-end gap-2'>
            <Button
              className='text-[#0C1019] text-center'
              variant={vista === "tabla" ? "outline" : 'ghost'}
              onClick={() => setVista("tabla")}
            >
              <List className='w-4 h-8 text-lg'/>
            </Button>
            <Button
              className='text-[#0C1019]'
              variant={vista === "canvas" ? "outline" : "ghost"}
              onClick={() => setVista("canvas")}
            >
              <LayoutGrid className="w-4 h-8 text-lg"/>
            </Button>
          </div>
        </div>
        {
          vista === "tabla" && (
            <div className='overflow-auto mt-8'>
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
                    Array.from([1,2,3,4])?.map((_, key)=>
                    <TableRow>
                      
                    </TableRow>
                    ) : 
                    dataDocumentos > 0?
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
                    <TableRow>
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
                estadosContrato?.map((estado, idx)=>(
                  <section key={idx}>
                    <h1 className={cn('text-sm p-2 rounded-lg', estado.bgColor)}>{estado?.title}</h1>
                  </section>
                )) :
                <section className='col-span-4 flex flex-col justify-center items-center border-3 border-gray-400  border-dotted rounded-sm h-[300px]'>
                  <Title1>No hay documentos</Title1>
                  <p className="text-gray-600">No se han subido documentos aún</p>
                </section>
              }              
            </div>
          )
        }
      </section>
    </div>
  )
}
