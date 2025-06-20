'use client'
import FramePdf from '@/components/elements/FramePdf';
import Separator from '@/components/elements/Separator';
import Title1 from '@/components/elements/Title1'
import { Button } from '@/components/ui/button';
import { useFetch } from '@/hooks/useFetch';
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

export default function Page() {
  const URL_CONTRACT_ID = "http://localhost:8000/home/contract/contractId/?idContract=";
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

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
    
  }
  const vistaMinuta=(idStatus, directory)=>{
    if (idStatus == 1) {
      return(
        <div>
          <section>
            <Title1 className='text-xl'>Aun no se proceso la data</Title1>
            <p className='text-gray-500 text-sm'>Procesa la minuta antes de continuar</p>
          </section>
          <FramePdf
            directory={directory}
          />
        </div>
      )
    }
    if (idStatus == 2) {
      return (
        <div>
          <section>

          </section>
        </div>
      )
    }
  }
  return (
    <div className='p-8 w-full h-screen '>
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
        <Separator/>
        <section>
          {vistaMinuta(
            data?.status,
            data?.minutaDirectory)}
        </section>
    </div>
  )
};
