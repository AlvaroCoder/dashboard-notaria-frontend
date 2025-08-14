'use client';
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
import { asignJuniorToContracts, generateScriptCompraVenta, subirEvidencias } from '@/lib/apiConnections';
import { formatDateToYMD } from '@/lib/fechas';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import ButtonUploadImageMinuta from '@/components/elements/ButtonUploadImageMinuta';
import FormHeaderInformation from '@/components/Forms/FormHeaderInformation';
import { useSession } from '@/hooks/useSesion';
import FojasDataForm from '@/components/Forms/FojasDataForm';
import { funUploadDataMinutaCompraVenta } from '@/lib/functionUpload';
import CardAviso from '@/components/Cards/CardAviso';
import CardNotarioSelected from '@/components/Cards/CardNotarioSelected';

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

function RenderCardsFormStepper({
    dataSession
}) {
    const URL_GET_DATA_CLIENTES = process.env.NEXT_PUBLIC_URL_HOME + "/client";
    const URL_GET_DATA_SENIORS = process.env.NEXT_PUBLIC_URL_HOME+'/senior';

    const {
        data : dataClientes, 
    } = useFetch(URL_GET_DATA_CLIENTES);

    const {
        data : dataSeniors 
    } = useFetch(URL_GET_DATA_SENIORS);

    const {
        activeStep,
        dataSelected,
        fileLocation,
        handleClickClient,
        pushActiveStep,
        backActiveStep,
    } = useContracts();

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
        },
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

    const [dataMinuta, setDataMinuta] = useState({
        minutaPdf : null,
        minutaWord : null,
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

    const handleUploadMinuta=async(minutaWord, detailsMinuta, minutaPdf)=>{
        try {
            if (!minutaPdf) {
                toast("Subir minuta",{
                    type : 'error',
                    position : 'bottom-center'
                });
                return;
            }
            setLoading(true);
            
            setDataMinuta({
                minutaPdf : minutaPdf,
                minutaWord : minutaWord
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
            toast("Error con la vista de minuta",{
                type : 'error',
                position : 'bottom-center'
            });
        } finally{
            setLoading(false);
        }
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
        toast("Cliente guardado",{
            type : 'info',
            position : 'bottom-right'
        })
    }
    const handleClickEvidences=async(e)=>{
        e.preventDefault();
        try {
            if (imagesMinuta.length === 0) {
                setDataSendMinuta({
                    ...dataSendMinuta,
                    paymentMethod : null
                })
                pushActiveStep();
                return
            }
            setLoading(true);

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
            
            const responseEvidencias = await subirEvidencias(imagesMinuta, fileLocation?.directory);
        
            const {idContract} = await funUploadDataMinutaCompraVenta(
                dataMinuta?.minutaWord,
                dataMinuta?.minutaPdf,
                dataSelected?.client?.id,
                'propertyCompraVenta',
                dataSendMinuta?.case
            )

            const newDataSendMinuta= {
                ...dataSendMinuta,
                contractId : idContract,
                paymentMethod : {
                    ...dataSendMinuta?.paymentMethod,
                    evidences : responseEvidencias
                }
            }
            
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

            const response = await generateScriptCompraVenta('inmueble', newDataSendMinuta);
            
            if (!response.ok || response.status === 406) {
                toast("Sucedio un error",{
                    type :'error',
                    position : 'bottom-center'
                });                
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
                    <Button
                        onClick={backActiveStep}
                        className={"max-w-4xl mx-auto w-full mt-8"}
                    >
                        Regresar
                    </Button>
                </div>
            );

        // Luegos se sube el formulario de la minuta
        case 2:
            return (
              <main className='p-6 grid grid-cols-1 lg:grid-cols-3 gap-2'>
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
                    </section>
                </section>
              </main>  
            );
        case 3:
            return (<FormStepper
               handleSaveData={handleClickFormStepper}
            />);
        case 4:
            return (
                <section className='min-w-3xl h-fit p-4 mt-8 bg-white rounded-xl shadow-sm text-xl'>
                    <section className='my-2'>
                        <Title1 className='text-center text-2xl'>Sube los comprobantes de pago</Title1>
                        <p className='text-center text-gray-600 text-sm'>Sube los comprobantes de pago en formato JPG, JPEG y PNG (No obligatorio)</p>
                    </section>
                    <ButtonUploadImageMinuta
                        handleChangeImage={handleChangeImageMinuta}
                        handleDeleteImageMinuta={handleChangeDeleteImageMinuta}
                    />
                    {
                        imagesMinuta?.length > 0 &&
                        <div className='w-full mt-8'>
                            <Title1>Ejemplo de lo que debes de subir </Title1>
                            <section className='my-4'>
                                <CardAviso
                                    advise='CHEQUES DE GERENCIA EMITIDOS POR EL BANCO BBVA'

                                />
                            </section>
                            <TextField className='w-full' onChange={(e)=>setDataSendMinuta((prev)=>({...dataSendMinuta, paymentMethod : {...prev?.paymentMethod, caption : e.target.value}}))} label="Indique el medio de pago" fullWidth required/>
                        </div>
                    }
                    <Button
                        onClick={handleClickEvidences}
                        
                        className={"mt-4 w-full"}
                    >
                    {loading ? <Loader2 className='animate-spin'/> : <p>Continuar</p>}
                    </Button>
                </section>
            )
        case 5:
            // Se pide la informacion restante
            return(
                <section className='w-full flex justify-center items-center'>
                    <div className=' w-full bg-white p-6 rounded-lg shadow mt-8'>
                      <section>
                        <Title1 className='text-3xl'>Informacion Restante</Title1>
                        <p>Ingresa la información restante para generar la escritura</p>
                      </section>
                      <section>
                        <Title1 className='text-2xl'>Información de Fojas</Title1>
                        <FojasDataForm
                            fojasData={dataSendMinuta?.fojasData}
                            handleChangeFojasDatas={handleChangeFojasDatas}
                        />
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
        case 6:
            return(
                <section className='flex flex-col gap-4'>
                    <TableSelectedUser
                        title='Selecciona un notario'
                        descripcion='Selecciona un notario para el proceso'
                        slugCrear={"/dashboard/seniors/form-add"}
                        headers={headersTableroCliente}
                        data={dataSeniors?.data}
                        handleClickSelect={handleClickSelectSenior}
                        showAddButton={dataSession?.payload?.role === 'admin'}
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
        case 7:
            return (<FormViewerPdfEscritura
                viewerPdf={viewPdf}
            />);
    }
}

export default function Page() {
    const {
        loadingProcess
    } = useContratoContext();

    const {dataSession} = useSession();
    return (
        <section className='w-full h-screen overflow-y-auto pb-24 grid grid-cols-1 p-8 gap-2'>
            {loadingProcess && <Loading isOpen={loadingProcess}/>}
            <RenderCardsFormStepper
                dataSession={dataSession}
            />
        </section>
  )
};
