'use client'
import { useContractDetails } from '@/hooks/useContractsDetails';
import { useFetch } from '@/hooks/useFetch';
import { aceptarEscritura, submitEscrituraCliente, submitFirmarDocumento } from '@/lib/apiConnections';
import { formatDateToYMD } from '@/lib/fechas';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import React, { Suspense, useState } from 'react'
import { toast } from 'react-toastify';

const View1ContractConstitucion = dynamic(()=>import('@/components/Views/View1ContractConstitucion'),{
  ssr : false
});

const View2ContractEscritura = dynamic(()=>import('@/components/Views/View2ContractEscritura'),{
  ssr : false
});

const View3ContractsConstitucionFirma = dynamic(()=>import('@/components/Views/View3ContractsConstitucionFirma'),{
  ssr : false
});

const View4ContractParteNotarial = dynamic(()=>import('@/components/Views/View4ContractParteNotarial'),{
  ssr : false
});

const View5ContractParteNotarial = dynamic(()=>import('@/components/Views/View5ContractParteNotarial'),{
  ssr : false
});

const View6ContractTestimonio = dynamic(()=>import('@/components/Views/View6ContractTestimonio'),{
  ssr : false
});

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
  const [loading, setLoading] = useState(false);
  const [viewPdf, setViewPdf] = useState(null);  

  const router = useRouter();

  const handleSubmitEscritura=async()=>{
    try {
      setLoading(true);
      const prevData = dataResponseContract?.data;
      const newDataToSend = {
        contractId : idContract,
        ...prevData
      }

      const response = await submitEscrituraCliente(newDataToSend, 'asociacion')    
      const blob = await response.blob();

      const url = URL.createObjectURL(blob);
      setViewPdf(url);
      toast("Se genero la escritura",{
        type : 'info',
        position : 'bottom-right'
      });

    } catch (err) {
      toast("Surgio un error al generar la escritura",{
        type : 'error',
        position : 'bottom-center'
      });
    } finally {
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

  const handleClickSetFirma=async()=>{
    try {
      setLoading(true);
      const dataToday = formatDateToYMD(new Date());
      await submitFirmarDocumento(idContract, dataToday);
      
      toast("Se firmo el documento",{
        type:'success',
        position : 'bottom-right'
      });

      router.push("/dashboard/contracts")
    } catch (err) {
      toast("Surgio un error al generar la escritura",{
        type : 'error',
        position : 'bottom-center'
      });
    } finally {
      setLoading(false)
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
        viewPdfEscrituraMarcaAgua={viewPdf}
        loading={loading}
        />
      )
    case 3:
      return(
        <p>Vista 3 de Comentarios</p>
      )
    case 4:
      return(
        <View3ContractsConstitucionFirma
          idContract={idContract}
          dataContract={dataContract}
          loadingDataClient={loadingDataClient}
          client={client}
          handleClickSetFirma={handleClickSetFirma}
          
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
    case 6:
      return(
        <View5ContractParteNotarial
          dataContract={dataContract}
          idContract={idContract}
          loadingDataClient={loadingDataClient}
          client={client}
          slugUpdateParteNotarial={dataContract?.documentPaths?.parteNotarialPath}
        />
      )
    case 8:
      return(
        <View6ContractTestimonio
        dataContract={dataContract}
        idContract={idContract}
        loadingDataClient={loadingDataClient}
        client={client}
        slugUpdateTestimonio={dataContract?.documentPaths?.testimonioPath}
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
