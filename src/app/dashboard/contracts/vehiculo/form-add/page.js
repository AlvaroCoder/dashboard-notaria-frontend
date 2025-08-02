'use client';
import CardRequirements from '@/components/Cards/CardRequirements';
import ButtonUploadImageMinuta from '@/components/elements/ButtonUploadImageMinuta';
import Loading from '@/components/elements/Loading';
import Title1 from '@/components/elements/Title1';
import TableroCarga from '@/components/Loading/TableroCarga';
import { useContextCard } from '@/context/ContextCard';
import { useContratoContext } from '@/context/ContratosContext';
import { cardDataVehiculos } from '@/data/CardData';
import { useFetch } from '@/hooks/useFetch';
import { Divider, TextField } from '@mui/material';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const TableSelectedUser = dynamic(()=>import('@/components/Tables/TableSelectedUser'),{
  ssr : false,
  loading : ()=><>Cargando Tabla .... </>
});

const headerTableroCliente=[
  {value : 'Nombre', head : ['firstName', 'lastName']},
  {value : 'Usuario', head : 'userName'}
];

function RenderCardsFormStepper() {
  const URL_GET_DATA_CLIENTES = process.env.NEXT_PUBLIC_URL_HOME + "/client";

  const {activeStep, pushActiveStep, initializeClient} = useContextCard();
  const {handleChangeDataPreMinuta} = useContratoContext();
  const [dataImagesMinuta, setDataImagesMinuta] = useState([]);
  const [metodoPago, setMetodoPago] = useState('');

  const {
    data : dataClientes,
    loading : loadingDataClientes,
    error : errorDataClientes
  } = useFetch(URL_GET_DATA_CLIENTES);

  const handleClickSelectClient=(client)=>{
        pushActiveStep();
        handleChangeDataPreMinuta('clientId', client?.id);
        initializeClient(client);
        toast('Cliente seleccionado',{
            type  : 'info',
            position : 'bottom-right'
        });
    }   ;
  const handleChangeImageMinuta=(files)=>{
    setDataImagesMinuta([
      ...dataImagesMinuta,
      files
    ]);
  }
  const handleChangeDeleteImageMinuta=(idx)=>{
    const newDataImage = dataImagesMinuta?.filter((_, index)=>index!==idx);
    setDataImagesMinuta(newDataImage)
  }
  switch (activeStep) {
    case 0:
      return(
        <div>
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
    case 1:
      return(
        <div className='w-full'>
         <section className='flex flex-col items-center mb-4'>
            <Title1 className='text-4xl font-bold'>Formularios de Vehiculos</Title1>
            <p className='text-sm text-gray-400'>Selecciona un proceso de vehiculos para continuar con el proceso</p>
          </section>
          <Divider/>
          <section className='flex flex-row items-center justify-center gap-4 mt-5'>
            {
              cardDataVehiculos?.map((item, idx)=><CardRequirements key={idx} {...item} />)
            }
          </section>
        </div>
      )
    case 2:
      return (
        <div className='min-w-3xl h-fit p-4 bg-white rounded-xl shadow-sm  text-xl'>
          <section className='my-2'>
            <Title1 className='text-center'>Sube la información del vehiculo</Title1>
            <p className='text-center text-gray-600 text-sm'>Sube la información en formato JPG o PNG</p>

          </section>
          <ButtonUploadImageMinuta
            handleChangeImage={handleChangeImageMinuta}
            handleChangeDeleteImageMinuta={handleChangeDeleteImageMinuta}
          />
          {
            dataImagesMinuta?.length > 0 &&
            <div className='w-full mt-8'>
              <TextField className='w-full' onChange={(e)=>setMetodoPago(e.target.value)} />
            </div>
          }
        </div>
      )
    
  }
}

export default function Page() {
  const {
    loadingProcess
  } = useContratoContext();
  return (
    <section className='w-full h-screen overflow-y-auto pb-24 grid grid-cols-1 p-8 gap-2'>
      <Loading isOpen={loadingProcess} />
      <RenderCardsFormStepper/>
    </section>
  )
};