'use client';
import { cn } from '@/lib/utils';
import React, { useState } from 'react'
import Title1 from '../elements/Title1';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import UploadMinuta from '../elements/ButtonUploadMinuta';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

export default function FormUploadMinuta2({
    handleUploadMinuta=()=>{},
    loading=false
}) {
    const [detailsMinuta, setDetailsMinuta] = useState({
        number : '',
        namePlace : '',
        districtPlace : ''
    });
    const [minuta, setMinuta] = useState(null);

    const handleChange=(e)=>{
        const target = e.target;
        setDetailsMinuta({
            ...detailsMinuta,
            [target.name] : target.value
        });
    }
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
                    <Title1>Nombre del lugar</Title1>
                    <p>Ingresa el nombre del lugar</p>
                </div>
                <TextField
                    label="Nombre del lugar"
                    type='text'
                    name="namePlace"
                    value={detailsMinuta.namePlace}
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
                <Title1>Sube la minuta</Title1>
                <p>Sube la minuta en formato PDF</p>
                <UploadMinuta
                    handleSetFile={(data)=>setMinuta(data)}
                />
                <Button
                    disabled={!minuta}
                    className='mt-4 w-full'
                    onClick={()=>handleUploadMinuta(minuta, detailsMinuta)}
                >
                    {loading ? <Loader2 className='animate-spin'/> : <p>Subir Minuta</p>}
                </Button>
            </section>
        </section>
    </div>
  )
};