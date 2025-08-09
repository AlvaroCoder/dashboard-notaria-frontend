'use client';
import React, { useState } from 'react'
import Title1 from '../elements/Title1';
import CardDetailContract from '../Cards/CardDetailContract';
import { Button } from '../ui/button';
import { formatDateToYMD } from '@/lib/fechas';
import { transformarJSON } from '@/lib/formatterJSON';
import { useFetchViewEscritura } from '@/hooks/useFetchViewEscrtirua';
import { Loader2 } from 'lucide-react';

export default function View4ContractParteNotarial({
    idContract="",
    dataContract={},
    loadingDataClient=false,
    client=null,
    title="Detalles del contrato",
    description="Informacion del contrato",

}) {
    console.log(dataContract);
    const [loadingParteNotarial, setLoadingParteNotarial] = useState(false);

    const {loading : loadingViewEscritura, viewPdf} = useFetchViewEscritura(dataContract);
    
    const handleClickGenerateNotarialPart = () => {
        // Logic to generate notarial part
        try {
            setLoadingParteNotarial(true);
            const newData = {
                
            }
        } catch (err) {
            
        } finally {
            setLoadingParteNotarial(false);
        }
    }
    
  return (
    <div className='w-full h-screen pb-24 p-8 space-y-6 overflow-y-auto'>
        <section className='flex flex-row justify-between'>
            <div>
                <Title1 className='text-xl'>{title}</Title1>
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
        <section className='bg-white p-4 rounded-lg mt-4 shadow'>
            <Title1 className='text-xl'>Escritura generada</Title1>
            {
                loadingViewEscritura ?
                <div className='w-full rounded border border-dotted h-40 flex justify-center items-center'>
                    <Loader2 className='animate-spin' />
                </div> : 
                (viewPdf ? 
                    <embed
                        src={viewPdf}
                        className='w-full h-96 border mt-4 rounded'
                        type='application/json'
                        title='Vista previa de PDF'
                    /> :
                    <section className='w-full border border-gray-200 border-dotted rounded-sm h-40 flex justify-center items-center'>
                        <p className='font-bold'>No se pudo cargar el PDF :/</p>
                    </section>)
            }
        </section>
        <Button
        onClick={handleClickGenerateNotarialPart}
            className={"w-full mt-4"}
        >
            {loadingParteNotarial ? <Loader2 className='animate-spin'/> : <p>Generar parte notarial</p>}
        </Button>
    </div>
  )
}
