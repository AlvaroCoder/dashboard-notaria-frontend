'use client'
import { parseTextoToJSON } from '@/common/parserText';
import FramePdf from '@/components/elements/FramePdf';
import Loading from '@/components/elements/Loading';
import Separator from '@/components/elements/Separator';
import Title1 from '@/components/elements/Title1'
import { Button } from '@/components/ui/button';
import { DocumentRenderer } from '@/components/Views';
import EditorView from '@/components/Views/EditorView';
import { useContratoContext } from '@/context/ContratosContext';
import { useFetch } from '@/hooks/useFetch';
import { cn } from '@/lib/utils';
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

export default function Page() {
  const URL_CONTRACT_ID = "http://localhost:8000/home/contract/contractId/?idContract=";
  const URL_PROCESS_DATA = "http://localhost:8000/contracts/processMinuta/";
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [loadingProcess, setLoadingProcess] = useState(false);
  const [parseDataProcess, setParseDataProcess] = useState(null);
  const {inicializarBloquesMinuta} = useContratoContext()
  useEffect(()=>{
    async function getData() {
      try {
        setLoading(true);
        const response = await fetch(URL_CONTRACT_ID+params.get("idContract"));
        const responseJSON = await response.json();
        setData(responseJSON?.data);

      } catch (error) {
        setLoading(false);
        toast("Error con el servidor",{
          type : 'error',
          position : 'bottom-center'
        })
      } finally{
        setLoading(false);
      }
    }
    getData();
  },[]);
  const handleClickProcess=async(evt)=>{
    evt.preventDefault();
    console.log(pdf);
    try {
      setLoadingProcess(true)
      const formData = new FormData();
      formData.append("minutaFile", pdf);
      const response = await fetch(URL_PROCESS_DATA,{
        method : 'POST',
        body : formData,
        redirect : 'follow'
      });

      const responseJSON = await response.json();
      toast("Se proceso la información",{
        type : 'success',
        position : 'bottom-right'
      });
      const parserText = parseTextoToJSON(responseJSON?.minuta_content);
      setParseDataProcess(parserText?.data);
      inicializarBloquesMinuta(parserText?.data);
      
    } catch (err) {
      toast("Surgio un error con el servidor",{
        type : 'error',
        position : 'bottom-center'
      });
      setLoadingProcess(false);

    } finally{
      setLoadingProcess(false)
    }
    
  }
  const vistaMinuta=(idStatus, directory, parserData)=>{
    if (idStatus == 1 && !parserData) {
      return(
        <div>
          <section>
            <Title1 className='text-xl'>Aun no se proceso la data</Title1>
            <p className='text-gray-500 text-sm'>Procesa la minuta antes de continuar</p>
          </section>
          <FramePdf
            directory={directory}
            handlePdf={setPdf}
          />
        </div>
      )
    }
    if (idStatus == 2) {
      return (
        <div>
          <section>
            <h1>Se proceso la data</h1>
          </section>
        </div>
      )
    }
    if (parserData) {
      return (
        <div className='relative h-screen overflow-y-auto w-full flex-1 '>
          <EditorView data={parserData} />
        </div>
      )
    }
  }
  return (
    <div className={cn('p-8 w-full h-screen ', parseDataProcess && "p-0")}>
      <Loading isOpen={loadingProcess} />
      {
        !parseDataProcess &&
        <section className='flex flex-row items-center justify-between'>
          <div>
            <Title1 className='text-3xl'>Editor</Title1>
            <p className='text-slate-500 text-sm'>Editar la información de la minuta</p>
            <p className='text-slate-500 text-sm'>ID: {params.get('idContract')}</p>
          </div>
          <div>
            <Button
              onClick={handleClickProcess}
            >
              Procesar Minuta
            </Button>
          </div>
        </section>
      }
      {!parseDataProcess &&  <Separator/>}
        <section className=''>
          {vistaMinuta(
            data?.status,
            data?.minutaDirectory,
            parseDataProcess
            )}
        </section>
    </div>
  )
};
