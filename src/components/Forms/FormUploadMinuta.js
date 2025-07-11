'use client'
import { useContextCard } from '@/context/ContextCard'
import React, { useState } from 'react'
import Title1 from '../elements/Title1';
import UploadMinuta from '../elements/ButtonUploadMinuta';
import { Button } from '../ui/button';
import { toast } from 'react-toastify';
import { useEditorContext } from '@/context/ConextEditor';
import { parseTextoToJSON } from '@/common/parserText';
import { useContratoContext } from '@/context/ContratosContext';
import EditorView from '../Views/EditorView';
import { cn } from '@/lib/utils';
import { TextField } from '@mui/material';

export default function FormUploadMinuta() {
    const {client, continuarCompletarFormulario } = useContextCard();
    const {agregarBloques, parserData} = useEditorContext();
    const {
        inicializarBloquesMinuta, 
        agregarBloqueMinuta, 
        handleChangeNumeroMinuta, 
        handleChangeDataPreMinuta, 
        dataPreMinuta, 
        handleChangeDataPreMinutaFileLocation,
        handleChangePreMinutaDate
    }=useContratoContext();

    const [isEditorMode, setIsEditorMode] = useState(false);
    const [loading, setLoading] = useState(false);

    const [minuta, setMinuta] = useState(null);
    const handleUploadMinuta = async() => {
        if (!minuta) {
            toast.error('Por favor, sube un archivo PDF de la minuta.');
            return;
        }
        try {
            setLoading(true);
            const newFormData = new FormData();
            newFormData.append('minutaFile', minuta);
            const response = await fetch('http://localhost:8000/contracts/sendMinuta',{
                method : 'POST',
                body : newFormData,
                redirect : 'follow'
            });
    
            const jsonResponseUpload = await response.json();
            const fileLocation = jsonResponseUpload?.fileLocation;
            
            handleChangeDataPreMinutaFileLocation(fileLocation);

            const responseProcessData = await fetch('http://localhost:8000/contracts/processMinuta',{
                method : 'POST',
                body : newFormData,
                redirect : 'follow'
            });
            
            const responseProcessDataJson = await responseProcessData.json();
            const parserText = parseTextoToJSON(responseProcessDataJson?.minuta_content);
            inicializarBloquesMinuta(parserText?.data);
            agregarBloques(parserText?.data);
            setIsEditorMode(true);

        } catch (err) {
            toast("Error con la vista de minuta",{
                type : 'error'
            });

        }finally{
            setLoading(false)
        }
    };

    if (loading ) {
        return(<p>Cargando ....</p>)
    }
 if (isEditorMode) {
    return(
    <div className='relative h-screen overflow-y-auto w-full flex-1'>
        <EditorView/>
        <Button 
        onClick={()=>{
            const dataParseada = parserData();
            handleChangePreMinutaDate();
            agregarBloqueMinuta(dataParseada);
            continuarCompletarFormulario();

            console.log(dataPreMinuta);
            
        }}
        className={'w-full mt-4'}>
            Continuar
        </Button>
    </div>)
 }
 return (
    <div className='p-6 grid grid-cols-1 lg:grid-cols-3 gap-2'>

        <section className={cn('col-span-2 flex flex-col gap-4')}>
            <section className='p-8 w-full bg-white shadow rounded-sm  '>
                <div className='mb-4'>
                    <Title1>Numero de minuta</Title1>
                    <p>Ingresar el numero de la minuta que se va a procesar</p>
                </div>
                <TextField label="Numero minuta" type='number' onChange={(e)=>handleChangeNumeroMinuta(e.target.value)}  fullWidth/>
            </section>
            <section className='bg-white p-8 shadow rounded-sm'>
                <Title1 className='text-2xl'>Sube la minuta</Title1>
                <p>Sube la minuta en formato PDF</p>
                <UploadMinuta
                handleSetFile={(data)=>setMinuta(data)}
                />
                <Button
                    onClick={handleUploadMinuta}
                    className={"w-full mt-2"}
                    disabled={!minuta}
                >
                    Subir Minuta
                </Button>
            </section>

        </section>
        <div className='hidden  col-span-1 bg-white p-4 h-fit shadow rounded-sm lg:flex flex-col gap-4'>
            <section className=''>
                <Title1 className='text-xl'>Cliente Seleccionado : </Title1>
                <h1 className='text-sm'>Nombre : {client?.firstName || '-'} {client?.lastName || ''}</h1>
                <h1 className='text-sm'>Usuario : {client?.userName || '-'} </h1>
                <p className='p-2 text-sm rounded-lg bg-green-100 w-fit'>Cliente</p>
            </section>
            <section className='w-full'>
                <Button
                    className={"w-full py-4"}
                    onClick={() => {}}
                >
                    Cambiar Cliente
                </Button>
            </section>
        </div>
    </div>
  )
};
