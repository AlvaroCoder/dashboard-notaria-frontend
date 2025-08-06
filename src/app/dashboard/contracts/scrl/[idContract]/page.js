'use client'
import { Button } from '@/components/ui/button';
import View1ContractConstitucion from '@/components/Views/View1ContractConstitucion';
import View2ContractEscritura from '@/components/Views/View2ContractEscritura';
import { useContractDetails } from '@/hooks/useContractsDetails';
import { useFetch } from '@/hooks/useFetch';
import { submitEscrituraCliente } from '@/lib/apiConnections';
import { useParams, useRouter } from 'next/navigation';
import React, { Suspense, useState } from 'react'

function RenderPageContracts() {
  const URL_CONTRACT_ID = process.env.NEXT_PUBLIC_URL_HOME_CONTRACT + "/contractId/?idContract=";
  const router = useRouter();
  const {idContract} = useParams();

  const {
    data : dataResponseContract,
    loading : loadingDataContract,
    error : errorDataContract
  } = useFetch(URL_CONTRACT_ID+idContract);

	console.log(dataResponseContract);
  const {loadingDataClient, client} = useContractDetails(dataResponseContract);

  
  const dataContract = dataResponseContract?.data || null;
  const [loading, setLoading] = useState(false);
  const [viewPdfEscritura, setViewPdfEscritura] = useState(null);

      const handleSubmitEscritura=async()=>{
        try {
          setLoading(true);    
          const prevData = dataResponseContract?.data;
          const newDataToSend = {
            contractId : idContract,
            ...prevData
          }
          const response = await submitEscrituraCliente(newDataToSend, 'scrl');
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);

          setViewPdfEscritura(url);

        
          toast("Se envio la data",{
            type : 'success',
            position :'bottom-right'
          });
          
        } catch (error) {
          console.log(error);
          toast("Surgio un error al enviar la marca de agua",{
            type : 'error',
            position : 'bottom-center'
          });
  
        } finally{
          setLoading(false);
        }
      }

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
      return(
        <View1ContractConstitucion
          idContract={idContract}
          dataContract={dataContract}
          loadingDataClient={loadingDataClient}
          client={client}
        />
      )
  
    case 2:
      return(
        <View2ContractEscritura
        idContract={idContract}
        dataContract={dataContract}
        loadingDataClient={loadingDataClient}
        client={client}
        handleClickSubmit={handleSubmitEscritura}
        loading={loading}
        viewPdfEscrituraMarcaAgua={viewPdfEscritura}
        />
      )
    case 3:
      return (
        <p>Estado 3</p>
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
