import React, { useState } from 'react'
import Title1 from '../elements/Title1'
import { camelCaseToTitle, cn } from '@/lib/utils'
import { statusContracts } from '@/lib/commonJSON'
import { Loader2, User2 } from 'lucide-react'
import FramePdfWord from '../elements/FramePdfWord'
import CardAviso from '../Cards/CardAviso'
import ButtonUploadWord from '../elements/ButtonUploadWord'
import { useRouter } from 'next/navigation'
import { updateEscrituraWord } from '@/lib/apiConnections'
import { toast } from 'react-toastify'
import { Button } from '../ui/button'
import ButtonDownloadWord from '../elements/ButtonDownloadWord'

export default function View6ContractTestimonio({
    idContract='',
    dataContract={},
    loadingDataClient,
    client=null,
    title="Detalles del Contrato",
    description="Información del contrato",  
    slugUpdateTestimonio=""
}) {
  const router = useRouter();
  const [loadingUpdateWord, setLoadingUpdateWord] = useState(false)
  const [fileWord, setFileWord] = useState(null);
  const handleChangeDocumentWord=(file)=>{
    setFileWord(file);
  }
  const handleUpdateEscritura=async()=>{
    try {
      setLoadingUpdateWord(true);
      const newFormData = new FormData();
      newFormData.append('file', fileWord);

      await updateEscrituraWord(slugUpdateTestimonio, newFormData);
      router.push("/dashboard/contracts");
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
          title='Descarga el testimonio generado'
          slugDownload={dataContract?.documentPaths?.testimonioPath}
        />
        <section className='bg-white p-4 rounded-lg mt-4 shadow'>
            <Title1>Testimonio Generado</Title1>
            <FramePdfWord
            directory={ dataContract?.documentPaths?.testimonioPath}
            /> 
        </section>
        <section className='w-full rounded-sm shadow p-4'>
          <div className='w-full'>
            <Title1>Subir testimonio actualizado</Title1>
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
    </div>
  )
};