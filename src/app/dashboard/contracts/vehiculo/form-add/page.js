'use client';
import CardNotarioSelected from '@/components/Cards/CardNotarioSelected';
import Title1 from '@/components/elements/Title1';
import FormHeaderInformation from '@/components/Forms/FormHeaderInformation';
import FormStepper from '@/components/Forms/FormStepper';
import FormViewerPdfEscritura from '@/components/Forms/FormViewerPdfEscritura';
import { Button } from '@/components/ui/button';
import { useContracts } from '@/context/ContextContract';
import { cardDataVehiculos } from '@/data/CardData';
import { headersTableroCliente } from '@/data/Headers';
import { useFetch } from '@/hooks/useFetch';
import { generateScriptCompraVenta } from '@/lib/apiConnections';
import { formatDateToYMD } from '@/lib/fechas';
import { Divider, TextField } from '@mui/material';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const TableSelectedUser = dynamic(()=>import('@/components/Tables/TableSelectedUser'),{
  ssr : false,
  loading : ()=><>Cargando Tabla .... </>
});

const CardRequirements = dynamic(()=>import('@/components/Cards/CardRequirements'),{
  ssr : false
});

function RenderCardsFormStepper() {
  const URL_GET_DATA_CLIENTES = process.env.NEXT_PUBLIC_URL_HOME + "/client";
  const URL_GET_DATA_SENIORS = process.env.NEXT_PUBLIC_URL_HOME+'/senior';

  const {
    data : dataClientes
  } = useFetch(URL_GET_DATA_CLIENTES);

  const { 
    data : dataSeniors
  } = useFetch(URL_GET_DATA_SENIORS);

  const {
    activeStep,
    handleClickClient,
    pushActiveStep,
  } = useContracts();


  const [dataSendMinuta, setDataSendMinuta] = useState({
    header : {
      numeroDocumentoNotarial : "",
      numeroRegistroEscritura : '',
      year : '',
      folio : '',
      tomo : '',
      kardex : ''
  },
  fojasData : {
      start : {
          number : "1123",
          serie : "C",
      },
      end : {
          number : '1125V',
          serie : "C"
      }
  },
  vehicleData : {
    numberPlate : "",
    propertyRecord : {
      number : "",
      place : ""
    }
  }
  });
  
  const [notarioSelected, setNotarioSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewPdf, setViewPdf] = useState(null);

  const handleClickSelectClient=(client)=>{
      handleClickClient(client);
      pushActiveStep();
      toast("Cliente seleccionado",{
        type : 'info',
        position : 'bottom-right'
      });
  };
  const handleClickSelectCard=(slug)=>{
    try {
      setDataSendMinuta({
        ...dataSendMinuta,
        case : slug
      });
      pushActiveStep();
    } catch (err) {
      console.log(err);
      
    }
  }

  const handleClickFormStepper=(compradores, vendedores)=>{
    setDataSendMinuta({
      ...dataSendMinuta,
      sellers : {
        people : vendedores
      },
      buyers : {
        people : compradores
      }
    });
    pushActiveStep();
    toast("Clientes guardados",{
      type : 'info',
      position : 'bottom-right'
    });
  }

  const handleClickSelectSenior=(senior)=>{
    setNotarioSelected(senior);
    const { firstName, lastName, dni, ruc } = senior;
    setDataSendMinuta({
      ...dataSendMinuta,
      notario : {
        firstName,
        lastName,
        dni,
        ruc
      },
      creationDay : {
        date : formatDateToYMD(new Date())
      }
    })
  };

  const handleChangeHeader=(e)=>{
    const target = e.target;
    setDataSendMinuta((prev)=>({
      ...dataSendMinuta,
      header : {
        ...prev.header,
        [target?.name] : target.value
      }
    }));
  }

  const handleSubmitData=async()=>{
    try {
      setLoading(true);
      const response = await generateScriptCompraVenta('vehiculo', dataSendMinuta);
      console.log(dataSendMinuta);
      if (!response.ok || response.status === 404) {
        toast("Hubo un error al generar la escritura",{
          type : 'error',
          position : 'bottom-center'
        });
        console.log(await response.json());
        return;
      }      
      const blobResponse = await response.blob();
      const url = URL.createObjectURL(blobResponse);

      setViewPdf(url);
      pushActiveStep();
      
    } catch (err) {
      toast("Surgio un error en la api",{
        type : 'error',
        position : 'bottom-center'
      });
    } finally{
      setLoading(false);
    }
  }
  switch (activeStep) {
    case 0:
      return(
        <div>
          <TableSelectedUser
              title='Selecciona un cliente'
              descripcion='Tabla de clientes, selecciona uno para continuar'
              headers={headersTableroCliente}
              data={dataClientes?.data}
              slugCrear={'/dashboard/clientes/form-add'}
              handleClickSelect={handleClickSelectClient}
            />
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
          <section className='flex flex-col lg:flex-row items-center justify-center gap-4 mt-5'>
            {
              cardDataVehiculos?.map((item, idx)=><CardRequirements key={idx} handleClick={handleClickSelectCard} {...item} />)
            }
          </section>
        </div>
      )
    case 2:
      return (
        <FormStepper
          handleSaveData={handleClickFormStepper}
        />
      )
    case 3:
      return(
        <section className='w-full flex justify-center'>
          <div className='max-w-5xl w-full bg-white p-6 rounded-lg shadow mt-8'>
            <section>
              <Title1 className='text-3xl'>Información Restante</Title1>
              <p>Ingresa la información restantes para generar la escritura</p>
            </section>
            <section className='my-2'>
              <Title1 className=''>Información del Vehiculo</Title1>
              <TextField
                  label="Nro de Placa"
                  type='text'
                  onChange={(e)=>setDataSendMinuta((prev)=>({...dataSendMinuta, vehicleData:{...prev?.vehicleData, numberPlate : e.target.value}}))}
                  fullWidth
                  required
                />
              <section className='grid grid-cols-1 lg:grid-cols-2 gap-4 my-4'>
                <TextField
                  label="Nro de propiedad"
                  type='number'
                  onChange={(e)=>setDataSendMinuta((prev)=>({...dataSendMinuta, vehicleData : {...prev.vehicleData, propertyRecord : {...prev.vehicleData.propertyRecord, number : e.target.value}}}))}
                  required
                />
                <TextField
                  label="Lugar"
                  type='text'
                  onChange={(e)=>setDataSendMinuta((prev)=>({...dataSendMinuta, vehicleData : {...prev.vehicleData, propertyRecord : {...prev.vehicleData.propertyRecord, place : e.target.value}}}))}
                  required
                />  
              </section>
            </section>
            <FormHeaderInformation
              data={dataSendMinuta}
              handleChangeHeader={handleChangeHeader}
            />
            <Button
              onClick={()=>pushActiveStep()}
              className={"w-full mt-4"}
            >
              Continuar
            </Button>
          </div>
        </section>
      )
    case 4:
      return(
        <section className='flex flex-col gap-4'>
          <TableSelectedUser
            title='Selecciona un notario'
            descripcion='Selecciona un notario para el proceso'
            slugCrear={'/dashboard/seniors/form-add'}
            headers={headersTableroCliente}
            data={dataSeniors?.data}
            handleClickSelect={handleClickSelectSenior}
          />
          {
            notarioSelected && (
              <CardNotarioSelected
                notario={notarioSelected}
              />
            )
          }
          <Button 
            disabled={!notarioSelected}
            onClick={handleSubmitData}
            className={"w-full mt-4"}
          >
            {loading ? <Loader2 className='animate-spin' /> : <p>Generar Escritura</p>}
          </Button>
        </section>
      )
    case 5:
      return(
        <FormViewerPdfEscritura
          viewerPdf={viewPdf}
        />
      )
  }
}

export default function Page() {
  return (
    <section className='w-full h-screen overflow-y-auto pb-24 grid grid-cols-1 p-8 gap-2'>
      <RenderCardsFormStepper/>
    </section>
  )
};