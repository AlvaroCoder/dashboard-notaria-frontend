'use client';
import React, { useState } from 'react'
import Title1 from '../elements/Title1';
import CardDetailContract from '../Cards/CardDetailContract';
import { Button } from '../ui/button';
import { filtrarCampos } from '@/lib/formatterJSON';
import { Loader2 } from 'lucide-react';
import { generarParteNotarial, generarParteNotarialConstitucion } from '@/lib/apiConnections';
import SignCompraVenta from '../Forms/SignCompraVenta';
import Separator2 from '../elements/Separator2';
import { toast } from 'react-toastify';
import SignConstitucion from '../Forms/SignConstitucion';
import FramePdfWord from '../elements/FramePdfWord';
import { useRouter } from 'next/navigation';

export default function View4ContractParteNotarial({
    idContract="",
    dataContract={},
    loadingDataClient=false,
    client=null,
    title="Detalles del contrato",
    description="Informacion del contrato",
}) {
    const router = useRouter();

    const [loadingParteNotarial, setLoadingParteNotarial] = useState(false);
    const [viewParteNotarial, setViewParteNotarial] = useState(null);
    const [dataFormated, setDataFormated] = useState(null);

    const handleChangeDataFormated =() => {
        // Logic to generate notarial part
        const filtrado = filtrarCampos(dataContract);
        setDataFormated(filtrado)
    };

    const handleSubmitParteNotarial=async(data)=>{
        try {
            setLoadingParteNotarial(true);            
            let typeContract;

            if (dataContract?.contractType === 'compraVentaPropiedad') {
                typeContract = 'inmueble';
            } else if (dataContract?.contractType === 'compraVentaVehiculo') {
                typeContract = 'vehiculo';
            } else {
                typeContract = dataContract?.contractType.toLowerCase() === 'rs' ? 'razonSocial' : dataContract?.contractType?.toLowerCase();
            }
            console.log(data);
            console.log(typeContract);
            
           
            const response = ['asociacion', 'razonSocial', 'rs', 'scrl', 'sac'].includes(dataContract?.contractType?.toLowerCase()) 
                ? await generarParteNotarialConstitucion(data, typeContract) 
                : await generarParteNotarial(data, typeContract);
            
            if (!response.ok || response.status == 404) {
                toast("Error al generar la partida notarial",{
                    type : 'error',
                    position : 'bottom-right'
                });

                console.log(await response.json());
                
                return;
            }

            const responseBlob = await response.blob();
            setViewParteNotarial(URL.createObjectURL(responseBlob));

            router.push('/dashboard/contracts');

            toast("Se genero con exito la parte notarial",{
                type : 'success',
                position : 'bottom-right'
            });

        } catch (err) {
            toast("Surgio un error de la API",{
                type : 'error',
                position : 'bottom-center'
            })
        } finally {
            setLoadingParteNotarial(false)
        }
    }
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
                <FramePdfWord
                    directory={dataContract?.documentPaths?.escrituraPath}
                />
            </section>
            <section className='bg-white p-4 shadow rounded-lg mt-4'>
                <Title1 className='text-xl'>Firmas de la Parte Notarial</Title1>
                <Separator2/>
                {
                    dataFormated ?
                    (
                        <section>
                            {['asociacion', 'sac', 'razonsocial', 'rs', 'scrl'].includes(dataContract.contractType?.toLowerCase()) ?
                            <SignConstitucion
                                data={dataFormated}
                                loading={loadingParteNotarial}
                                onGenerateParteNotarial={handleSubmitParteNotarial}
                            />: 
                            <SignCompraVenta
                                data={dataFormated}
                                loading={loadingParteNotarial}
                                onGenerateParteNotarial={handleSubmitParteNotarial}
                            />    
                        }
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
