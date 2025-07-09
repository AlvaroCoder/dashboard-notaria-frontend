'use client'
import { checkEmptyFieldsFormCompra, checkEvidenceEmpty } from '@/common/checkInputsFormInmueble';
import ButtonUploadImageMinuta from '@/components/elements/ButtonUploadImageMinuta';
import UploadMinuta from '@/components/elements/ButtonUploadMinuta';
import Title1 from '@/components/elements/Title1';
import FormPerson from '@/components/Forms/FormPerson';
import { Button } from '@/components/ui/button';
import { useContextCard } from '@/context/ContextCard';
import { Divider, Step, StepLabel, Stepper, TextField } from '@mui/material';
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
                <section className='my-2'>
                    <Title1 className='text-2xl'>{nombre}</Title1>
                    <p className='text-sm'>
                        {descripcion}
                    </p>
                </section>
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

    switch (tipoProceso) {
        case 'compra':
            return (
                <div className='p-6'>
                    {renderStepper(stepsCompra, activeStepCompra)}
                    <div className='mt-8'>
                        {
                            activeStepCompra === 0 && (
                                <>
                                    <FormPerson
                                        data={compradores}
                                        handleChange={handleChange}
                                        type='compra'
                                        handleDelete={deletePerson}
                                        errores={errorCompra}
                                    />
                                    <section className='flex flex-row gap-2 mt-6'>
                                        <Button
                                            onClick={()=>addPerson('comprador')}
                                            className={"flex-1 py-4 cursor-pointer"}
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
                                    <FormPerson
                                        data={vendedores}
                                        handleChange={handleChange}
                                        type='venta'
                                        handleDelete={deletePerson}
                                        errores={errorCompra}
                                    />
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
                        <Button disabled={activeStepVenta === 0} onClick={() => setActiveStepVenta((prev) => prev - 1)}>
                        Atrás
                        </Button>
                        <Button
                        >
                        {activeStepVenta === stepsVenta.length - 1 ? 'Finalizar' : 'Siguiente'}
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
            nombre : "Compra de Inmuebles", 
            slug : 'compra',
            descripcion : "Formulario para iniciar un proceso de compra de inmuebles", 
            requisitos :[
                "Requisito 1",
                "Requisito 2",
                "Requisito 3",
                "Requisito 4"
            ]
        },
        {
            nombre : "Venta de Inmuebles",
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
                <section className='flex flex-col items-center mb-4'>
                    <Title1 className='text-4xl font-bold'>Formularios de inmuebles</Title1>
                    <p className='text-sm text-gray-400'>Selecciona un proceso a realizar para el contrato de inmuebles</p>
                </section>
                <Divider/>
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
