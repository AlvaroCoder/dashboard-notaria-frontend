'use client';
import React, { useState } from 'react'
import Title1 from '../elements/Title1';
import CardDetailContract from '../Cards/CardDetailContract';
import { Button } from '../ui/button';
import { filtrarCampos, reducCompraVentaJSON } from '@/lib/formatterJSON';
import { useFetchViewEscritura } from '@/hooks/useFetchViewEscrtirua';
import { Loader2 } from 'lucide-react';
import { generarParteNotarial, generarParteNotarialConstitucion } from '@/lib/apiConnections';
import SignCompraVenta from '../Forms/SignCompraVenta';
import Separator2 from '../elements/Separator2';
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
    const [dataFormated, setDataFormated] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChangeDataFormated =() => {
        // Logic to generate notarial part
        const filtrado = filtrarCampos(dataContract);
        setDataFormated(filtrado)
    };

    const handleSubmitParteNotarial=async(data)=>{
        try {
            setLoading(true);
            let typeContract;

            if (dataContract?.contractType === 'compraVentaPropiedad') {
                typeContract = 'inmueble';
            }
            if (dataContract?.contractType === 'compraVentaVehiculo') {
                typeContract = 'vehiculo';
            }
            else{
                typeContract = dataContract?.contractType;
            }
            const response = ['asociacion', 'razonSocial', 'scrl', 'sac'].includes(dataContract?.contractType) ? 
            await generarParteNotarialConstitucion(data, typeContract) : 
            await generarParteNotarial(data, typeContract);
            const responseBlob = await response.blob();
            setViewParteNotarial(URL.createObjectURL(responseBlob));

            toast("Se genero con exito la parte notarial",{
                type : 'success',
                position : 'bottom-right'
            });

        } catch (err) {
            console.log(err);
            toast("Surgio un error de la API",{
                type : 'error',
                position : 'bottom-center'
            })
        } finally {
            setLoading(false)
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
                        <Title1 className='text-3xl'>{title}</Title1>
                        <p>{description}</p>
                    </div>
                    
                </section>
                <Separator2/>
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
                    <Title1 className='text-xl'>Firmas de la Parte Notarial</Title1>
                    <Separator2/>
                    {
                        dataFormated ?
                        (
                            <section>
                                <SignCompraVenta
                                    data={dataFormated}
                                    onGenerateParteNotarial={handleSubmitParteNotarial}
                                />
                            </section>
                        ) :
                        <section className='w-full border border-gray-200 border-dotted rounded-sm h-40 flex justify-center items-center'>
                            <p className='font-bold'>No se ha generado la parte notarial aún</p>
                        </section>
                    }
                </section>
                {
                    !dataFormated && <Button
                    onClick={handleChangeDataFormated}
                        className={"w-full mt-4"}
                        disabled={loadingParteNotarial}
                    >
                        {loadingParteNotarial ? <Loader2 className='animate-spin'/> : <p>Generar parte notarial</p>}
                    </Button>
                }
            </div>
          )
    }

}
