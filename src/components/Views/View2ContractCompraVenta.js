'use client'
import React from 'react'
import {statusContracts} from '@/lib/commonJSON';
import dynamic from 'next/dynamic';
import {Button} from '../ui/button';
import {camelCaseToTitle, cn} from '@/lib/utils';
import {Loader2, User2} from 'lucide-react';
import { TextField } from '@mui/material';
import CardPersonBuyerSeller from '../Cards/CardPersonBuyerSeller';
import { useFetchViewEscritura } from '@/hooks/useFetchViewEscrtirua';

// ✅ Dynamic imports
const FramePdf = dynamic(() => import('@/components/elements/FramePdf'), { ssr: false });
const Title1 = dynamic(() => import('@/components/elements/Title1'));

export default function View2ContractCompraVenta({
    idContract,
	dataContract,
	loadingDataClient,
	client,
	junior,
	viewPdfEscrituraMarcaAgua=null,
	loading=false,
	handleClickSubmit=()=>{},
    checkViewEscritura =()=>{}
}) {
    const {loading : loadingViewEscritura, viewPdf} = useFetchViewEscritura(dataContract);
    
    return (
    <div className='h-screen pb-24 p-8 space-y-6 overflow-y-auto'>
        <section className="flex flex-row justify-between">
        <div>
            <Title1 className="text-3xl">Contrato Generado</Title1>
            <p>Informacion del de la escritura generada</p>
        </div>
        </section>
        <section>
            <p><b>ID : </b>{idContract}</p>
            <p className="my-1"><b>Estado : </b>{statusContracts?.filter((est)=>est?.id === dataContract?.status).map((item)=><span key={item.title} className={cn('px-2 py-1 rounded-sm text-sm space-y-4', item.bgColor)}>{item.title}</span>)}</p>
            <p><b>Tipo de Contrato : </b><span>{camelCaseToTitle(dataContract ? dataContract?.contractType : '')}</span></p>
            <p className='flex flex-row gap-2'><b>Cliente : </b> <User2/>{loadingDataClient ?<Loader2 className='animate-spin'/> : <span>{client?.userName}</span>}</p>
        </section>
        {
            dataContract?.contractType !== 'compraVentaVehiculo' &&
                <section className='shadow bg-white p-4 rounded-lg '>
                <Title1 className='text-2xl' >Información de la minuta</Title1>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4'>
                    <TextField label="Nro Documento Notarial" value={dataContract?.minuta?.minutaNumber}  type='number' disabled fullWidth  />
                    <TextField label="Lugar" value={dataContract?.minuta?.place?.name} disabled fullWidth />
                    <TextField label="Distrito" value={dataContract?.minuta?.place?.district} disabled fullWidth />
                    <TextField label="Fecha creacion" value={dataContract?.minuta?.creationDay?.date} disabled fullWidth />
                    
                </div>
                <div className='mt-4'>
                    <FramePdf
                        directory={dataContract?.minutaDirectory}
                        
                    />
                </div>
            </section>
        }
        <section className='bg-white p-4 rounded-lg mt-4 shadow'>
            <section className='w-full grid grid-cols-1 lg:grid-cols-2 gap-4'>
                <div>
                    <Title1 className='text-xl'>Información de los vendedores</Title1>
                    <div className='w-full grid grid-cols-1 mt-4 gap-4'>
                        {
                            dataContract?.sellers?.people?.map((found, idx)=>(
                                <CardPersonBuyerSeller
                                    key={idx}
                                    person={found}

                                />
                            ))
                        }
                    </div>
                </div>
                <div>
                    <Title1 className='text-xl'>Información de los compradores</Title1>
                    <div className='w-full grid grid-cols-1 mt-4 gap-4'>
                        {
                            dataContract?.buyers?.people?.map((found, idx)=>(
                                <CardPersonBuyerSeller
                                    key={idx}
                                    person={found}

                                />
                            ))
                        }
                    </div>
                </div>
            </section>
        </section>
    {
        dataContract?.contractType !== 'compraVentaVehiculo' &&
        <section className='bg-white p-4 rounded-lg mt-4 shadow'>
            <Title1 className='text-xl'>Escritura del cliente</Title1>
            {
                viewPdfEscrituraMarcaAgua ?
                (
                    <embed
                        src={viewPdfEscrituraMarcaAgua}
                        className='w-full h-96 border rounded'
                        type='application/json'
                        title='Vista previa de PDF'
                    />
                ) :
                <section className='w-full border border-gray-200 border-dotted rounded-sm h-40 flex justify-center items-center'>
                    <p className=' font-bold'>No se pudo cargar el PDF :/</p>
                </section>
            }
            <Button
                disabled={loading}
                onClick={handleClickSubmit}
                className={'w-full my-4'}
            >
                {loading ? <Loader2 className='animate-spin' /> : <p>Ver Escritura con marca de agua</p>}
            </Button>
        </section>
    }
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
        className={"w-full my-4 "}
        onClick={checkViewEscritura}
        disabled={loading}
    >
        {loading ? <Loader2 className='animate-spin' /> : <p>Verificar la Escritura</p>}
    </Button>
    </div>
  )
}
