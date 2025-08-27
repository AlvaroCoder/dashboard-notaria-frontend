'use client';
import React from 'react'
import Title1 from '../elements/Title1'
import CardDetailContract from '../Cards/CardDetailContract'
import Separator2 from '../elements/Separator2';
import { CircleCheckBig, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import FramePdfWord from '../elements/FramePdfWord';
import { TextField } from '@mui/material';

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
        <div>
            <Title1 className='text-2xl'>Información de la escritura</Title1>
            <div className=''>
                <Title1>Información de las Fojas</Title1>
                <div className='flex flex-col gap-2'>
                    <Title1>Inicio</Title1>
                    <section className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                        <TextField
                            label="Numero de inicio"
                            disabled
                            value={dataContract?.fojasData?.start?.number}
                        />
                        <TextField
                            label="Serie de inicio"
                            disabled
                            value={dataContract?.fojasData?.start?.serie}
                        />
                    </section>
                </div>
                <div className='flex flex-col gap-2'>
                    <Title1>Final</Title1>
                    <section className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                        <TextField
                            label="Numero final"
                            disabled
                            value={dataContract?.fojasData?.end?.number}
                        />
                        <TextField
                            label="Serie final"
                            disabled
                            value={dataContract?.fojasData?.end?.serie}
                        />
                    </section>
                </div>
            </div>
            <div className='flex flex-col gap-4 mt-4'>
                <Title1 className=''>Informacion de la cabecera</Title1>
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
                    <TextField
                        disabled
                        label="Numero Documento Notarial"
                        value={dataContract?.header?.numeroDocumentoNotarial}
                    />
                    <TextField
                        disabled
                        label="Registro"
                        value={dataContract?.header?.numeroRegistroEscritura}
                    />
                    <TextField
                        label="Año"
                        value={dataContract?.header?.year}
                        disabled
                    />
                    <TextField
                        label="Folio"
                        value={dataContract?.header?.folio}
                        disabled
                    />
                    <TextField
                        label="Tomo"
                        value={dataContract?.header?.tomo}
                        disabled
                    />
                    <TextField
                        label="Kardex"
                        value={dataContract?.header?.kardex}
                        disabled
                    />
                </div>
            </div>
        </div> 
            <p className='flex flex-row gap-4 p-2 rounded-sm bg-green-100 w-fit my-4'> <CircleCheckBig className='text-green-600' /> Escritura aceptada</p>
            <FramePdfWord
                path={dataContract?.pdfDocumentPaths?.escrituraPath}
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
