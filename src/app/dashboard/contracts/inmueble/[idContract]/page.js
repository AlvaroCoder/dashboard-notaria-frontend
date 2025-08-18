'use client'
import { Suspense, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useFetch } from '@/hooks/useFetch'
import { useContractDetails } from '@/hooks/useContractsDetails'
import View1ContractConstitucion from '@/components/Views/View1ContractConstitucion'
import { toast } from 'react-toastify'
import { aceptarEscritura, generateScriptMarcaAguaCompraVenta, submitFirmarDocumento } from '@/lib/apiConnections'
import View2ContractCompraVenta from '@/components/Views/View2ContractCompraVenta'
import View3ContractsConstitucionFirma from '@/components/Views/View3ContractsConstitucionFirma'
import { formatDateToYMD } from '@/lib/fechas'
import View4ContractParteNotarial from '@/components/Views/View4ContractParteNotarial'
import View5ContractParteNotarial from '@/components/Views/View5ContractParteNotarial'
import View6ContractTestimonio from '@/components/Views/View6ContractTestimonio'

function RenderPageContracts() {
  const URL_CONTRACT_ID = process.env.NEXT_PUBLIC_URL_HOME_CONTRACT+"/contractId/?idContract=";
  const {idContract} = useParams();
  
  const {
    data : dataResponseContract, 
    loading : loadingDataContract, 
    error : errorDataContract} 
  = useFetch(URL_CONTRACT_ID + idContract);  
  const {loadingDataClient, client } = useContractDetails(dataResponseContract);
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [viewPdf, setViewPdf] = useState(null);

  const dataContract = dataResponseContract?.data || null;
  
  const handleSubmitEscritura=async()=>{
    try {
      setLoading(true);
      const prevData = dataResponseContract?.data;
      const newDataToSend = {
        contractId : idContract,
        ...prevData
      };

      const response = await generateScriptMarcaAguaCompraVenta('inmueble', newDataToSend);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      setViewPdf(url);
      toast("Se genero la escritura",{
        type :'success',
        position : 'bottom-right'
      });
    } catch (err) {
      toast("Surgio un error al generar la escritura", {
        type: 'error',
        position: 'bottom-center'
      });
      
    }finally {
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
 
       router.refresh()
     } catch (err) {
       toast("Surgio un error al generar la escritura",{
         type : 'error',
         position : 'bottom-center'
       });
     } finally {
       setLoading(false)
     }
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
        <View2ContractCompraVenta
          idContract={idContract}
          dataContract={dataContract}
          loadingDataClient={loadingDataClient}
          client={client}
          loading={loading}
          viewPdfEscrituraMarcaAgua={viewPdf}
          handleClickSubmit={handleSubmitEscritura}
          checkViewEscritura={handleCheckViewEscritura}
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
          dataContract={dataContract}
          idContract={idContract}
          loadingDataClient={loadingDataClient}
          client={client}
        />
      )
    case 8:
      return(
        <View6ContractTestimonio
        dataContract={dataContract}
        idContract={idContract}
        loadingDataClient={loadingDataClient}
        client={client}
        />
      )
  }
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
