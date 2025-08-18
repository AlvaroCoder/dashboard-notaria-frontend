import React, { useState } from 'react'
import Title1 from '../elements/Title1'
import { camelCaseToTitle, cn } from '@/lib/utils'
import { statusContracts } from '@/lib/commonJSON';
import { Loader2, User2 } from 'lucide-react';
import TestimonyForm from '../Forms/FormTestimony';
import { formatDateToYMD } from '@/lib/fechas';
import { setUpTestimonioCompraVenta, setUpTestimonioConstitucion, updateEscrituraWord } from '@/lib/apiConnections';
import { toast } from 'react-toastify';
import FramePdfWord from '../elements/FramePdfWord';
import CardAviso from '../Cards/CardAviso';
import ButtonUploadWord from '../elements/ButtonUploadWord';
import { Button } from '../ui/button';
import ButtonDownloadWord from '../elements/ButtonDownloadWord';
import { useRouter } from 'next/navigation';

export default function View5ContractParteNotarial({
  idContract='',
  dataContract={},
  loadingDataClient,
  client=null,
  title="Detalles del Contrato",
  description="Información del contrato",
  
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fileWord, setFileWord] = useState(null);
  const [loadingUpdateWord, setLoadingUpdateWord] = useState(false)
  
	const handleChangeDocumentWord=(file)=>{
		setFileWord(file);
	}
  const handleUpdateEscritura=async()=>{
    try {
      setLoadingUpdateWord(true);
      const newFormData = new FormData();
      newFormData.append('file', fileWord);

      await updateEscrituraWord(dataContract?.documentPaths?.escrituraPath, newFormData);
      router.push("/dashboard/contracts")
      toast("Se actualizo la información de la escritura",{
        type : 'info',
        position : 'bottom-right'
      });
    } catch (err) {
      toast("Ocurrio un error",{
        type : 'error'	,
        position : 'bottom-center'
      })
    }finally {
      setLoadingUpdateWord(false);
    }
  }

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

      let typeContract;

      if (dataContract?.contractType === 'compraVentaPropiedad') {
          typeContract = 'inmueble';
      } else {
          typeContract = dataContract?.contractType.toLowerCase() === 'rs' ? 'razonSocial' : dataContract?.contractType?.toLowerCase();
      }

      const response = ['asociacion','razonSocial','rs','scrl','sac'].includes(dataContract?.contractType?.toLowerCase())
      ? await setUpTestimonioConstitucion(newDataToSend, typeContract):
      await setUpTestimonioCompraVenta(newDataToSend, typeContract);

      toast("Se genero el testimonio correctamente",{
        type : 'success',
        position : 'bottom-right'
      });
      router.push("/dashboard/contracts");
    } catch (err) {
      toast("Se genero el testimonio correctamente",{
        type : 'error',
        position : 'bottom-center'
      });
      console.log(err);
      
    } finally {
      setLoading(false)
    }
  }
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
        <ButtonDownloadWord
            dataContract={dataContract}
            idContract={idContract}
            slugDownload={dataContract?.documentPaths?.parteNotarialPath}
            title='Descarga la parte notarial'
        />
        <section className='bg-white p-4 rounded-lg mt-4 shadow'>
            <Title1>Partida Notarial Generada</Title1>
            <FramePdfWord
              directory={ dataContract?.documentPaths?.parteNotarialPath}
            /> 

        </section>
        <section className='w-full rounded-sm shadow p-4'>
          <div className='w-full'>
            <Title1>Subir Parte Notarial actualizada</Title1>
            <div className='my-4'>
              <CardAviso
                advise='NO OLVIDAR DE RELLENAR LOS ESPACIOS'
              />
            </div>
          </div>
          <ButtonUploadWord
            handleSetFile={handleChangeDocumentWord}
          />
          <Button
            disabled={!fileWord || loadingUpdateWord}
            className={"w-full mt-4"}
            onClick={handleUpdateEscritura}
          >
            {loadingUpdateWord ? <Loader2 className='animate-spin'/> : <p>Actualizar Escritura</p>}
          </Button>
        </section>
        {
          dataContract?.contractType !== 'compraVentaVehiculo' &&
          <section>
          <Title1>Generar Testimonio</Title1>
          <TestimonyForm
            loading={loading}
            generateTestimony={handleClickTestimonio}
          />
        </section>
        }
    </div>
  )
};