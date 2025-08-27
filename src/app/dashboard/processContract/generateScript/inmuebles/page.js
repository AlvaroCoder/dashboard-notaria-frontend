'use client';
import { parseTextoToJSON } from '@/common/parserText';
import ButtonUploadImageMinuta from '@/components/elements/ButtonUploadImageMinuta';
import Title1 from '@/components/elements/Title1';
import FormHeaderInformation from '@/components/Forms/FormHeaderInformation';
import FormStepper from '@/components/Forms/FormStepper';
import FormViewerPdfEscritura from '@/components/Forms/FormViewerPdfEscritura';
import TableSelectedUser from '@/components/Tables/TableSelectedUser';
import { Button } from '@/components/ui/button';
import EditorView from '@/components/Views/EditorView';
import { useEditorContext } from '@/context/ConextEditor';
import { headersTableroCliente } from '@/data/Headers';
import { useFetch } from '@/hooks/useFetch';
import { asignJuniorToContracts, generateScriptCompraVenta, getDataContractByIdContract, getMinutaFile, processDataMinuta, subirEvidencias } from '@/lib/apiConnections';
import { formatDateToYMD } from '@/lib/fechas';
import { TextField } from '@mui/material';
import { Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function RenderPageScript() {
        
    const URL_GET_DATA_JUNIORS = process.env.NEXT_PUBLIC_URL_HOME+"/junior";
    const URL_GET_DATA_SENIORS = process.env.NEXT_PUBLIC_URL_HOME+'/senior';

    const {
        data : dataJuniors,
        loading : loadingDataJuniors
    } = useFetch(URL_GET_DATA_JUNIORS);

    const {
        data : dataSeniors,
        loading : loadingDataSeniors
    } = useFetch(URL_GET_DATA_SENIORS);

    const [loading, setLoading] = useState(true);

    const searchParams = useSearchParams();
    const idContract = searchParams.get("idContract");
    
    const [activeStep, setActiveStep] = useState(0);
    
    const pushActiveStep=()=>{
        setActiveStep(activeStep+1);
    }

    const {agregarBloques, parserData} = useEditorContext();
    const [seniorSelected, setSeniorSelected] = useState(null);
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
        }
    });

    const [viewPdf, setViewPdf] = useState(null);
    const [imagesMinuta, setImagesMinuta] = useState([]);
    const [fileLocation, setFileLocation] = useState(null);

    useEffect(()=>{
        async function getDataMinutaFile() {
            try {
                const responseContract = await getDataContractByIdContract(idContract);                
                const responseContractJSON = await responseContract.json();
                console.log(responseContractJSON);
                
                setDataSendMinuta({...dataSendMinuta, responseContractJSON});
                setFileLocation(responseContractJSON?.data?.directory);

                const contractDirectory = responseContractJSON?.data?.minutaDirectory;
                const minuta = await getMinutaFile(contractDirectory);
                const blob = await minuta.blob();

                const newFormData = new FormData();
                newFormData.append('minutaFile', blob)

                const dataProcess = await processDataMinuta(newFormData);
                const dataProcessJSON = await dataProcess.json();
                
                const parserText = parseTextoToJSON(dataProcessJSON?.minuta_content);
                agregarBloques(parserText?.data);
                toast("Minuta procesada",{
                    type : 'success',
                    position : 'bottom-right'
                });

            } catch (err) {
                console.log(err);
                toast("Erro con la vista de minuta",{
                    type :'error',
                    position : 'bottom-center'
                })
            } finally{
                setLoading(false);
            }
        };   
        getDataMinutaFile();
    },[idContract]);

    const handleClickEditor=async()=>{
        const dataParseada = parserData();
        setDataSendMinuta((prev)=>({
            ...dataSendMinuta,
            minuta : {
                ...prev?.minuta,
                minutaContent : {
                    data : dataParseada,
                }
            }
        }))
        pushActiveStep()
    }

    const handleClickSelectJunior=async(junior)=>{
        try {
            setLoading(true);
            const responseJuniorAsigned = await asignJuniorToContracts(idContract, junior?.id);
            if (!responseJuniorAsigned.ok) {
                console.log(await responseJuniorAsigned.json());
                
                toast("El junior excede la cantidad maxima que puede manipular",{
                    type : 'error',
                    position : 'bottom-center'
                });
                return;
            }

            toast("Se asigno el junior correctamente",{
                type : 'success',
                position : 'bottom-center'
            });
            pushActiveStep();
            
        } catch (err) {
            console.log(err);
            toast("Error al seleccionar el Junior",{
                type : 'error',
                position : 'bottom-center'
            });
            
        } finally{
            setLoading(false);
        }
    }
    
    const handleClickFormStepper=async(compradores, vendedores)=>{
        setDataSendMinuta({
            ...dataSendMinuta,
            sellers : {
                people : vendedores,
            },
            buyers : {
                people : compradores,
            }
        });
        pushActiveStep();
        toast("Cliente guardado",
            {
                type : 'info',
                position : 'bottom-right'
            }
        );
    }

    const handleChangeHeader=(e)=>{
        const target = e.target;
        setDataSendMinuta((prev)=>({
            ...prev,
            header : {
                ...prev.header,
                [target.name] : target.value
            }
        }));
    }

    const handleClickEvidences=async(e)=>{
        e.preventDefault();
        try {
            setLoading(true);
            const response = await subirEvidencias(imagesMinuta, fileLocation?.split("/")[1]);
            setDataSendMinuta((prev)=>({
                ...dataSendMinuta,
                paymentMethod : {
                    ...prev?.paymentMethod,
                    evidences : response 
                }
            }));

            toast("Imagenes subidas correctamente",{
                type : 'success',
                position : 'bottom-right'
            });
            pushActiveStep();

        } catch (err) {
            console.log(err);
            
        } finally {
            setLoading(false);
        }
    }

    const handleClickSelectSenior=async(senior)=>{
        if (!senior) {
            toast("Debes seleccionar un senior",{
                type : 'error',
                position : 'bottom-center'
            });
            return;
        }
        setSeniorSelected(senior);
        setDataSendMinuta((prev)=>({
            ...prev,
            notario : {
                firstName : senior?.firstName,
                lastName : senior?.lastName,
                dni : senior?.dni,
                ruc : senior?.ruc,
            }, 
            creationDay : {
                date : formatDateToYMD(new Date())
            },
            contractId : idContract,
            minuta :{
                ...prev.minuta,
                creationDay : {
                    date : formatDateToYMD(new Date())
                }
            }
        }));
    }
    const handleSubmitData=async()=>{
        try {
            setLoading(true);
            const response = await generateScriptCompraVenta('inmueble', dataSendMinuta)

            const blobResponse = await response.blob();
            const url = URL.createObjectURL(blobResponse);
            
            setViewPdf(url);
            pushActiveStep();
            toast("Escritura generada correctamente",{
                type : 'success',
                position : 'bottom-right'
            });
        } catch (err) {
            console.log(err);
            toast("Error al enviar los datos",{
                type : 'error',
                position : 'bottom-center'
            });
            
        } finally {
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

    if (loading || loadingDataJuniors || loadingDataSeniors) {
        return <p>Cargando ...</p>
    }
    switch (activeStep) {
        case 0:
            return(
                <main className='relative w-full h-screen overflow-y-auto'>
                    <EditorView/>
                    <div className='p-4 w-full'>
                        <Button
                            onClick={handleClickEditor}
                            disabled={loading}
                            className={"w-full mt-4"}
                        >
                            {loading ? <Loader2 className='animate-spin' /> : <p>Continuar</p>}
                        </Button>
                    </div>
                </main>
            )
        case 1:
            return(
                <main className='relative w-full h=screen overflow-y-auto'>
                    <TableSelectedUser
                        title='Selecciona un Junior'
                        descripcion='Selecciona el Junior que se encargara de la escritura'
                        headers={headersTableroCliente}
                        data={dataJuniors?.data}
                        slugCrear={'/dashboard/juniors/form-add'}
                        handleClickSelect={handleClickSelectJunior}               
                    />
                </main>
            )
        case 2:
            return(
                <FormStepper
                    handleSaveData={handleClickFormStepper}
                />
            )
        case 3:
            return(
                <section className='min-w-3xl h-fit p-4 mt-8 bg-white rounded-xl shadow-sm text-xl'>
                    <section className='my-2'>
                        <Title1 className='text-center text-2xl'>Sube los comprobantes de pago</Title1>
                        <p className='text-center text-gray-600 text-sm'>Subr lo comprobantes de pago</p>
                    </section>
                    <ButtonUploadImageMinuta
                        handleChangeImage={handleChangeImageMinuta}
                        handleDeleteImageMinuta={handleChangeDeleteImageMinuta}
                    />
                    {
                        imagesMinuta?.length > 0 &&
                        <div className='w-full mt-8'>
                            <TextField className='w-full' onChange={(e)=>setDataSendMinuta((prev)=>({...dataSendMinuta, paymentMethod : {...prev?.paymentMethod, caption : e.target.value}}))} label="Indique el medio de pago" fullWidth required />
                        </div>
                    }
                    <Button 
                        onClick={handleClickEvidences}
                        disabled={imagesMinuta?.length === 0 || loading}
                        className={"w-full mt-4"}
                    >   
                        {loading ? <Loader2 className='animate-spin'/> : <p>Continuar</p>}
                    </Button>   
                </section>
            )
        case 4:
            return (
                <main className='w-full flex justify-center items-center'>
                    <div className='max-w-5xl w-full bg-white p-6 rounded-lg shadow mt-8'>
                        <section>
                            <Title1 className='text-3xl'>Información Restante</Title1>
                            <p>Ingresa la información Restante para generar</p>
                        </section>
                        <section className='flex flex-col gap-4'>
                            <Title1>Información de la minuta</Title1>
                            <TextField label="Numero de la mintuta" onChange={(e)=>setDataSendMinuta((prev)=>({...dataSendMinuta, minuta : {...prev?.minuta, minutaNumber : e.target.value}}))} fullWidth required />
                            <TextField label="Lugar de la minuta" onChange={(e)=>setDataSendMinuta((prev)=>({...dataSendMinuta, minuta : {...prev?.minuta, place : {...prev?.minuta?.place , name : e.target.value}}}))} fullWidth required />
                            <TextField label="Distrito de la minuta" onChange={(e)=>setDataSendMinuta((prev)=>({...dataSendMinuta, minuta : {...prev?.minuta, place : {...prev?.minuta?.place, district : e.target.value}}}))} fullWidth required />
                        </section>
                        <FormHeaderInformation
                            handleChangeHeader={handleChangeHeader}
                            data={dataSendMinuta}
                        />
                        <Button
                            onClick={()=>pushActiveStep()}
                            className={'w-full mt-4'}
                        >
                            Continuar
                        </Button>
                    </div>
                </main>
            )
        case 5:
            return (
                <main className='w-full h-screen overflow-y-auto p-8 flex flex-col gap-4'>
                    <TableSelectedUser
                        title='Selecciona un senior'
                        descripcion='Tabla de seniors, selecciona uno para continuar'
                        headers={headersTableroCliente}
                        data={dataSeniors?.data}
                        slugCrear={'/dashboard/seniors/form-add'}
                        handleClickSelect={handleClickSelectSenior}
                    />
                    {
                        seniorSelected && 
                        (
                            <div className='p-4 bg-white shadow rounded-lg'>
                                <Title1>Notario Seleccionado : </Title1>
                                <p>Información del notario seleccionado</p>
                                <section>
                                    <h1>Nombre : {seniorSelected?.firstName}</h1>
                                    <h1>Usuario : {seniorSelected?.userName}</h1>
                                </section>
                            </div>
                        )
                    }
                    <Button
                        disabled={!seniorSelected || loading}
                        onClick={handleSubmitData}
                        className={'w-full mt-4'}
                    >   
                        {loading ? <Loader2 className='animate-spin' /> : <p>Continuar</p>}
                    </Button>
                </main>
            )
            case 6:
                return(
                    <main className='w-full'>
                        <FormViewerPdfEscritura
                            viewerPdf={viewPdf}
                        />
                            <div className='w-full p-6 '>
                            <Button
                                className={"w-full"}
                                onClick={()=>router.push("/dashboard/contracts/")}
                            >
                                Regresar al inicio
                            </Button>
                          </div>
                        </main>
                )
        }
}

export default function Page() {
  return (
    <Suspense fallback={<p>Cargando ...</p>}>
        <RenderPageScript/>
    </Suspense>
  )
}
