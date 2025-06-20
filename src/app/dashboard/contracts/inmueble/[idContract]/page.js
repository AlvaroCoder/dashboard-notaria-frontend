'use client'
import FramePdf from '@/components/elements/FramePdf';
import Separator from '@/components/elements/Separator';
import Separator2 from '@/components/elements/Separator2';
import Title1 from '@/components/elements/Title1';
import { CompradoresList, VendedoresList } from '@/components/Tables';
import { Button } from '@/components/ui/button';
import { useFetch } from '@/hooks/useFetch';
import { cn } from '@/lib/utils';
import { useParams, useRouter } from 'next/navigation'
import React from 'react'

const estados = [
  {id : 1, title : "PROCESO INICIADO", bgColor : "bg-green-50"},
  {id : 2, title : "EN REVISIÓN", bgColor : "bg-amber-100"},
  {id : 3, title : "OBSERVADO", bgColor : "bg-slate-100"},
  {id : 4, title : "PENDIENTE DE FIRMA", bgColor : "bg-blue-200 "},
  {id : 5, title : "FIRMADO", bgColor : "bg-amber-200"},
  {id : 6, title : "PENDIENTE DE RESPUESTA DEL SID", bgColor : "bg-gray-50"},
  {id : 7, title : "TACHADO",  bgColor : "bg-red-100"},
  {id : 8 ,title : "INSCRITO", bgColor : "bg-green-100"},
];

export default function Page() {
  const URL_CONTRACT_ID = "http://localhost:8000/home/contract/contractId/?idContract=";
  const router = useRouter();
    const {idContract} = useParams();
    const {
      data : dataResponseContract, 
      loading : loadingDataContract, 
      error : errorDataContract} = useFetch(URL_CONTRACT_ID + idContract);   
    const dataContract = dataResponseContract?.data || null;
   
  if (loadingDataContract) {
    return (
      <div className='p-6 space-y-6'>
        <h1 className='text-3xl font-bold text-gray-800'>Cargando contrato...</h1>
      </div>
    )
  }
  if (errorDataContract) {
    return (
      <div className='p-6 space-y-6'>
        <h1 className='text-3xl font-bold text-red-600'>Error al cargar el contrato</h1>
      </div>
    )
  }
  if (!dataResponseContract || dataResponseContract.data.length === 0) {
    return (
      <div className='p-6 space-y-6'>
        <h1 className='text-3xl font-bold text-gray-800'>Contrato no encontrado</h1>
      </div>
    )
  }
  const handleButtonContract=(idStatus)=>{
    if (idStatus === 1) {
      return(
        <Button
          className={"rounded-sm p-6 bg-amber-100 border-amber-400 text-[#0C1019] hover:bg-white"}
          variant={"outline"}
          onClick={()=>router.push(`/dashboard/editor?idContract=${idContract}`)}
        >
          Iniciar Revision 
        </Button>
      )
    } 
    if (idStatus === 2) {
      return(
        <Button
          className={"rounded-sm p-6"}
          variant={"ghost"}
        >
          Continuar Revision
        </Button>
      )
    }
  }
  return (
    <div className='p-8 space-y-6 h-screen overflow-y-auto'>
      <section className='flex flex-row justify-between'>
        <div>
          <Title1 className='text-3xl'>Detalles del Contrato</Title1>
          <p>Información detallada del contrato</p> 
        </div>
        <div>
          {handleButtonContract(dataContract?.status)}
        </div>
      </section>
      <section className=''>
        <Separator/>
        <p><b>ID: </b>{idContract}</p>
        <p className='my-1'><b>Estado : </b>{estados?.filter((est)=>est.id === dataContract?.status).map((item)=><span key={item.title} className={cn('px-2 py-1 rounded-sm text-sm space-y-4', item.bgColor)}>{item.title}</span>)}</p>
        <p><b>Tipo de Contrato :</b> <span>{dataContract?.contractType === 'propertyCompraVenta' ? 'Compra/Venta' : 'Otro'}</span></p>
      </section>
      <CompradoresList
        dataCompradores={dataContract?.buyers?.people || []}
      />
      <VendedoresList
        dataVendedores={dataContract?.sellers?.people || []}
      />
      <section>
        <Title1 className='text-xl'>Metodo de Pago</Title1>
        <Separator2/>
        <div>
          <h1><b>Descripcion :</b> {dataContract?.paymentMethod?.caption}</h1>
          <div className='mt-2'>
            <h1><b>Evidencias :</b> </h1>
            {
             ( dataContract?.paymentMethod?.evidences?.length) ?
              <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 gap-4 '>
                {
                  dataContract?.paymentMethod?.evidences?.map((evidencia, idx)=>
                  <li key={idx} className='p-2 rounded-sm shadow-sm bg-white'> 
                    <div className='w-full h-32 bg-gray-200 rounded-sm'/>
                  </li>)
                }
              </ul>:
              <section className='w-full rounded-sm border-dotted border-2 border-slate-300 h-32 flex justify-center items-center'>
                <Title1>No hay evidencias</Title1>
              </section>
            }
          </div>
        </div>
      </section>
      <section>
        <Title1 className='text-xl'>Minuta del Contrato</Title1>
        <Separator2/>
        <FramePdf
          directory={dataContract?.minutaDirectory}
        />
      </section>
      
    </div>
  )
}
