'use client';
import View1ContractConstitucion from '@/components/Views/View1ContractConstitucion';
import View2ContractCompraVenta from '@/components/Views/View2ContractCompraVenta';
import View3ContractsConstitucionFirma from '@/components/Views/View3ContractsConstitucionFirma';
import View4ContractParteNotarial from '@/components/Views/View4ContractParteNotarial';
import View5ContractParteNotarial from '@/components/Views/View5ContractParteNotarial';
import View6ContractTestimonio from '@/components/Views/View6ContractTestimonio';
import { useContractDetails } from '@/hooks/useContractsDetails';
import { useFetch } from '@/hooks/useFetch';
import { aceptarEscritura, generateScriptMarcaAguaCompraVenta, submitFirmarDocumento } from '@/lib/apiConnections';
import { formatDateToYMD } from '@/lib/fechas';
import { useParams, useRouter } from 'next/navigation';
import React, { Suspense, useState } from 'react'
import { toast } from 'react-toastify';

function RenderPageContracts() {
    const URL_CONTRACT_ID = process.env.NEXT_PUBLIC_URL_HOME_CONTRACT + "/contractId/?idContract=";
    const {idContract} = useParams();
    const{
        data : dataResponseContract,
        loading : loadingDataContract,
        error : errorDataContract
    } = useFetch(URL_CONTRACT_ID+idContract);

    const {loadingDataClient, client} = useContractDetails(dataResponseContract);
    const dataContract = dataResponseContract?.data || null;
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [viewPdf, setViewPdf] = useState(null);


  const handleCheckViewEscritura=async()=>{
    try {
      setLoading(true);
      await aceptarEscritura(idContract);
      toast("La escritura fue aceptada",{
        type : 'success',
        position : 'bottom-right'
      });
      
      window.location.reload();

    } catch (err) {      
      toast("Surgio un error al aceptar la escritura",{
        type : 'error',
        position : 'bottom-center'
      });
    } finally {
      setLoading(false);
    }
  }
  const handleSubmitEscritura=async()=>{
    try {
      setLoading(true);
      const prevData = dataResponseContract?.data;
      const newDataToSend = {
        contractId : idContract,
        ...prevData
      };

      const response = await generateScriptMarcaAguaCompraVenta('vehiculo', newDataToSend);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      setViewPdf(url);
      toast("Se genero la escritura",{
        type :'success',
        position : 'bottom-right'
      });
    } catch (err) {
      console.log(err);
      
      toast("Surgio un error al generar la escritura", {
        type: 'error',
        position: 'bottom-center'
      });
      
    }finally {
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
   
         window.location.reload();

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

  if (loadingDataContract) {
    return(
      <div
      className='p-6 space-y-6'
    >
      <h1>Cargando contrato ...</h1>
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
          <View2ContractCompraVenta
            idContract={idContract}
            dataContract={dataContract}
            loadingDataClient={loadingDataClient}
            client={client}
            loading={loading}
            viewPdfEscrituraMarcaAgua={viewPdf}
            checkViewEscritura={handleCheckViewEscritura}
            handleClickSubmit={handleSubmitEscritura}
          />
        )
      case 3:
        return(
          <p>Vista 3</p>
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
          idContract={idContract}
          dataContract={dataContract}
          loadingDataClient={loadingDataClient}
          client={client}
          slugUpdateParteNotarial={dataContract?.documentPaths?.parteNotarialPath}
          />
        )
      case 8:
        return (
          <View5ContractParteNotarial
          idContract={idContract}
          dataContract={dataContract}
          loadingDataClient={loadingDataClient}
          client={client}
          slugUpdateParteNotarial={dataContract?.documentPaths?.parteNotarialPath}
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
