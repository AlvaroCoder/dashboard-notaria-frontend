'use client';
import { parseTextoToJSON } from '@/common/parserText';
import { Button } from '@/components/ui/button';
import EditorView from '@/components/Views/EditorView';
import { useEditorContext } from '@/context/ConextEditor';
import { useContextCard } from '@/context/ContextCard';
import { useContratoContext } from '@/context/ContratosContext';
import { getDataContractByIdContract, getMinutaFile, processDataMinuta } from '@/lib/apiConnections';
import { useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function RenderPageScript() {
    const [loading, setLoading] = useState(true);

    const searchParams = useSearchParams();
    const idContract = searchParams.get("idContract");
    
    const {activeStep }= useContextCard();
    const {inicializarBloquesMinuta} = useContratoContext();
    const {agregarBloques} = useEditorContext();

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
                })
            } catch (err) {
                console.log(err);
                toast("Erro con la vista de minuta",{
                    type :'error',
                    position : 'bottom-center'
                })
            } finally{
                setLoading(false);
            }
        }   
        getDataMinutaFile();
    },[idContract]);

    if (loading) {
        return <p>Cargando ...</p>
    }
    else{
        switch (activeStep) {
            case 0:
                return(
                    <main className='w-full min-h-screen overflow-y-auto flex-1'>
                        <EditorView/>
                        <Button
                            className={'w-full mt-4'}
                        >
                            Continuar
                        </Button>
                    </main>
                )
            case 1:
                return(
                    <main>
                        <p>Caso1</p>
                    </main>
                )
        
            case 2:
                return(
                    <main>
                        <p>Caso 2</p>
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
