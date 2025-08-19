'use client';
import React from 'react'
import Title1 from '../elements/Title1'
import CardDetailContract from '../Cards/CardDetailContract'
import Separator2 from '../elements/Separator2';
import { CircleCheckBig, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import FramePdfWord from '../elements/FramePdfWord';

export default function View3ContractsConstitucionFirma({
    idContract='',
    dataContract = {},
    loadingDataClient=false,
    client=null,
    title="Detalles del Contrato",
    description ="Informacion del contrato",
    handleClickSetFirma=(e)=>{e.preventDefault();
    }
}) {

  return (
    <div className='w-full h-screen pb-24 p-8 space-y-6 overflow-y-auto'>
        <section className='flex flex-row justify-between'>
            <div>
                <Title1 className='text-3xl'>{title}</Title1>
                <p>{description}</p>
            </div>
        </section>
        <CardDetailContract
            idContract={idContract}
            status={dataContract?.status}
            loadingDataClient={loadingDataClient}
            client={client}
            contractType={dataContract?.contractType}
        />
        <Separator2/>
        <section>
            <Title1 className='text-xl'>Información de la Escritura</Title1>
            <p className='flex flex-row gap-4 p-2 rounded-sm bg-green-100 w-fit'> <CircleCheckBig className='text-green-600' /> Escritura aceptada</p>
            <FramePdfWord
                directory={dataContract?.documentPaths?.escrituraPath}
            />
            <Button 
                disabled={loadingDataClient}
                onClick={handleClickSetFirma}
                className={"w-full my-4"}
            >
                {loadingDataClient ? <Loader2 className='animate-spin'/> : <p>Notario Firmo la Escritura</p>}
            </Button>
        </section>
    </div>
  )
};
