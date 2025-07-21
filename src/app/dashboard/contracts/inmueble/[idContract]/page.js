'use client'
import FramePdf from '@/components/elements/FramePdf';
import Separator2 from '@/components/elements/Separator2';
import Title1 from '@/components/elements/Title1';
import { CompradoresList, VendedoresList } from '@/components/Tables';
import { Button } from '@/components/ui/button';
import { useContextCard } from '@/context/ContextCard';
import { useContratoContext } from '@/context/ContratosContext';
import { useFetch } from '@/hooks/useFetch';
import { getDataClientByClientId } from '@/lib/apiConnections';
import { statusContracts } from '@/lib/commonJSON';
import { camelCaseToTitle, cn } from '@/lib/utils';
import { Loader2, User2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation'
import React, { Suspense, useEffect, useState } from 'react'

function RenderPageContracts() {
  const URL_CONTRACT_ID = "http://localhost:8000/home/contract/contractId/?idContract=";
  const router = useRouter();
  const {idContract} = useParams();
  const [client, setClient] = useState(null);
  const [loadingDataClient, setLoadingDataClient] = useState(true);
  const {establecerTipoProceso, flushDataCard} = useContextCard();
  const {inicializarDataMinuta, flushDataContrato, handleChangeFileLocation} = useContratoContext();
  const {
    data : dataResponseContract, 
    loading : loadingDataContract, 
    error : errorDataContract} 
  = useFetch(URL_CONTRACT_ID + idContract);  
  useEffect(()=>{
    async function getClientData() {
      try {
        if (dataResponseContract) {          
          flushDataCard();
          flushDataContrato();

          const response = await getDataClientByClientId(dataResponseContract?.data?.clientId);
          const responseJSON = await response.json();
          establecerTipoProceso(dataResponseContract?.data?.case);
          setClient(responseJSON?.data);
          inicializarDataMinuta(dataResponseContract?.data?.id);
          const splitFile = dataResponseContract?.data?.minutaDirectory?.split('/');
          handleChangeFileLocation({
            fileName : splitFile[2],
            directory : splitFile[1]
          })
        }
      } catch (error) {
        
      }finally {
        setLoadingDataClient(false);
      }
    }
    getClientData()
  },[dataResponseContract]); 
  const dataContract = dataResponseContract?.data || null;
  if (loadingDataContract) {
    return(
      <div
      className='p-6 space-y-6'
    >
      <h1>Cargando contrato ...</h1>
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
          className={"bg-amber-100 rounded-sm p-5 hover:bg-amber-50 cursor-pointer"}
          variant={"outline"}
          onClick={()=>router.push("/dashboard/processContract/generateScript/?idContract="+idContract)}
        >
          Generar Escritura
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
    <div className='p-8 pb-12 space-y-6 h-screen overflow-y-auto'>
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
        <p><b>ID: </b>{idContract}</p>
        <p className='my-1'><b>Estado : </b>{statusContracts?.filter((est)=>est.id === dataContract?.status).map((item)=><span key={item.title} className={cn('px-2 py-1 rounded-sm text-sm space-y-4', item.bgColor)}>{item.title}</span>)}</p>
        <p><b>Tipo de Contrato :</b> <span>{camelCaseToTitle(dataContract?.case)}</span></p>
        <p className='flex flex-row gap-2'><b>Cliente : </b> <User2/>{loadingDataClient?<Loader2 className='animate-spin'/> : <span>{client?.userName}</span>}</p>
      </section>
      <section className='w-full grid grid-cols-1 lg:grid-cols-2 gap-4'>
        <CompradoresList
          dataCompradores={dataContract?.buyers?.people || []}
        />
        <VendedoresList
          dataVendedores={dataContract?.sellers?.people || []}
        />
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


export default function Page() {
  return(
    <main className='min-h-screen'>
      <Suspense
        fallback={<p>Cargando ...</p>}
      >
        <RenderPageContracts/>
      </Suspense>
    </main>
  )
}
