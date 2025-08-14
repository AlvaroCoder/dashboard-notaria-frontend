'use client'
import { Button } from '@/components/ui/button';
import View1ContractConstitucion from '@/components/Views/View1ContractConstitucion';
import View2ContractEscritura from '@/components/Views/View2ContractEscritura';
import View3ContractsConstitucionFirma from '@/components/Views/View3ContractsConstitucionFirma';
import View4ContractParteNotarial from '@/components/Views/View4ContractParteNotarial';
import { useContractDetails } from '@/hooks/useContractsDetails';
import { useFetch } from '@/hooks/useFetch';
import { aceptarEscritura, submitEscrituraCliente } from '@/lib/apiConnections';
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

    const handleClickSetFirma=async()=>{
      try {
        setLoading(true);
        const dateToday = formatDateToYMD(new Date());
        await submitFirmarDocumento(idContract, dateToday);

        toast("Se firmo el documento",{
          type : 'success',
          position : 'bottom-right'
        });
        
        router.push("/dashboard");

      } catch (err) {
        toast("Surgio un error al firmar la escritura",{
          type : 'error',
          position : 'bottom-center'
        });
      } finally{
        setLoading(false);
      }
    }

     const handleCheckViewEscritura=async()=>{
        try {
          setLoading(true);
          await aceptarEscritura(idContract);
          toast("La escritura fue aceptada",{
            type : 'success',
            position : 'bottom-right'
          });
          router.push("/dashboard/contracts");
    
        } catch (err) {          
          toast("Surgio un error al aceptar la escritura",{
            type : 'error',
            position : 'bottom-center'
          });
        } finally {
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
        checkViewEscritura={handleCheckViewEscritura}
        loading={loading}
        viewPdfEscrituraMarcaAgua={viewPdfEscritura}
        />
      )
    case 3:
      return (
        <p>Estado 3 con observacion</p>
      )
    case 4:
      return(
        <View3ContractsConstitucionFirma
          idContract={idContract}
          dataContract={dataContract}
          loadingDataClient={loading}
          client={client}
          handleClickSetFirma={handleClickSetFirma}
          title='Contrato de SCRL'
        />
      )
    case 5:
      return(
        <View4ContractParteNotarial
          idContract={idContract}
          dataContract={dataContract}
          loadingDataClient={loadingDataClient}
          client={client}
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
