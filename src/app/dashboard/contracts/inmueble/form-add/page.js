'use client'

import Title1 from '@/components/elements/Title1';
import { useFetch } from '@/hooks/useFetch';
import { Divider, TextField } from '@mui/material';
import React, { useState } from 'react'
import FormStepper from '@/components/Forms/FormStepper';
import { useContratoContext } from '@/context/ContratosContext';
import { toast } from 'react-toastify';
import Loading from '@/components/elements/Loading';
import dynamic from 'next/dynamic';
import { cardDataInmuebles } from '@/data/CardData';
import FormUploadMinuta2 from '@/components/Forms/FormUploadMinuta2';
import { headersTableroCliente } from '@/data/Headers';
import { useContracts } from '@/context/ContextContract';
import { asignJuniorToContracts, generateScriptCompraVenta, generateScriptContract, processDataMinuta, sendDataMinuta, subirEvidencias, submitDataPreMinuta, submitDataPreMinuta2 } from '@/lib/apiConnections';
import { parseTextoToJSON } from '@/common/parserText';
import { useEditorContext } from '@/context/ConextEditor';
import { formatDateToYMD } from '@/lib/fechas';
import EditorView from '@/components/Views/EditorView';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import ButtonUploadImageMinuta from '@/components/elements/ButtonUploadImageMinuta';
import FormHeaderInformation from '@/components/Forms/FormHeaderInformation';

const TableSelectedUser = dynamic(()=>import('@/components/Tables/TableSelectedUser'),{
    ssr : false,
    loading : ()=><>Cargando Tabla ...</>
});

const FormViewerPdfEscritura = dynamic(()=>import('@/components/Forms/FormViewerPdfEscritura'),{
    ssr : false
});

const CardRequirements = dynamic(()=>import('@/components/Cards/CardRequirements'),{
    ssr : false
});


function RenderCardsFormStepper() {
    const URL_GET_DATA_CLIENTES = process.env.NEXT_PUBLIC_URL_HOME + "/client";
    const URL_GET_DATA_JUNIORS = process.env.NEXT_PUBLIC_URL_HOME+"/junior";
    const URL_GET_DATA_SENIORS = process.env.NEXT_PUBLIC_URL_HOME+'/senior';

    const {
        data : dataClientes, 
    } = useFetch(URL_GET_DATA_CLIENTES);

    const {
        data : dataJuniors
    } = useFetch(URL_GET_DATA_JUNIORS);

    const {
        data : dataSeniors 
    } = useFetch(URL_GET_DATA_SENIORS);

    const {
        activeStep,
        dataSelected,
        fileLocation,
        handleClickClient,
        pushActiveStep,
        handleChangeFileLocation
    } = useContracts();

    const {
        agregarBloques,
        parserData
    } = useEditorContext();

    const [loading, setLoading] = useState(false);
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
        }
    });
    const [notarioSelected, setNotarioSelected] = useState(null);
    const [viewPdf, setViewPdf] = useState(null);
    const [imagesMinuta, setImagesMinuta] = useState([]);
    
    const handleClickSelectClient=(client)=>{
        handleClickClient(client);
        pushActiveStep();
        toast('Cliente seleccionado',{
            type  : 'info',
            position : 'bottom-right'
        });
    }   
    const handleClickSelectCard=(slug)=>{
        setDataSendMinuta({
            ...dataSendMinuta,
            case : slug
        });
        pushActiveStep();
    }

    const handleUploadMinuta=async(minuta, detailsMinuta)=>{
        try {
            if (!minuta) {
                toast("Subir minuta",{
                    type : 'error',
                    position : 'bottom-center'
                });
                return;
            }
            setLoading(true);
            const newFormData = new FormData();
            newFormData.append('minutaFile', minuta);

            const response = await sendDataMinuta(newFormData);
            const jsonResponseUpload = await response.json();

            const fileLocation = jsonResponseUpload?.fileLocation;

            const responseProcessData = await processDataMinuta(newFormData);
            const responseProcessDataJSon = await responseProcessData?.json();

            const parserText = parseTextoToJSON(responseProcessDataJSon?.minuta_content);
            handleChangeFileLocation(fileLocation);
            agregarBloques(parserText?.data);

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
            pushActiveStep()
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

    const handleSubmitPreMinuta=async()=>{
        try {
            setLoading(true);
            const dataParseada = parserData();
            const JSONPreMinuta = {
                clientId : dataSelected?.client?.id,
                processPayment : "Pago a la mitad",
                minutaDirectory : `DB_evidences/${fileLocation?.directory}/${fileLocation?.fileName}`,
                datesDocument : {
                    processInitiate : formatDateToYMD(new Date())
                },
                directory : `DB_evidences/${fileLocation?.directory}`,
                case : dataSendMinuta?.case
            }
            
            const responsePreMinuta = await submitDataPreMinuta2(JSONPreMinuta, 'propertyCompraVenta');
            if (!responsePreMinuta?.ok || responsePreMinuta?.status === 422) {
                toast("Error al subir la informacion",{
                    type : 'error',
                    position : 'bottom-center'
                });
                console.log(await responsePreMinuta.json());
                
                return;
            }
            const responsePreMinutaJSON = await responsePreMinuta?.json();
            setDataSendMinuta((prev)=>({
                ...dataSendMinuta,
                minuta : {
                    ...prev?.minuta,
                    minutaContent : {
                        data : dataParseada
                    },
                },
                contractId : responsePreMinutaJSON?.contractId
            }));
            toast("Se creo el proceso",{
                type : 'success',
                position : 'bottom-right'
            });
            pushActiveStep();
        } catch (err) {
            toast("Hubo un error en iniciar el proceso",{
                type : 'error',
                position : 'bottom-center'
            });
            return;
        } finally { 
            setLoading(false);
        }
    }
    const handleClickSelectJunior=async(junior)=>{
        try {
            setLoading(true);
            const responseJuniorAsigned = await asignJuniorToContracts(dataSendMinuta?.contractId, junior?.id);
            if (!responseJuniorAsigned.ok || responseJuniorAsigned.status === 406) {
                toast("El junior excede la cantidad maxima que puede manipular",{
                    type : 'error',
                    position : 'bottom-center'
                });
                return;
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
            });
        } finally {
            setLoading(false)
        }
    };

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
        pushActiveStep()
        toast("Cliente guardado",{
            type : 'info',
            position : 'bottom-right'
        })
    }
    const handleClickEvidences=async(e)=>{
        e.preventDefault();
        try {
            setLoading(true);

            const response = await subirEvidencias(imagesMinuta, fileLocation?.directory);
        

            setDataSendMinuta((prev)=>({
                ...dataSendMinuta,
                paymentMethod : {
                    ...prev?.paymentMethod,
                    evidences : response                    
                }
            }));

            toast("Imagenes subidas correctamente",{
                type : 'success',
                position: 'bottom-right'
            });
            pushActiveStep();
        } catch (err) {
            console.log(err);
            
        } finally{
            setLoading(false);
        }
    }

    const handleClickSelectSenior=(senior)=>{
        setNotarioSelected(senior);
        setDataSendMinuta({
            ...dataSendMinuta,
            notario : {
                firstName : senior?.firstName,
                lastName : senior?.lastName,
                dni : senior?.dni,
                ruc : senior?.ruc
            },
            creationDay :{
                date : formatDateToYMD(new Date())
            }
        });
    }

    const handleSubmitData=async()=>{
        try {
            setLoading(true);
            const response = await generateScriptCompraVenta('inmueble', dataSendMinuta);
            console.log(dataSendMinuta);
            
            if (!response.ok || response.status === 406) {
                toast("Sucedio un error",{
                    type :'error',
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

    const handleChangeImageMinuta=(files)=>{
        setImagesMinuta([
            ...imagesMinuta,
            files
        ]);
    }
    const handleChangeDeleteImageMinuta=(idx)=>{
        const newDataImage = imagesMinuta?.filter((_, index)=>index!== idx);
        setImagesMinuta(newDataImage);
    }

    switch(activeStep) {
        // Primero seleccionamos el cliente que vamos a usar
        case 0:
            return (
                <div >
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
        // Luego seleccionamos el tipo de proceso que se va a realizar
        case 1:
            return(
                <div className='w-full'>
                    <section className='flex flex-col items-center mb-4'>
                        <Title1 className='text-4xl font-bold'>Formularios de Inmuebles</Title1>
                        <p className='text-sm text-gray-400'>Selecciona un proceso a realizar para el contrato de inmuebles</p>
                    </section>
                    <Divider/>
                    <section className='flex flex-row items-start justify-center gap-4 mt-5'>
                        {
                            cardDataInmuebles?.map((item, idx)=><CardRequirements key={idx} handleClick={handleClickSelectCard} {...item} />)
                        }
                    </section>
                </div>
            );

        // Luegos se sube el formulario de la minuta
        case 2:
            return (
              <main className='p-6 grid grid-cols-1 lg:grid-cols-3 gap-2'>
                <FormUploadMinuta2
                    loading={loading}
                    handleUploadMinuta={handleUploadMinuta}
                />
                <section className='hidden col-span-1 bg-white p-4 h-fit shadow rounded-sm lg:flex flex-col gap-4'>
                    <section>
                        <Title1>Cliente Seleccionado : </Title1>
                        <h1 className='text-sm'>Nombre : {dataSelected?.client?.firstName || '-'}</h1>
                        <h1 className='text-sm'>Usuario : {dataSelected?.client?.userName || '-'}</h1>
                    </section>
                </section>
              </main>  
            );
        
        case 3:
            return (
            <section className='relative h-screen overflow-y-auto w-full flex-1'>
                <EditorView/>
                <div className='p-4 w-full'>
                    <Button
                        disabled={loading}
                        onClick={handleSubmitPreMinuta}
                        className={"w-full mt-4"}
                    >   
                        {loading ? <Loader2/> : <p>Continuar</p>}
                    </Button>
                </div>
            </section>)
        // Seleccionar que Junior se encargara de la tarea
        case 4:
            return(
                <section className='w-full h-screen overflow-y-auto pb-24 grid grid-cols-1 p-8 gap-2'>
                    <TableSelectedUser
                        title='Selecciona un Junior'
                        descripcion='Selecciona el junior que se va a encargar (5 tareas por Junior)'
                        headers={headersTableroCliente}
                        data={dataJuniors?.data}
                        slugCrear={'/dashboard/juniors/form-add'}
                        handleClickSelect={handleClickSelectJunior}
                    />
                </section>
            )
        case 5 :
            return (<FormStepper
               handleSaveData={handleClickFormStepper}
            />);
        case 6:
            return (
                <section className='min-w-3xl h-fit p-4 mt-8 bg-white rounded-xl shadow-sm text-xl'>
                    <section className='my-2'>
                        <Title1 className='text-center text-2xl'>Sube lo comprobantes de pago</Title1>
                        <p className='text-center text-gray-600 text-sm'>Sube los comprobantes de pago en formato JPG, JPEG y PNG</p>
                    </section>
                    <ButtonUploadImageMinuta
                        handleChangeImage={handleChangeImageMinuta}
                        handleDeleteImageMinuta={handleChangeDeleteImageMinuta}
                    />
                    {
                        imagesMinuta?.length > 0 &&
                        <div className='w-full mt-8'>
                            <TextField className='w-full' onChange={(e)=>setDataSendMinuta((prev)=>({...dataSendMinuta, paymentMethod : {...prev?.paymentMethod, caption : e.target.value}}))} label="Indique el medio de pago" fullWidth required/>
                        </div>
                    }
                    <Button
                        onClick={handleClickEvidences}
                        disabled={imagesMinuta.length === 0 || loading}
                        className={"mt-4 w-full"}
                    >
                    {loading ? <Loader2 className='animate-spin'/> : <p>Continuar</p>}
                    </Button>
                </section>
            )
        case 7:
            // Se pide la informacion restante
            return(
                  <section className='w-full flex justify-center items-center'>
                          <div className='max-w-5xl w-full bg-white p-6 rounded-lg shadow mt-8'>
                            <section>
                              <Title1 className='text-3xl'>Informacion Restante</Title1>
                              <p>Ingresa la información restante para generar la escritura</p>
                            </section>
                            <FormHeaderInformation
                                handleChangeHeader={handleChangeHeader}
                                data={dataSendMinuta}
                            />
                            <Button 
                              onClick={()=>pushActiveStep()}
                              className={'w-full mt-4'}>
                              Continuar
                            </Button>
                          </div>
                        </section>
            )
        case 8:
            return(
                <section className='flex flex-col gap-4'>
                    <TableSelectedUser
                        title='Selecciona un notario'
                        descripcion='Selecciona un notario para el proceso'
                        slugCrear={"/dashboard/seniors/form-add"}
                        headers={headersTableroCliente}
                        data={dataSeniors?.data}
                        handleClickSelect={handleClickSelectSenior}
                    />
                    {
                        notarioSelected && (
                            <div>
                                <Title1>Notario seleccionado : </Title1>
                                <p>Informacón del notario seleccionado</p>

                                <section className='bg-white rounded-sm shadow p-4'>
                                    <h1>Nombre : {notarioSelected?.firstName} {notarioSelected?.lastName}</h1>
                                    <h1>Usuario : {notarioSelected?.userName}</h1>
                                </section>
                            </div>
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
        case 9:
            return (<FormViewerPdfEscritura
                viewerPdf={viewPdf}
            />);
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
