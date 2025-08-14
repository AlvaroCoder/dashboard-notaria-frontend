'use client';
import Title1 from '@/components/elements/Title1';
import FojasDataForm from '@/components/Forms/FojasDataForm';
import FormFounders from '@/components/Forms/FormFounders';
import FormHeaderInformation from '@/components/Forms/FormHeaderInformation';
import FormUploadMinuta2 from '@/components/Forms/FormUploadMinuta2';
import FormViewerPdfEscritura from '@/components/Forms/FormViewerPdfEscritura';
import { Button } from '@/components/ui/button';
import { useContracts } from '@/context/ContextContract'
import { headersTableroCliente } from '@/data/Headers';
import { useFetch } from '@/hooks/useFetch';
import { useSession } from '@/hooks/useSesion';
import { asignJuniorToContracts, generateScriptContract, processDataMinuta, sendDataMinuta, sendMinutaWord, submitDataPreMinuta } from '@/lib/apiConnections';
import { formatDateToYMD } from '@/lib/fechas';
import { funUploadDataMinuta } from '@/lib/functionUpload';
import { TextField } from '@mui/material';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import React, { Suspense, useState } from 'react'
import { toast } from 'react-toastify';

const TableSelectedUser = dynamic(()=>import('@/components/Tables/TableSelectedUser'),{
  ssr : false,
  loading : ()=><>Cargando Tabla ...</>
});

const TableroCarga = dynamic(()=>import('@/components/Loading/TableroCarga'),{
  ssr : false
});

function RenderApp({
  dataSession=''
}) {
  const [loading, setLoading] = useState(false);

  const [dataSendMinuta, setDataSendMinuta] = useState({
      header : {
        numeroDocumentoNotarial : '',
        numeroRegistroEscritura : '',
        year : '',
        folio :'',
        tomo :'',
        kardex : ''
      },
      fojasData:{
        start:{
          number:"1123",
          serie:"C"
        },
        end:{
          number:"1125V",
          serie:"C"
        }
      },
      corporation : '',
      minuta : {
        minutaNumber : '',
        creationDay : {
          date : formatDateToYMD(new Date())
        },
        place : {
          name : 'Notaria Rojas',
          district : ''
        }
      }
  });
  
  const [notarioSelected, setNotarioSelected] = useState(null);
  const [viewPdf, setViewPdf] = useState(null);
  const [dataMinuta, setDataMinuta] = useState({
    minutaPdf : null,
    minutaWord : null,
  });

  const {
    activeStep, 
    dataSelected,
    handleClickClient,
    pushActiveStep,
    backActiveStep
  } = useContracts();

  const URL_GET_DATA_CLIENTES = process.env.NEXT_PUBLIC_URL_HOME + "/client";
  const URL_GET_DATA_JUNIORS = process.env.NEXT_PUBLIC_URL_HOME+"/junior";
  const URL_GET_DATA_SENIORS = process.env.NEXT_PUBLIC_URL_HOME+'/senior';

  const {
    data : dataClientes,
    loading: loadingDataClientes,
  } = useFetch(URL_GET_DATA_CLIENTES);

  const {
    data : dataJuniors,
    loading : loadingDataJuniors,
  } = useFetch(URL_GET_DATA_JUNIORS);

  const {
    data : dataSeniors,
    loading : loadingDataSeniors,
  } = useFetch(URL_GET_DATA_SENIORS);

  const handleClickSelectClient=(client)=>{
    pushActiveStep();
    handleClickClient(client);
    toast('Cliente seleccionado',{
      type : 'info',
      position : 'bottom-right'
    });
    setDataSendMinuta({
      ...dataSendMinuta,
      clientId : client?.id
    });
  };

  const handleClickSelectJunior=async(junior)=>{
    try {
      setLoading(true);
      const responseJuniorAsigned = await asignJuniorToContracts(dataSendMinuta?.contractId, junior?.id);
      if (!responseJuniorAsigned.ok || responseJuniorAsigned.status === 406) {
        toast("El junior excede la cantidad maxima que puede manipular",{
          type : 'error',
          position : 'bottom-center'
        });
        return
      }

      toast("Se asigno el Junior correctamente",{
        type : 'success',
        position : 'bottom-right'
      });
      pushActiveStep();
      
    } catch (err) {
      toast("Sucedio un error al asignar el junior",{
        type : 'error',
        position : 'bottom-center'
      })
    } finally{
      setLoading(false);
    }
  }

  // Se encarga de mandar la minuta y luego procesarla
  const handleUploadMinuta=async(minutaWord, detailsMinuta, minutaPdf)=>{
    try {
      
      if (!minutaWord || !minutaPdf) {
        toast("Subir minuta",{
          type : 'error',
          position : 'bottom-center'
        });
        return
      };
      setLoading(true);

      setDataMinuta({
        minutaPdf,
        minutaWord
      });

      setDataSendMinuta({
        ...dataSendMinuta,
        minuta : {
          minutaNumber : detailsMinuta?.number,
          creationDay : {
            date : formatDateToYMD(new Date())
          },
          place : {
            name : detailsMinuta?.namePlace,
            district : detailsMinuta?.districtPlace
          } 
        }
      });
      pushActiveStep();

      toast("Se creo el proceso",{
        type : 'success',
        position : 'bottom-right'
      });

    } catch (err) {
      console.log(err);
      toast("Error con la vista de minuta",{
        type : 'error',
        position : 'bottom-center'
      });
      
    } finally{
      setLoading(false);
    }

  }

  const handleSubmitFormStepperPerson=(dataFounder)=>{    
    setDataSendMinuta({
      ...dataSendMinuta,
      founders : {
        people : dataFounder
      }
    })
    pushActiveStep();    
  }

  const handleChangeHeader=(e)=>{
    const target = e.target;
    setDataSendMinuta((prev)=>({
      ...dataSendMinuta,
      header : {
        ...prev.header,
        [target?.name] : target.value
      }
    }))
  }

  const handleClickSenior=(senior)=>{
    setNotarioSelected(senior);
    setDataSendMinuta({
      ...dataSendMinuta,
      notario : {
        firstName : senior?.firstName,
        lastName : senior?.lastName,
        dni : senior?.dni,
        ruc : senior?.ruc
      },
      creationDay : {
        date : formatDateToYMD(new Date())
      }
    });
  }

  const handleSubmitData=async()=>{
    try {
      setLoading(true);

      const {idContract} = await funUploadDataMinuta(
        dataMinuta?.minutaWord,
        dataMinuta?.minutaPdf,
        dataSelected?.client?.id,
        'rs'
      );

      const newDataSendMinuta = {
        ...dataSendMinuta,
        contractId : idContract
      };

      if (dataSession?.payload?.role === 'junior') {
          const responseJuniorAsigned = await asignJuniorToContracts(idContract, dataSession?.payload?.id);
          if (!responseJuniorAsigned.ok || responseJuniorAsigned.status === 406) {
              toast("El junior excede la cantidad maxima que puede manipular",{
              type : 'error',
              position : 'bottom-center'
              });
              return
          }

          toast("Se asigno el Junior correctamente",{
              type : 'success',
              position : 'bottom-right'
          });
      }
      
      const response = await generateScriptContract('razonSocial',newDataSendMinuta);
      
      const blobResponse = await response.blob();
      const url = URL.createObjectURL(blobResponse);

      setViewPdf(url);
      pushActiveStep();
    } catch (err) {
      console.log(err);
      
      toast("Surgio un error",{
        type : 'error',
        position : 'bottom-center'
      })
    }finally{
      setLoading(false);
    }
  }

  const handleChangeFojasDatas = (path, value) => {
    setDataSendMinuta(prev => {
      const updated = { ...prev };
      const keys = path.split(".");
      let current = updated;
  
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
  
      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };
  switch (activeStep) {
    case 0:
      // Primer paso definir el cliente que va a realizar el proceso
      return(
        <section className='w-full h-screen overflow-y-auto pb-24 grid grid-cols-1 px-8 gap-2'>
           <TableSelectedUser
            title='Selecciona un cliente'
            descripcion='Tabla de clientes, selecciona uno para continuar'
            headers={headersTableroCliente}
            data={dataClientes?.data}
            slugCrear={'/dashboard/clientes/form-add'}
            handleClickSelect={handleClickSelectClient}                
          />
        </section>
      )
    // Aun se esta viendo la opcion de que el junior pueda 
    // seleccionar la opcion de que si se pago por efectivo o otros medios
    case 1:
      // Se sube la minuta
      return (
        <section className='px-6 grid grid-cols-1 lg:grid-cols-3 gap-2'>
          <FormUploadMinuta2
            loading={loading}
            handleUploadMinuta={handleUploadMinuta}
            dataPreviewPdf={dataMinuta?.minutaPdf && URL.createObjectURL(dataMinuta?.minutaPdf)}
            dataPreviewWord={dataMinuta?.minutaWord}
            numberMinuta={dataSendMinuta?.minuta?.minutaNumber}
            districtPlaceMinuta={dataSendMinuta?.minuta?.place?.district}
          />
          <section className='hidden col-span-1 bg-white p-4 h-fit shadow rounded-sm lg:flex flex-col gap-4'>
            <section>
              <Title1>Cliente Seleccionado : </Title1>
              <h1 className='text-sm'>Nombre : {dataSelected?.client?.firstName || '-'}</h1>
              <h1 className='text-sm'>Usuario : {dataSelected?.client?.userName || '-'}</h1>
              <p>Cliente</p>
            </section>
            <section>
              <Button
                className={'w-full py-4'}
                onClick={()=>{}}
              >
                Cambiar Cliente
              </Button>
            </section>
          </section>
        </section>
      )
    case 2:
      // Se generan los formularios de los fundadores
      return(
        <section className='w-full flex justify-center items-center'>
          <div className='max-w-5xl w-full'>
          <FormFounders
           initialFounder={dataSendMinuta?.founders?.people}
           handleClickBack={backActiveStep}
           handleSendFounder={handleSubmitFormStepperPerson}
          />
          </div>
        </section>
      )
    case 3:
      // Se pide la información restante
      return(
        <section className='w-full flex justify-center items-center'>
          <div className='max-w-5xl w-full bg-white p-6 rounded-lg shadow mt-8'>
            <section>
              <Title1 className='text-3xl'>Información Restante</Title1>
              <p>Ingresa la información restante para generar la escritura</p>
            </section>
            <section>
              <Title1 className='text-2xl'>Información de las Fojas</Title1>
              <FojasDataForm
                fojasData={dataSendMinuta.fojasData}
                handleChangeFojasDatas={handleChangeFojasDatas}
              />
            </section>
            <section className='my-4'>
              <Title1>Información de la Corporacion</Title1>
              <TextField label="Corporacion" value={dataSendMinuta?.corporation} onChange={(e)=>setDataSendMinuta({...dataSendMinuta, corporation : e.target.value})} fullWidth required/>
            </section>
            <FormHeaderInformation
              handleChangeHeader={handleChangeHeader}
              data={dataSendMinuta}
            />
            <section className='w-full flex flex-row items-center gap-4'>
              <Button
                className={'flex-1 mt-4'}
                onClick={backActiveStep}
              >
                Regresar
              </Button>
              <Button 
                onClick={()=>pushActiveStep()}
                className={'flex-1 mt-4'}>
                Continuar
              </Button>
            </section>
          </div>
        </section>
      )
    case 4:
      // Se pide la informacion del senior
      return(
        <section className='w-full h-screen overflow-y-auto p-8 pb-24 flex flex-col gap-4'> 
          <Suspense fallback={<p>Cargando tabla ...</p>}>
            {
              loadingDataSeniors ?
              (
                <TableroCarga headers={headersTableroCliente}/>
              ) :
              (
                <TableSelectedUser
                  title='Selecciona un seniors'
                  descripcion='Tabla de seniors, selecciona uno para continuar'
                  headers={headersTableroCliente}
                  data={dataSeniors?.data}
                  slugCrear={'/dashboard/seniors/form-add'}
                  handleClickSelect={handleClickSenior}
                  showAddButton={dataSession?.payload?.role === 'admin'}

                />
              )
            }
          </Suspense>

            {
              notarioSelected && (
                <div className='p-4 bg-white shadow rounded-lg'>
                  <Title1>Notario Seleccionado : </Title1>
                  <p>Información del notario seleccionado</p>
                  <section>
                    <h1>Nombre {notarioSelected?.firstName} {notarioSelected?.lastName}</h1>
                    <h1>Usuario : {notarioSelected?.userName}</h1>
                  </section>
                </div>
              )
            }

            <div className='flex flex-row items-center gap-4'>
              <Button 
              disabled={loading}
                onClick={backActiveStep}
              >
                Retroceder
              </Button>
            <Button
              disabled={!notarioSelected || loading}
              onClick={handleSubmitData}
              className={'flex-1 '}
            > 
              {loading ? <Loader2 className='animate-spin' /> : <p>Enviar data</p>}
            </Button>
            </div>
        </section>
      )
      case 5:
        return(
          <section className='p-4 w-full'>
            <FormViewerPdfEscritura
            viewerPdf={viewPdf}
          />
          </section>
        )
  }

}

export default function Page() {
  const {loading} = useContracts();
  const {dataSession} = useSession();
  if (loading) {
    return (<p>Cargando ...</p>)
  }
  else{
    return (
      <main>
        <section className='p-6 w-full'>
            <Title1 className='text-3xl'>Nuevo Contrato de constitucion de Razon Social</Title1>
            <p className='text-gray-600 text-sm'>Genera la escritura de Razon Social</p>
        </section>
        <RenderApp
          dataSession={dataSession}
        />
      </main>
    )
  }
};
