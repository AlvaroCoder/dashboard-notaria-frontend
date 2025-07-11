'use client';
import { useContextCard } from '@/context/ContextCard'
import { Step, StepLabel, Stepper, TextField } from '@mui/material';
import React, { useState } from 'react'
import FormPerson from './FormPerson';
import { Button } from '../ui/button';
import Title1 from '../elements/Title1';
import ButtonUploadImageMinuta from '../elements/ButtonUploadImageMinuta';
import { checkEmptyFieldsFormCompra, checkEvidenceEmpty } from '@/common/checkInputsFormInmueble';
import { useContratoContext } from '@/context/ContratosContext';

export default function FormStepper() {
    const {tipoProceso, client} = useContextCard();
    const stepsCompra = ['Comprador(es)','Vendedor(es)',  'Comprobante de Pago',  ];
    const stepsVenta = ['Vendedor(es)', 'Comprador(es)', 'Comprobante de Pago' , 'Minuta'];
    const [activeStep, setActiveStep] = useState(0);
    const [activeStepCompra, setActiveStepCompra] = useState(0);
    const [activeStepVenta, setActiveStepVenta] = useState(0);
    const [dataImagesMinuta, setDataImagesMinuta] = useState([]);
    const [errorCompra, setErrorCompra] = useState([]);

    const {dataPreMinuta} = useContratoContext();

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
    };


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
    const handleUploadMinuta=async(e)=>{
        // Aquí puedes manejar la lógica para subir la minuta
        e.preventDefault();
        if (!dataSendCompra.minuta) {
            toast("Por favor, sube la minuta en formato PDF", {
                type: 'error' });
        }
        const formData = new FormData();
        formData.append('minutaFile', dataSendCompra.minuta);

        const response = await fetch('http://lcalhost:8000/home/contracts/sendMinuta', {
            method : 'POST',
            body : formData
        });


    }
    switch (tipoProceso) {
        case 'compra':
            return (
                <section>
                    {renderStepper(stepsCompra, activeStepCompra)}
                    <section className='mt-8'>
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
                        
                    </section>
                    <section className='mt-8'>
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
                    </section>
                    <section className='mt-8'>
                        {
                            activeStepCompra === 2 && (
                                <div className='min-w-3xl  p-4 bg-white rounded-xl shadow-sm  text-xl'>
                                    
                                    <section className='my-2'>
                                        <Title1 className='text-center text-2xl'>Sube los comprobantes de pago</Title1>
                                        <p className='text-center text-gray-600 text-sm'>Sube los comprobantes de pago en formato JPG, JPEG y PNG</p>
                                    </section>
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
                    </section>
                    <div className="flex justify-between mt-6">
                        <Button disabled={activeStepCompra === 0} onClick={() => setActiveStepCompra((prev) => prev - 1)}>
                            Atrás
                        </Button>
                        <Button
                            onClick={async(e)=>{
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

                                    const responseDataPreMinuta = await fetch('http://localhost:8000/create/propertyCompraVenta/',{
                                        method : 'POST',
                                        headers : {
                                            'Content-Type' : 'application/json'
                                        },
                                        body : JSON.stringify(dataPreMinuta)
                                    });
                                    
                                    const jsonDataPreMinuta = await responseDataPreMinuta.json();
                                    
                                    const contractId = jsonDataPreMinuta?.contractId;
                                    const newDataSend = {
                                        contractId,
                                        sellers : {
                                            people : vendedores
                                        },
                                        buyers : {
                                            people : compradores
                                        },
                                        creationDay : dataPreMinuta?.datesDocument?.processInitiate,
                                        notario : {
                                            firstName : "Javier",
                                            lastName : 'Rojas',
                                            dni : '123456',
                                            ruc : '1234567'
                                        },
                                        minuta : {
                                            
                                        }
                                    }
                                }
                                
                                                
                                setActiveStepCompra((prev) => (prev < stepsCompra.length - 1 ? prev + 1 : prev));
                            }}
                        >
                            {activeStepCompra === stepsCompra.length - 1 ? 'Finalizar' : 'Siguiente'}
                        </Button>
                    </div>
                </section>
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

/**
 * 
 *                       {
                            activeStepCompra === 1 && (
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
                                <div className='min-w-3xl  p-4 bg-white rounded-xl shadow-sm  text-xl'>
                                    
                                    <section className='my-2'>
                                        <Title1 className='text-center text-2xl'>Sube los comprobantes de pago</Title1>
                                        <p className='text-center text-gray-600 text-sm'>Sube los comprobantes de pago en formato JPG, JPEG y PNG</p>
                                    </section>
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
 */

/**
 * 
 *                     <div className="flex justify-between mt-6">
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
                                const dataSend = {
                                    buyers : compradores,
                                    sellers : {
                                        people : vendedores
                                    },
                                }
                                console.log(compradores, vendedores, dataImagesMinuta, dataSendCompra);
                                                             
                                setActiveStepCompra((prev) => (prev < stepsCompra.length - 1 ? prev + 1 : prev));
                            }}
                        >
                            {activeStepCompra === stepsCompra.length - 1 ? 'Finalizar' : 'Siguiente'}
                        </Button>
                    </div>
 */