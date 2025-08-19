'use client';
import { cn } from '@/lib/utils';
import React, { useState } from 'react'
import Title1 from '../elements/Title1';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import CardAviso from '../Cards/CardAviso';
import UploadMinuta from '../elements/ButtonUploadMinuta';

export default function FormUploadMinuta2({
    handleUploadMinuta=()=>{},
    loading=false,
    dataPreviewPdf=null,
    dataPreviewWord=null,
    numberMinuta='',
    districtPlaceMinuta=''
}) {
    const [detailsMinuta, setDetailsMinuta] = useState({
        number : numberMinuta,
        namePlace : 'Notaria Rojas',
        districtPlace : districtPlaceMinuta
    });
    const [minutaPdf, setMinutaPdf] = useState(null);
    
    const handleChange=(e)=>{
        const target = e.target;
        setDetailsMinuta({
            ...detailsMinuta,
            [target.name] : target.value
        });
    };
  return (
    <div className='col-span-2'>
        <section className={cn('flex flex-col gap-4')}>
            <section className='p-8 w-full bg-white shadow rounded-sm'>
                <div className='mb-4'>
                    <Title1>Numero de la minuta</Title1>
                    <p>Ingresa el numero de la minuta a procesar</p>
                </div>
                <TextField 
                    label="Numero de la minuta" 
                    type='number' 
                    name="number"
                    value={detailsMinuta.number}
                    onChange={handleChange}
                    fullWidth
                    required
                />
                <Divider className='my-4' style={{marginTop : 10, marginBottom : 10}} />
                <div className='mb-4'>
                    <Title1>Distrito</Title1>
                    <p>Ingresa el distrito del lugar</p>
                </div>
                <TextField 
                    label="Distrito del lugar"
                    type='text'
                    name='districtPlace'
                    value={detailsMinuta.districtPlace}
                    onChange={handleChange}
                    fullWidth
                    required
                />
            </section>
            <section className='bg-white p-8 shadow rounded-sm'>
                <Title1>Sube la Minuta en PDF</Title1>
                <p>Sube la minuta en formato .pdf</p>
                <div className='my-2 space-y-6'>
                    <CardAviso
                        advise='LA MINUTA ES DEL CLIENTE, SE GUARDARÁ TAL CUAL EN LA BASE DE DATOS'
                    />
                </div>
                <UploadMinuta
                    dataPreview={dataPreviewPdf}
                    handleSetFile={(data)=>setMinutaPdf(data)}
                />
                <Button
                    className='mt-4 w-full'
                    onClick={()=>handleUploadMinuta(detailsMinuta, minutaPdf)}
                >
                    {loading ? <Loader2 className='animate-spin'/> : <p>Subir Minuta</p>}
                </Button>
            </section>

        </section>
    </div>
  )
};