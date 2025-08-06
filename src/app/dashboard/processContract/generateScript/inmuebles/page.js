'use client';
import { parseTextoToJSON } from '@/common/parserText';
import FormStepper from '@/components/Forms/FormStepper';
import FormViewerPdfEscritura from '@/components/Forms/FormViewerPdfEscritura';
import { Button } from '@/components/ui/button';
import EditorView from '@/components/Views/EditorView';
import { useEditorContext } from '@/context/ConextEditor';
import { useContratoContext } from '@/context/ContratosContext';
import { getDataContractByIdContract, getMinutaFile, processDataMinuta } from '@/lib/apiConnections';
import { useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function RenderPageScript() {
    const [loading, setLoading] = useState(true);

    const searchParams = useSearchParams();
    const idContract = searchParams.get("idContract");
    
    const [activeStep, setActiveStep] = useState(0);
    
    const pushActiveStep=()=>{
        setActiveStep(activeStep+1);
    }
    const {
        
        inicializarBloquesMinuta, 
        agregarBloqueMinuta,
        subirEvidencias,
        subirInformacionMinuta
    } = useContratoContext();
    const {agregarBloques, parserData} = useEditorContext();
    
    useEffect(()=>{
        async function getDataMinutaFile() {
            try {
                const responseContract = await getDataContractByIdContract(idContract);                
                const responseContractJSON = await responseContract.json();
                const contractDirectory = responseContractJSON?.data?.minutaDirectory;
                
                const minuta = await getMinutaFile(contractDirectory);
                const blob = await minuta.blob();

                const newFormData = new FormData();
                newFormData.append('minutaFile', blob)

                const dataProcess = await processDataMinuta(newFormData);
                const dataProcessJSON = await dataProcess.json();
                
                const parserText = parseTextoToJSON(dataProcessJSON?.minuta_content);
                inicializarBloquesMinuta(parserText?.data);
                agregarBloques(parserText?.data);
                toast("Data procesada correctamente",{
                    type : 'success',
                    position : 'bottom-right'
                });

            } catch (err) {
                console.log(err);
                toast("Erro con la vista de minuta",{
                    type :'error',
                    position : 'bottom-center'
                })
            } finally{
                setLoading(false);
            }
        };   
        getDataMinutaFile();
    },[idContract]);

    const handleSaveData=async(dataImagesMinuta, vendedores, compradores, dataSend)=>{
        try {
            setLoading(true);
            const imagesEvidencias = await subirEvidencias(dataImagesMinuta);
            await subirInformacionMinuta(idContract, vendedores, compradores,{
                caption : dataSend?.paymentMethod,
                evidences : imagesEvidencias
            });
            pushActiveStep();
        } catch (err) {
            
        } finally{
            setLoading(false);
        }
    }

    if (loading) {
        return <p>Cargando ...</p>
    }
    else{
        switch (activeStep) {
            case 0:
                return(
                    <main className='w-full min-h-screen overflow-y-auto flex-1 pb-4'>
                        <EditorView/>
                        <div className='p-4'>
                        <Button
                            onClick={()=>{
                                const parse = parserData();
                                agregarBloqueMinuta(parse);
                                pushActiveStep();
                            }}
                            className={'w-full mt-4'}
                        >
                            Continuar
                        </Button>
                        </div>
                    </main>
                )
            case 1:
                return(
                    <main className='h-screen overflow-y-auto w-full p-8'>
                       <FormStepper
                        handleSaveData={handleSaveData}
                       />
                    </main>
                )
            case 2:
                return(
                    <main>
                        <FormViewerPdfEscritura/>
                    </main>
                )
        }
    }
}

export default function Page() {
  return (
    <Suspense fallback={<p>Cargando ...</p>}>
        <RenderPageScript/>
    </Suspense>
  )
}
