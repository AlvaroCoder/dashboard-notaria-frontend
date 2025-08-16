import React, { useState } from 'react'
import Title1 from '../elements/Title1'
import { camelCaseToTitle, cn } from '@/lib/utils'
import { statusContracts } from '@/lib/commonJSON';
import { Loader2, User2 } from 'lucide-react';
import FramePdf from '../elements/FramePdf';
import TestimonyForm from '../Forms/FormTestimony';
import { formatDateToYMD } from '@/lib/fechas';
import { setUpTestimonioCompraVenta } from '@/lib/apiConnections';

export default function View5ContractParteNotarial({
  idContract='',
  dataContract={},
  loadingDataClient,
  client=null,
  title="Detalles del Contrato",
  description="Información del contrato",
  
}) {
  const [viewPdfTestimonio, setViewPdfTestimonio] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClickTestimonio=async(testimony)=>{
    try {
      setLoading(true);
      const newDataToSend={
        ...testimony,
        contractId : idContract,
        processDocumentDate : {
          date : formatDateToYMD(new Date())
        }
      }
      const response = await setUpTestimonioCompraVenta(newDataToSend, 'inmueble');
      const blob = await response.blob();

      setViewPdfTestimonio(URL.createObjectURL(blob));
      
    } catch (err) {
      console.log(err);
      
    } finally {
      setLoading(false)
    }
  }
  if (viewPdfTestimonio) {
    return(
            <section className='max-w-4xl mx-auto mt-8 h-screen w-ful p-4 rounded-lg shadow'>
            <div className='p-4 w-full border-b border-b-gray-300 flex flex-row justify-between items-center'>
                <Title1 className='text-xl'>PDF del testimonio</Title1>
                <p>Descargalo si es necesario</p>
            </div>
            <embed
                src={viewPdfTestimonio}
                className='w-full h-screen border mt-4 rounded'
                type='application/json'
                title='Vista previa de PDF Parte Notarial'
            />
            
        </section>
    )
  } else{
    return (
      <div className='h-screen pb-24 p-8 space-y-6  overflow-y-auto'>
         <section className='flex flex-row justify-between'>
              <div>
                <Title1 className='text-3xl'>{title}</Title1>
                <p>{description}</p> 
              </div>
         </section>
         <section className=''>
              <p><b>ID: </b>{idContract}</p>
              <p className='my-1'><b>Estado : </b>{statusContracts?.filter((est)=>est.id === dataContract?.status).map((item)=><span key={item.title} className={cn('px-2 py-1 rounded-sm text-sm space-y-4', item.bgColor)}>{item.title}</span>)}</p>
              <p><b>Tipo de Contrato :</b> <span>{camelCaseToTitle(dataContract?.contractType)}</span></p>
              <p className='flex flex-row gap-2'><b>Cliente : </b> <User2/>{loadingDataClient ?<Loader2 className='animate-spin'/> : <span>{client?.userName}</span>}</p>
            </section>
  
            <section className='bg-white p-4 rounded-lg mt-4 shadow'>
              <Title1>Partida Notarial Generada</Title1>
              <FramePdf
                directory={ dataContract?.documentPaths?.parteNotarialPath}
              /> 
  
          </section>
          <section>
            <Title1>Generar Testimonio</Title1>
            <TestimonyForm
              loading={loading}
              generateTestimony={handleClickTestimonio}
            />
          </section>
      </div>
    )
  }
};