'use client'
import { Button } from '@/components/ui/button';
import { useContractDetails } from '@/hooks/useContractsDetails';
import { useFetch } from '@/hooks/useFetch';
import { statusContracts } from '@/lib/commonJSON';
import { camelCaseToTitle, cn } from '@/lib/utils';
import { Loader2, User2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import React, { Suspense } from 'react'

// ✅ Dynamic imports
const FramePdf = dynamic(() => import('@/components/elements/FramePdf'), { ssr: false });
const Separator2 = dynamic(() => import('@/components/elements/Separator2'));
const Title1 = dynamic(() => import('@/components/elements/Title1'));
const CompradoresList = dynamic(() => import('@/components/Tables').then(m => m.CompradoresList));
const VendedoresList = dynamic(() => import('@/components/Tables').then(m => m.VendedoresList));


function RenderPageContracts() {
  const URL_CONTRACT_ID = process.env.NEXT_PUBLIC_URL_HOME_CONTRACT + "/contractId/?idContract=";
  const router = useRouter();
  const {idContract} = useParams();

  const {
    data : dataResponseContract,
    loading : loadingDataContract,
    error : errorDataContract
  } = useFetch(URL_CONTRACT_ID+idContract);

  const {loadingDataClient, client} = useContractDetails(dataResponseContract);

  const dataContract = dataResponseContract?.data || null;
  
  if (loadingDataContract || loadingDataClient) {
    return <div className='p-6'>
      <h1>Cargando contrato ...</h1>
    </div>
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
          <Title1 className='text-3xl'>Detalles del Contrato de Asociación</Title1>
          <p className='w-full max-w-2xl'>Información detallada del contrato Constitución de asociación de empresas.</p> 
        </div>
        <div>
          {handleButtonContract(dataContract?.status)}
        </div>
      </section>
      <section className=''>
        <p><b>ID: </b>{idContract}</p>
        <p className='my-1'><b>Estado : </b>{statusContracts?.filter((est)=>est.id === dataContract?.status).map((item)=><span key={item.title} className={cn('px-2 py-1 rounded-sm text-sm space-y-4', item.bgColor)}>{item.title}</span>)}</p>
        <p><b>Tipo de Contrato :</b> <span>{camelCaseToTitle(dataContract?.contractType)}</span></p>
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
  return (
    <main>
      <Suspense
        fallback={<p>Cargando ...</p>}
      >
        <RenderPageContracts/>
      </Suspense>
    </main>
  )
};
