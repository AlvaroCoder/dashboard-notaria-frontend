'use client';
import React, { useState } from 'react'
import Title1 from '../elements/Title1';
import CardDetailContract from '../Cards/CardDetailContract';
import { Button } from '../ui/button';
import { formatDateToYMD } from '@/lib/fechas';
import { transformarJSON } from '@/lib/formatterJSON';
import { useFetchViewEscritura } from '@/hooks/useFetchViewEscrtirua';
import { Loader2 } from 'lucide-react';
import { generarParteNotarial, generarParteNotarialConstitucion } from '@/lib/apiConnections';
import { toast } from 'react-toastify';

export default function View4ContractParteNotarial({
    idContract="",
    dataContract={},
    loadingDataClient=false,
    client=null,
    title="Detalles del contrato",
    description="Informacion del contrato",

}) {

    const [loadingParteNotarial, setLoadingParteNotarial] = useState(false);

    const {loading : loadingViewEscritura, viewPdf} = useFetchViewEscritura(dataContract);
    const [viewParteNotarial, setViewParteNotarial] = useState(null);
    
    const handleClickGenerateNotarialPart =async () => {
        // Logic to generate notarial part
        try {
            setLoadingParteNotarial(true);
            const newData = {
                ...dataContract,
                contractId : idContract,
                signedDocumentDate : {
                    date : formatDateToYMD(new Date())
                }
            }
            if (dataContract?.contractType === 'compraVentaPropiedad') {
                let buyers = dataContract?.buyers?.people?.map((buyer)=>({
                    ...buyer,
                    signedDate : {
                        date : formatDateToYMD(new Date())
                    }
                }));

                let sellers = dataContract?.sellers?.people?.map((seller)=>({
                    ...seller,
                    signedDate : {
                        date : formatDateToYMD(new Date())
                    }
                }));
                newData.buyers = {
                    people : buyers
                };
                newData.sellers = {
                    people : sellers
                };
            }
            if (["asociacion", "RS", "SCRL", "SAC"].includes(dataContract?.contractType)) {
                let founders = dataContract?.founders?.people?.map((founder)=>({
                    ...founder,
                    signedDate : {
                        date : formatDateToYMD(new Date())
                    }
                }))
                newData.founders = {
                    people : founders
                };
            }

            let response;

            const { contractType } = dataContract || {};

            if (contractType === 'compraVentaPropiedad') {
                response = await generarParteNotarial(newData, contractType);
            } 
            else if (["RS", "SCRL", "SAC", "asociacion"].includes(contractType)) {
                const tipo = contractType === 'RS' ? 'razonSocial' : contractType?.toLowerCase();
                response = await generarParteNotarialConstitucion(newData, tipo);
            }

            if (!response.ok) {
                const responseJSON = await response.json();
                console.log(responseJSON);
                return;   
            }
            
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            setViewParteNotarial(url);
            toast("Se genero la parte notarial correctamente", {type : 'success', position : 'bottom-right'}); 
        } catch (err) {
            console.log(err);
            
        } finally {
            setLoadingParteNotarial(false);
        }
    }
    
    if (viewParteNotarial) {
        return(
            <section className='max-w-4xl mx-auto mt-8 h-screen w-ful p-4 rounded-lg shadow'>
            <div className='p-4 w-full border-b border-b-gray-300 flex flex-row justify-between items-center'>
                <Title1 className='text-xl'>PDF de la parte de notarial</Title1>
                <p>Descargalo si es necesario</p>
            </div>
            <embed
                src={viewParteNotarial}
                className='w-full h-screen border mt-4 rounded'
                type='application/json'
                title='Vista previa de PDF Parte Notarial'
            />
            
        </section>
        )
    } else{
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
                <section className='bg-white p-4 shadow rounded-lg mt-4'>
                    <Title1 className='text-xl'>Parte Notarial Generada</Title1>
                    {
                        viewParteNotarial ?
                        (
                            <embed
                                src={viewParteNotarial}
                                className='w-full h-96 border mt-4 rounded'
                                type='application/json'
                                title='Vista previa de PDF Parte Notarial'
                            />
                        ) :
                        <section className='w-full border border-gray-200 border-dotted rounded-sm h-40 flex justify-center items-center'>
                            <p className='font-bold'>No se ha generado la parte notarial aún</p>
                        </section>
                    }
                </section>
                <Button
                onClick={handleClickGenerateNotarialPart}
                    className={"w-full mt-4"}
                    disabled={loadingParteNotarial}
                >
                    {loadingParteNotarial ? <Loader2 className='animate-spin'/> : <p>Generar parte notarial</p>}
                </Button>
            </div>
          )
    }
}
