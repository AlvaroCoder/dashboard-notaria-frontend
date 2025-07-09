'use client';
import { cn } from '@/lib/utils';
import React, { useState } from 'react'
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import ErrorCard from '../elements/ErrorCard';
import Title1 from '../elements/Title1';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';

const getMaritalOptions = (gender) => {
    if (gender === 'Femenino') return ['Soltera', 'Casada', 'Viuda', 'Divorciada'];
    if (gender === 'Masculino') return ['Soltero', 'Casado', 'Viudo', 'Divorciado'];
    return [];
};

export default function FormPerson({
    data=[],
    handleChange=()=>{},
    type='venta',
    handleDelete=()=>{},
    errores=[],
}) {
    const nombreProceso = type === 'venta' ? 'Vendedor' : 'Comprador';
    const [bienesMancomunados, setBienesMancomunados] = useState(true);

  return data?.map((person, idx)=>
        <section key={idx} className={cn('min-w-3xl relative', 'bg-white shadow rounded-lg ', person?.maritalStatus?.value === 'Casado' || person?.maritalStatus?.value === 'Casada' ? 'flex flex-row' : '')}>
            {
                idx > 0 &&
                <Button 
                    variant={"outline"}
                    className='absolute top-0 px-8 py-5 right-0 bg-[#5F1926] cursor-pointer hover:bg-red-400 rounded-full text-white'
                    onClick={()=>handleDelete(idx, type === 'venta' ? 'vendedor' : 'comprador')}
                >
                    <Trash2/>
                </Button>
            }
            {
                (errores?.length > 0 && errores[idx]?.error) &&
                <div className='w-full p-4'>
                    <ErrorCard
                        title='Error en el formulario'
                        description={errores[idx]?.value}
                    />
                </div>
            }
            <div className='flex-1 p-8 mb-6'>
                <div className='mb-4'>
                    <Title1 className='text-2xl'>{nombreProceso} {idx+1}</Title1>
                    <p>Información del {nombreProceso}</p>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                    <TextField label="Primer Nombre" value={person.firstName} onChange={(e) => handleChange(idx, 'firstName', e.target.value, type)} fullWidth required />
                    <TextField label="Apellido" value={person.lastName} onChange={(e) => handleChange(idx, 'lastName', e.target.value, type)} fullWidth required />
                    <TextField label="DNI" value={person.dni} onChange={(e) => handleChange(idx, 'dni', e.target.value, type)} type='number' fullWidth required/>
                    <FormControl>
                        <InputLabel>Género</InputLabel>
                        <Select
                            value={person?.gender}
                            label="Genero"
                            onChange={(e)=>handleChange(idx, 'gender', e.target.value, type)}
                        >
                            <MenuItem value="Masculino">Masculino</MenuItem>
                            <MenuItem value="Femenino">Femenino</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField label="Nacionalidad" value={person.nationality} onChange={(e) => handleChange(idx, 'nationality', e.target.value, type)}  fullWidth required />
                    <TextField label="Edad" name="age" type="number" value={person.age} onChange={(e) => handleChange(idx, 'age', e.target.value, type)} fullWidth required/>
                    <TextField label="Trabajo" value={person.job} onChange={(e) => handleChange(idx, 'job', e.target.value, type)} fullWidth  required/>
                    <section className='w-full flex flex-row gap-2'>
                        <FormControl fullWidth>
                            <InputLabel>Estado Civil</InputLabel>
                            <Select
                                value={person?.maritalStatus?.value || ''}
                                label="Estado Civil"
                                onChange={(e)=>handleChange(idx, 'maritalStatus', e.target.value, type)}
                            >
                                {
                                    getMaritalOptions(person?.gender)?.map((option, idx)=>(
                                        <MenuItem key={idx} value={option}>{option}</MenuItem>
                                    ))
                                }       
                            </Select> 
                        </FormControl>
                    </section>
                    <div className='col-span-2'>
                        <TextField label="Distrito"  value={person.address?.district} onChange={(e) => handleChange(idx, 'district', e.target.value, type)} fullWidth required/>
                    </div>
                    <div className='col-span-2'> 
                        <TextField label="Provincia" value={person.address?.province} onChange={(e) => handleChange(idx, 'province', e.target.value, type)} fullWidth required />
                    </div>   
                    <div className='col-span-2'>
                        <TextField label="Departamento" value={person.address?.department} onChange={(e) => handleChange(idx, 'department', e.target.value, type)}  fullWidth required/>
                    </div>
                    <div className='col-span-2'>
                        <TextField label="Direccion de Domicilio" value={person.address?.name} onChange={(e) => handleChange(idx, 'address', e.target.value, type)} fullWidth required/>
                    </div>
                </div>
                
            </div>
            <div className='flex-1 p-8 mb-6 border-l border-gray-200'>
                {
                    (person?.maritalStatus?.value === 'Casado' || person?.maritalStatus?.value === 'Casada') && (
                        <section>
                            <Title1 className='text-2xl'>Información del Conyuge</Title1>
                            <p className='text-sm'>Información del conyuge del {nombreProceso}</p>
                            <div className='grid grid-cols-2 gap-4 mt-2'>
                                <Button
                                    variant={bienesMancomunados ? "" : "outline"}
                                    onClick={()=>setBienesMancomunados(true)}
                                    
                                >
                                    Con bienes mancomunados
                                </Button>
                                <Button
                                    variant={!bienesMancomunados ? "" : "outline"}
                                    onClick={()=>setBienesMancomunados(false)}
                                >
                                    Con bienes separados
                                </Button>
                            </div>
                            <div className='grid grid-cols-2 gap-4 mt-8'>
                                <TextField disabled={!bienesMancomunados} label="Primer Nombre" />
                                <TextField disabled={!bienesMancomunados} label="Apellido" />
                                <TextField disabled={!bienesMancomunados} label="DNI" type='number' />
                                <FormControl disabled={true}>
                                    <InputLabel>Género</InputLabel>
                                    <Select value={person?.gender}>
                                        <MenuItem value={person?.gender}>{person?.gender === 'Masculino' ? 'Femenino' : 'Masculino'}</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField disabled={!bienesMancomunados} label="Nacionalidad"  />
                                <TextField disabled={!bienesMancomunados} label="Edad" />
                                <TextField disabled={!bienesMancomunados} label="Trabajo"  />
    
                            
                            </div>
                        </section>
                )
                }
                </div>
        </section>
    )
}
