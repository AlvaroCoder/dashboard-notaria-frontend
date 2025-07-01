'use client'
import { checkEmptyFieldsFormCompra, checkEvidenceEmpty } from '@/common/checkInputsFormInmueble';
import ButtonUploadImageMinuta from '@/components/elements/ButtonUploadImageMinuta';
import UploadMinuta from '@/components/elements/ButtonUploadMinuta';
import ErrorCard from '@/components/elements/ErrorCard';
import Title1 from '@/components/elements/Title1';
import { Button } from '@/components/ui/button';
import { useContextCard } from '@/context/ContextCard';
import { cn } from '@/lib/utils';
import { FormControl, InputLabel, MenuItem, Select, Step, StepLabel, Stepper, TextField } from '@mui/material';
import { Trash2 } from 'lucide-react';
import React, {  useState } from 'react'
import { toast } from 'react-toastify';


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
    const [activeStepCompra, setActiveStepCompra] = useState(0);
    const [activeStepVenta, setActiveStepVenta] = useState(0);
    const [dataImagesMinuta, setDataImagesMinuta] = useState([]);
    const [errorCompra, setErrorCompra] = useState([]);
    const [dataSendCompra, setDataSendCompra] = useState({
        minuta : '',
        paymentMethod : ''
    });

    const [compradores, setCompradores] = useState([
        {
            firstName: '',
            lastName: '',
            dni: '',
            gender: '',
            nationality: '',
            age: '',
            job: '',
            maritalStatus: {
              value : ''
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

    const [vendedores, setVendedores] = useState([
        {
            firstName: '',
            lastName: '',
            dni: '',
            gender: '',
            nationality: '',
            age: '',
            job: '',
            maritalStatus: {
              value : ''
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
    const addPerson = (type = 'vendedor') => {
        const newPerson = {
          firstName: '',
          lastName: '',
          dni: '',
          gender: '',
          nationality: '',
          age: '',
          job: '',
          maritalStatus: {
            value : ""
          },
          address: {
            name : "",
            district : "",
            province : "",
            department : ""
        }
        };
        type === 'venta' ? setVendedores([...vendedores, newPerson]) : setCompradores([...compradores, newPerson]);
      };

    const deletePerson =(idx, type='vendedor')=>{
        const currentData = type === 'vendedor' ? [...vendedores] : [...compradores];
        const newData = currentData?.filter((_, index)=>idx !== index);        
        type === 'vendedor' ? setVendedores(newData) : setCompradores(newData);
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
                        <Step key={label} >
                            <StepLabel >{label}</StepLabel>
                        </Step>
                    ))
                }
            </Stepper>
        )
    }
    const handleChangeImageMinuta=(files)=>{
        setDataImagesMinuta([
            ...dataImagesMinuta,
            files
        ]);
    }

    const handleChangeDeleteImageMinuta=(idx)=>{
        const newDataImage = dataImagesMinuta.filter((_,index)=>index!==idx);
        setDataImagesMinuta(newDataImage)       
    }
    const renderPersonForm=(data=[], handleChange, type, handleDelete, errores=[])=>{
        const nombreProceso = type === 'venta' ? 'Vendedor' : 'Comprador';
        return data?.map((person, idx)=>
            <section key={idx} className={cn('min-w-3xl relative', 'bg-white shadow rounded-lg')}>
                {
                    idx > 0 &&
                    <Button 
                        onClick={()=>handleDelete(idx, type === 'venta' ? 'vendedor' : 'comprador')}
                        className='absolute top-0 px-8 py-5 right-0 bg-[#5F1926] cursor-pointer hover:bg-red-400 rounded-full text-white'>
                        <Trash2/>
                    </Button>
                }
                {
                    (errores?.length > 0) && 
                    (errores[idx]?.error &&
                        <div className='w-full p-4' >
                            <ErrorCard
                                title={'Error'}
                                message={errores[idx]?.value}
                            /> 
                        </div>
                    )
                }
                <div className='p-8 mb-6'>
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
                        <section className='w-full flex flex-row gap-2 '>
                            <FormControl fullWidth>
                                <InputLabel>Estado Civil</InputLabel>
                                <Select
                                    value={person?.maritalStatus?.value}
                                    label="Estado Civil"
                                    defaultValue={person?.maritalStatus?.value}
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

            </section>
        )
    }

    switch (tipoProceso) {
        case 'compra':
            return (
                <div className='p-6'>
                    {renderStepper(stepsCompra, activeStepCompra)}
                    <div className='mt-8'>
                        {
                            activeStepCompra === 0 && (
                                <>
                                    {renderPersonForm(compradores, handleChange, 'compra', deletePerson, errorCompra)}  
                                    <section className='flex flex-row gap-2'>
                                        <Button
                                            onClick={()=>addPerson('comprador')}
                                            className={"flex-1 py-4"}
                                        >
                                        Agregar Comprador
                                        </Button>
                                    </section>
                                </>
                            )
                        }
                        {
                            activeStepCompra === 1 && (
                                <section>
                                    {renderPersonForm(vendedores, handleChange, 'venta', deletePerson)}
                                    <section className='flex flex-row gap-2'>
                                        <Button
                                            onClick={()=>addPerson('comprador')}
                                            className={"flex-1 py-4"}
                                        >
                                        Agregar Comprador
                                        </Button>
                                    </section>
                                </section>
                            )
                        }
                        {
                            activeStepCompra === 2 && (
                                <div className='min-w-3xl h-96 p-4 bg-white rounded-xl shadow-sm font-bold text-xl'>
                                    
                                    <Title1 className='text-center text-2xl'>Sube los comprobantes de pago</Title1>
                                    <p className='text-center'>Sube los comprobantes de pago en formato JPG, JPEG y PNG</p>
                                    <ButtonUploadImageMinuta
                                        handleChangeImage={handleChangeImageMinuta}
                                        handleDeleteImageMinuta={handleChangeDeleteImageMinuta}
                                    />
                                    {
                                        dataImagesMinuta.length > 0 &&
                                        <div className='w-full mt-8'>
                                            <TextField className='w-full' onChange={(e)=>setDataSendCompra({...dataSendCompra, paymentMethod : e.target.value})}  label="Indique el medio de pago" required />
                                        </div> 
                                    }
                                </div>
                            )
                        }
                        {
                            activeStepCompra === 3 && (
                                <section className='min-w-3xl bg-white p-8'>
                                    <div className='mb-4'>
                                        <Title1 className='text-2xl'>Sube la minuta</Title1>
                                        <p>Sube la minuta en formato PDF</p>
                                    </div>
                                    <UploadMinuta
                                        handleSetFile={(data)=>setDataSendCompra({...dataSendCompra, minuta : data})}
                                    />
                                </section>
                            )
                        }
                    </div>
                    <div className="flex justify-between mt-6">
                        <Button disabled={activeStepCompra === 0} onClick={() => setActiveStepCompra((prev) => prev - 1)}>
                            Atrás
                        </Button>
                        <Button
                            onClick={(e)=>{
                                e.preventDefault();
                                if (activeStepCompra === 0) {
                                    const errores = checkEmptyFieldsFormCompra(compradores);
                                    if (errores.length > 0) {
                                        setErrorCompra(errores);
                                        toast("Formulario incompleto",{
                                            type : 'error'
                                        })
                                        return;
                                    }
                                }
                                if (activeStepCompra === 1) {
                                    const errores = checkEmptyFieldsFormCompra(vendedores);
                                    if (errores.length > 0) {
                                        setErrorCompra(errores);
                                        toast("Formulario incompleto",{
                                            type :'error'
                                        });
                                        return;
                                    }
                                }
                                if (activeStepCompra === 2) {
                                    const errores = checkEvidenceEmpty(dataImagesMinuta);
                                    if (errores.error) {
                                        setErrorCompra([errores]);
                                        toast("Evidencias incompletas",{
                                            type : 'error'
                                        });
                                        return;
                                    }
                                }
                                
                                setActiveStepCompra((prev) => (prev < stepsCompra.length - 1 ? prev + 1 : prev));
                            }}
                        >
                            {activeStepCompra === stepsCompra.length - 1 ? 'Finalizar' : 'Siguiente'}
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
    return (
        <section className='w-full min-h-screen pb-24 grid grid-cols-1 p-8 gap-2'>
            <RenderCardsFormStepper/>
        </section>
  )
};
