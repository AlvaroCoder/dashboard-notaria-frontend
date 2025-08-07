'use client';
import React, { useEffect, useState } from 'react'
import Title1 from '../elements/Title1'
import CardDetailContract from '../Cards/CardDetailContract'
import Separator2 from '../elements/Separator2';
import { CircleCheckBig, Loader2 } from 'lucide-react';
import { getDocumentByPath } from '@/lib/apiConnections';
import { toast } from 'react-toastify';
import { Button } from '../ui/button';

export default function View3ContractsConstitucionFirma({
    idContract='',
    dataContract = {},
    loadingDataClient=false,
    client=null,
    title="Detalles del Contrato",
    description ="Informacion del contrato",
    handleClickSetFirma=()=>{}
}) {

    const [loading, setLoading] = useState(false);
    const [viewPdf, setViewPdf] = useState(null);

    useEffect(()=>{
        async function getData() {
            try {
                setLoading(true);
                const response = await getDocumentByPath(dataContract?.documentPaths?.escrituraPath);
                const blob = await response.blob();

                const url = URL.createObjectURL(blob);
                setViewPdf(url);
                toast("Escritura cargada",{
                    type : 'info',
                    position: 'bottom-right'
                });
            } catch (err) {
                toast("Erro al cargar la escritura",{
                    type : 'error',
                    position : 'bottom-right'
                });
            } finally {
                setLoading(false);
            }
        }
        getData();
    },[dataContract]);
  return (
    <div className='w-full h-screen pb-24 p-8 space-y-6 overflow-y-auto'>
        <section className='flex flex-row justify-between'>
            <div>
                <Title1>{title}</Title1>
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
            {
                (loading ) ?
                <div className='w-full rounded border border-dotted h-40 flex justify-center items-center'>
                    <Loader2 className='animate-spin' />
                </div>:
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
            <Button 
                disabled={loadingDataClient}
                onClick={handleClickSetFirma}
                className={"w-full my-4"}
            >
                {loadingDataClient ? <Loader2 className='animate-spin'/> : <p>Firmar escritura</p>}
            </Button>
        </section>
    </div>
  )
};
