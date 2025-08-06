'use client'
import { Button } from '@/components/ui/button';
import View1ContractConstitucion from '@/components/Views/View1ContractConstitucion';
import View2ContractEscritura from '@/components/Views/View2ContractEscritura';
import { useContractDetails } from '@/hooks/useContractsDetails';
import { useFetch } from '@/hooks/useFetch';
import { useParams, useRouter } from 'next/navigation';
import React, { Suspense } from 'react'

function RenderPageContracts() {
  const URL_CONTRACT_ID = process.env.NEXT_PUBLIC_URL_HOME_CONTRACT + "/contractId/?idContract=";
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
  switch (dataContract?.status) {
    case 1:
      return (
        <View1ContractConstitucion
          idContract={idContract}
          dataContract={dataContract}
          loadingDataClient={loadingDataClient}
          client={client}
        />
      )
    case 2:
      return (
        <View2ContractEscritura

        />
      )
  }
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
