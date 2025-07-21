'use client'

import Title1 from '@/components/elements/Title1';
import TableroCarga from '@/components/Loading/TableroCarga';
import { useContextCard } from '@/context/ContextCard';
import { useFetch } from '@/hooks/useFetch';
import { Divider } from '@mui/material';
import React from 'react'
import CardRequirements from '@/components/Cards/CardRequirements';
import FormUploadMinuta from '@/components/Forms/FormUploadMinuta';
import FormStepper from '@/components/Forms/FormStepper';
import { useContratoContext } from '@/context/ContratosContext';
import FormViewerPdfEscritura from '@/components/Forms/FormViewerPdfEscritura';
import TableSelectedUser from '@/components/Tables/TableSelectedUser';
import { toast } from 'react-toastify';
import Loading from '@/components/elements/Loading';


const headerTableroCliente=[
    {value : 'Nombre', head : ['firstName', 'lastName']},
    {value : 'Usuario', head : 'userName'}
]
const formsInmueble = [
    {
        nombre : "Compra de Inmuebles", 
        slug : 'compra',
        descripcion : "Formulario para iniciar un proceso de compra de inmuebles", 
        requisitos :[
            "Copia literal del inmueble (Sunarp).",
            "Minuta firmada por comprador y vendedor.",
            "Pagos del proceso",
        ]
    },
    {
        nombre : "Venta de Inmuebles",
        slug : 'venta',
        descripcion : "Esto es una descripcion para los procesos de venta",
        requisitos : [
            "Copia literal del inmueble (Sunarp).",
            "Minuta firmada por comprador y vendedor.",
            "Pagos del proceso",
        ]
    }
];

function RenderCardsFormStepper() {
    const {activeStep, pushActiveStep, initializeClient} = useContextCard();
    const {handleChangeDataPreMinuta} = useContratoContext();
    const {
        data : dataClientes, 
        loading : loadingDataClientes, 
        error : errorDataClientes
    } = useFetch('http://localhost:8000/home/client');
    
    const handleClickSelectClient=(client)=>{
        pushActiveStep();
        handleChangeDataPreMinuta('clientId', client?.id);
        initializeClient(client);
        toast('Cliente seleccionado',{
            type  : 'info'
        });
    }   
    const handleSaveData=()=>{

    }
    switch(activeStep) {
        // Primero seleccionamos el cliente que vamos a usar
        case 0:
            return (
                <div >
                    {
                        loadingDataClientes ? 
                        <TableroCarga
                            headers={headerTableroCliente}
                        /> :
                        <TableSelectedUser
                            title='Selecciona un cliente'
                            descripcion='Tabla de clientes, selecciona uno para continuar'
                            headers={headerTableroCliente}
                            data={dataClientes?.data}
                            slugCrear={'/dashboard/clientes/form-add'}
                            handleClickSelect={handleClickSelectClient}
                        />
                    }
                </div>
            )
        // Luego seleccionamos el tipo de proceso que se va a realizar
        case 1:
            return(
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
            );

        // Luegos se sube el formulario de la minuta
        case 2:
            return (<FormUploadMinuta/>);
        case 3 :
            return (<FormStepper
               
            />);
        case 4:
            return (<FormViewerPdfEscritura/>);
    }
}

export default function Page() {
    const {
        loadingProcess
    } = useContratoContext();

    return (
        <section className='w-full h-screen overflow-y-auto pb-24 grid grid-cols-1 p-8 gap-2'>
            {loadingProcess && <Loading isOpen={loadingProcess}/>}
            <RenderCardsFormStepper/>
        </section>
  )
};
