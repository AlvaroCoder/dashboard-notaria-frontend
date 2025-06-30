'use client'
import Title1 from '@/components/elements/Title1';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FormControl, InputLabel, MenuItem, Select, Step, StepLabel, Stepper, TextField } from '@mui/material';
import React, { createContext, useContext, useState } from 'react'

const ContextCard = createContext({
    tipoProceso : 'compra',
    isProcessStart : false,
    establecerTipoProceso : ()=>{}
});

const useContextCard = ()=>useContext(ContextCard);

function CardRequirements({
    nombre,
    descripcion,
    requisitos=[],
    slug
}) {
    const {establecerTipoProceso} = useContextCard();
    return(
        <section className='p-2 w-full max-w-[450px] bg-[#102945] rounded-sm shadow-sm'>
            <div
                className='rounded-sm bg-white p-4  flex flex-col gap-2'
            >
                <Title1>{nombre}</Title1>
                <p>
                    {descripcion}
                </p>
                <Button
                    className={"bg-[#102945] w-full hover:bg-[#0C1019]"}
                    onClick={()=>{
                        console.log('Has hecho click');
                        console.log(slug);
                        
                        establecerTipoProceso(slug)
                    }}
                >
                    Iniciar Proceso
                </Button>
            </div>  
            <div className='text-white p-4'>
                <h1 className='my-2'>Requisitos:</h1>
                <ul className='list-disc pl-4'>
                    {
                        requisitos?.map((item, idx)=><li key={idx} className='ml-0 p-0 left-0'>{item}</li>)
                    }
                </ul>
            </div>
        </section>
    )
}

function FormStepper() {
    const {tipoProceso} = useContextCard();
    const stepsCompra = ['Comprador(es)','Vendedor(es)', 'Comprobante de Pago' , 'Minuta'];
    const stepsVenta = ['Vendedor(es)', 'Comprador(es)', 'Comprobante de Pago' , 'Minuta'];
    const [activeStep, setActiveStep] = useState(0);
    const [compradores, setCompradores] = useState([
        {
            firstName: '',
            lastName: '',
            dni: '',
            gender: 'Masculino',
            nationality: '',
            age: '',
            job: '',
            maritalStatus: {
              value : 'Soltero'
            },
            address: {
              district : "",
              province : "",
              department : "",
              name : ""
            },
            job :''
        }
    ]);

    const [vendedores, setVendedores] = useState([]);
    const [dataImagesMinuta, setDataImagesMinuta] = useState([]);

    const handleChange=(index, field, value, type='venta')=>{
        const list = type === 'venta' ? [...vendedores] : [...compradores];
        if (field === 'district' || field === 'province' || field === 'department' || field === 'address') {
            field === 'address' ? list[index]['address']['name'] = value : list[index]['address'][field] = value;;
        }
        else if (field === 'maritalStatus') {
            list[index]['maritalStatus']['value'] = value;
          }
          else{
            list[index][field] = value;
          }
        type === 'venta' ? setVendedores(list) : setCompradores(list);
    }

    const getMaritalOptions = (gender) => {
        if (gender === 'Femenino') return ['Soltera', 'Casada', 'Viuda', 'Divorciada'];
        if (gender === 'Masculino') return ['Soltero', 'Casado', 'Viudo', 'Divorciado'];
        return [];
    };

    const renderStepper=(steps=[], active)=>{
        return(
            <Stepper activeStep={active} alternativeLabel>
                {
                    steps?.map((label)=>(
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))
                }
            </Stepper>
        )
    }


    const renderPersonForm=(data=[], handleChange)=>{
        const nombreProceso = tipoProceso === 'venta' ? 'Vendedor' : 'Comprador';
        return data?.map((person, idx)=>
            <section key={idx} className={cn('min-w-3xl', 'bg-white shadow rounded-lg')}>
                <div className='p-8 mb-6'>

                    <div className='mb-4'>
                        <Title1 className='text-2xl'>{nombreProceso}</Title1>
                        <p>Información del {nombreProceso}</p>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <TextField label="Primer Nombre" value={person.firstName} onChange={(e) => handleChange(idx, 'firstName', e.target.value, tipoProceso)} fullWidth required />
                        <TextField label="Apellido" value={person.lastName} onChange={(e) => handleChange(idx, 'lastName', e.target.value, tipoProceso)} fullWidth required />
                        <TextField label="DNI" value={person.dni} onChange={(e) => handleChange(idx, 'dni', e.target.value, tipoProceso)} type='number' fullWidth required/>
                        <FormControl>
                            <InputLabel>Género</InputLabel>
                            <Select
                                value={person?.gender}
                                label="Genero"
                            >
                                <MenuItem value="Masculino">Masculino</MenuItem>
                                <MenuItem value="Femenino">Femenino</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField label="Nacionalidad" value={person?.nationality} />
                        <TextField label="Edad" value={person.age} />
                        <TextField label="Trabajo" value={person?.job} />
                        <FormControl fullWidth>
                            <InputLabel>Estado Civil</InputLabel>
                            <Select
                                value={person?.maritalStatus?.value}
                                label="Estado Civil"
                                
                            >
                                {
                                    getMaritalOptions(person?.gender)?.map((option, idx)=>(
                                        <MenuItem key={idx}>{option}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                        <div className='col-span-2'>
                            <TextField label="Distrito" value={person?.address?.district} fullWidth required/>
                        </div>
                        <div className='col-span-2'> 
                            <TextField label="Provincia" value={person?.address?.province} fullWidth required/>
                        </div>
                        <div className='col-span-2'>
                            <TextField label="Departamento" value={person?.address?.department} fullWidth required />
                        </div>
                        <div className='col-span-2'>
                            <TextField label="Direccion de domicilio" value={person?.address?.name} fullWidth required />
                        </div>
                    </div>
                </div>

            </section>
        )
    }
    switch (tipoProceso) {
        case 'compra':
            return (
                <div className='p-6'>
                    {renderStepper(stepsCompra, activeStep)}
                    <div className='mt-8'>
                        {
                            activeStep === 0 && (
                                <>
                                  {renderPersonForm(compradores, handleChange)}  
                                    <section className='flex flex-row gap-2'>
                                        <Button
                                            className={"flex-1 py-4"}
                                        >
                                        Agregar Comprador
                                        </Button>
                                    </section>
                                </>
                            )
                        }
                    </div>
                    <div className="flex justify-between mt-6">
                        <Button disabled={activeStep === 0} onClick={() => setActiveStep((prev) => prev - 1)}>
                            Atrás
                        </Button>
                        <Button
                        >
                            {activeStep === stepsCompra.length - 1 ? 'Finalizar' : 'Siguiente'}
                        </Button>
                    </div>
                </div>
            )
        case 'venta':
            return (
                <div>
                    {renderStepper(stepsVenta, activeStep)}
                    <section>
                        {
                            activeStep === 0 && (
                                <>
                                    {renderPersonForm(vendedores)}
                                    <section className='flex flex-row gap-2'>
                                        <Button
                                            className={"flex-1 py-4"}
                                        >
                                        Agregar Vendedor
                                        </Button>
                                    </section>
                                </>
                            )
                        }
                    </section>
       
                    <div className="flex justify-between mt-6">
                        <Button disabled={activeStep === 0} onClick={() => setActiveStep((prev) => prev - 1)}>
                        Atrás
                        </Button>
                        <Button
                        >
                        {activeStep === stepsVenta.length - 1 ? 'Finalizar' : 'Siguiente'}
                        </Button>
                    </div>
                </div>
            )
    }
}

function RenderCardsFormStepper() {
    const {isProcessStart} = useContextCard();
    const formsInmueble = [
        {
            nombre : "Compra", 
            slug : 'compra',
            descripcion : "Esto es una descripcion para los procesos de compra de inmuebles", 
            requisitos :[
                "Requisito 1",
                "Requisito 2",
                "Requisito 3",
                "Requisito 4"
            ]
        },
        {
            nombre : "Venta",
            slug : 'venta',
            descripcion : "Esto es una descripcion para los procesos de venta",
            requisitos : [
                "Requisitos 1",
                "Requisitos 2",
                "Requisito 3"
            ]
        }
    ]
    if (!isProcessStart) {
        return (
            <div className='w-full'>
                <Title1
                    className='text-4xl font-bold'
                >
                    Selecciona la operación</Title1>
                <section className='flex flex-row items-start justify-center gap-4 mt-5'>
                    {
                        formsInmueble?.map((item, idx)=><CardRequirements key={idx} {...item} />)
                    }
                </section>
            </div>
        )
    } else{
        return(
            <FormStepper/>
        )
    }
}

export default function Page() {
    const [isProcessStart, setIsProcessStart] = useState(false);
    const [tipoProceso, setTipoProceso] = useState('');

    const establecerTipoProceso=(tipo='compra')=>{
        setTipoProceso(tipo);
        setIsProcessStart(true);
    }

    return (
        <ContextCard
            value={{
                establecerTipoProceso,
                tipoProceso,
                isProcessStart
            }}
        >
                <section className='w-full h-screen overflow-y-auto grid grid-cols-1 p-8 gap-2'>
                    <RenderCardsFormStepper/>
                </section>
        </ContextCard>
  )
};
