'use client';
import { cn } from '@/lib/utils';
import React, { useState } from 'react'
import Title1 from '../elements/Title1';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import { formatDateToYMD } from '@/lib/fechas';
import { Button } from '../ui/button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function FormUploadMinuta2({
    handleUploadMinuta=()=>{},
    backActiveStep=()=>{},
    numberMinuta='',
    districtPlaceMinuta='',
}) {
    const [detailsMinuta, setDetailsMinuta] = useState({
        number : numberMinuta,
        namePlace : 'Notaria Rojas',
        districtPlace : districtPlaceMinuta,
        creationDay : formatDateToYMD(new Date())
    });
    
    const [dataLawyer, setDataLawyer] = useState({
        firstName : "",
        lastName : "",
        registrationNumber : ""
    });

    const handleChange=(e)=>{
        const target = e.target;
        setDetailsMinuta({
            ...detailsMinuta,
            [target.name] : target.value
        });
    };

    const handleChangeLawyer=(e)=>{
        const target = e.target;
        setDataLawyer({
            ...dataLawyer,
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
                <Divider className='my-4' style={{marginTop : 10, marginBottom : 10}} />
                <div className='mb-4'>
                    <Title1>Fecha de la minuta</Title1>
                    <p>Ingresa la fecha de creación de la minuta</p>
                </div>
                <TextField
                        label="Fecha de la minuta"
                        type='date'
                        className='mt-6'
                        value={detailsMinuta?.creationDay}
                        onChange={handleChange}
                        name='creationDay'
                        fullWidth
                        required
                    />
            </section>
            <section className='w-full p-8 bg-white shadow rounded-sm flex flex-col gap-4'>
                <div>
                    <Title1 className='text-xl'>Subir información del abogado</Title1>
                    <p>Información importante para guardar al abogado</p>
                </div>
                <TextField
                    label="Nombre del abogado"
                    value={dataLawyer.firstName}
                    className='mt-6'
                    name='firstName'
                    onChange={handleChangeLawyer}
                    fullWidth
                    required
                />
                <TextField
                    label="Apellido del abogado"
                    value={dataLawyer.lastName}
                    className='mt-6'
                    name='lastName'
                    onChange={handleChangeLawyer}
                    fullWidth
                    required
                />
                <TextField
                    label="Número de colegiatura"
                    value={dataLawyer.registrationNumber}
                    className='mt-6'
                    type='number'
                    name='registrationNumber'
                    onChange={handleChangeLawyer}
                    fullWidth
                    required
                />
            </section>
            <div className='flex flex-row gap-4 mt-4'>
                <Button 
                    onClick={backActiveStep}
                    variant={"outline"}
                >
                    Regresar
                </Button>
                <Button
                    className={"flex-1 "}
                    onClick={()=>{
                        handleUploadMinuta(detailsMinuta, dataLawyer);
                    }}
                >
                    Continuar <ArrowForwardIcon className='ml-2' />
                </Button>
            </div>
        </section>
    </div>
  )
};