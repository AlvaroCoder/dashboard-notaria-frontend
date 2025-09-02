'use client';
import { getSession } from '@/authentication/lib';
import CardAviso from '@/components/Cards/CardAviso';
import ButtonDownloadWord from '@/components/elements/ButtonDownloadWord';
import ButtonUploadImageMinuta from '@/components/elements/ButtonUploadImageMinuta';
import Title1 from '@/components/elements/Title1';
import FojasDataForm from '@/components/Forms/FojasDataForm';
import FormHeaderInformation from '@/components/Forms/FormHeaderInformation';
import FormStepper from '@/components/Forms/FormStepper';
import FormUploadMinuta2 from '@/components/Forms/FormUploadMinuta2';
import TableSelectedUser from '@/components/Tables/TableSelectedUser';
import { Button } from '@/components/ui/button';
import { useContracts } from '@/context/ContextContract';
import { headersTableroCliente } from '@/data/Headers';
import { useFetch } from '@/hooks/useFetch';
import { generateScriptCompraVenta, getDataContractByIdContract, subirEvidencias } from '@/lib/apiConnections';
import { fetchImageEvidence } from '@/lib/apiConnectionsEvidences';
import { formatDateToYMD } from '@/lib/fechas';
import { TextField } from '@mui/material';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function RenderPageScript() {
    const URL_GET_DATA_SENIORS = process.env.NEXT_PUBLIC_URL_HOME+'/senior';

    const {
        data : dataSeniors,
        loading : loadingDataSeniors
    } = useFetch(URL_GET_DATA_SENIORS);

    const {
        activeStep,
        pushActiveStep,
        backActiveStep
    } = useContracts();
    const [loading, setLoading] = useState(true);

    const searchParams = useSearchParams();
    const idContract = searchParams.get("idContract");

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
    const router = useRouter();
    const [imagesMinuta, setImagesMinuta] = useState([]);
    const [dataContract, setDataContract] = useState(null);
    const [dataSession, setDataSession] = useState(null);
    const [dataContractDownload, setDataContractDownload] = useState(null);

      useEffect(() => {
          let isMounted = true;
          let imageUrls = [];
        
          async function getDataMinutaFile() {
            try {
              setLoading(true);
        
              const session = await getSession();
              if (!isMounted) return;
              setDataSession(session?.user);
        
              const responseContract = await getDataContractByIdContract(idContract);
              const { data: obj } = await responseContract.json();
        
              if (!isMounted) return;
        
              if (obj && Array.isArray(obj.evidences)) {
                try {            
                  const promiseImages = obj.evidences.map(async (image) => {
                    const responseImage = await fetchImageEvidence(image);
                    const blob = await responseImage.blob();
                    const url = URL.createObjectURL(blob);
                    imageUrls.push(url);

                    return blob;
                  });
                  
                  const images = await Promise.all(promiseImages);                  
                  setImagesMinuta(images);
                } catch (error) {
                  console.error("Error cargando imágenes:", error);
                }
              }
        
              setDataContract(obj);
        
              if (!obj?.juniorId) {
                toast("Asigne primero al junior", {
                  type: "warning",
                  position: "bottom-center",
                });
                router.push(`/dashboard/juniors/asign/?idContract=${idContract}`);
                return;
              }
            } catch (err) {
              if (isMounted) {
                toast("Error con la vista de minuta", {
                  type: "error",
                  position: "bottom-center",
                });
              }
            } finally {
              if (isMounted) setLoading(false);
            }
          }
        
          if (idContract) {
            getDataMinutaFile();
          }
        
          return () => {
            isMounted = false;
            imageUrls.forEach((url) => URL.revokeObjectURL(url));
          };
        }, [idContract]);


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
            if (imagesMinuta.length === 0) {
                setDataSendMinuta({
                    ...dataSendMinuta,
                    paymentMethod : null
                })
                pushActiveStep();
                return
            }
            pushActiveStep();

        } catch (err) {
            
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

    const handleContinue=(detailsMinuta)=>{
        try {
            setDataSendMinuta({
                ...dataSendMinuta,
                minuta : {
                    minutaNumber : detailsMinuta?.number,
                    creationDay : {
                        date : detailsMinuta?.creationDay
                    },
                    place : {
                        name : detailsMinuta?.namePlace,
                        district : detailsMinuta?.districtPlace
                    }
                }
            });
            toast("Informacion de la minuta guardada",{
                type : 'info',
                position : 'bottom-center'
            })
            pushActiveStep();
        } catch (err) {
            console.log(err);
            
            toast("Error en la UI",{
                type : 'error',
                position : 'bottom-center'
            });
        }
    }

    const handleSubmitData=async()=>{
        try {
            setLoading(true);
            
            let newDataSendMinuta = {
                ...dataSendMinuta,
                contractId : idContract
            };
            
            if (imagesMinuta && imagesMinuta.length > 0) {                
                if (Array.isArray(dataContract?.evidences) && dataContract?.evidences?.length > 0) {
                    newDataSendMinuta.paymentMethod = {
                        ...dataSendMinuta?.paymentMethod,
                        evidences : dataContract?.evidences
                    }
                } else {
                    const directoryRoute = dataContract?.directory?.split("/")[1];
                    const responseEvidencias = await subirEvidencias(imagesMinuta, directoryRoute);
                    
                    newDataSendMinuta.paymentMethod = {
                        ...dataSendMinuta?.paymentMethod,
                        evidences : responseEvidencias
                    };
                }
                

            } else {
                newDataSendMinuta.paymentMethod = null;
            }

            const response = await generateScriptCompraVenta('inmueble', newDataSendMinuta)

            if (!response.ok) {
                toast("Sucedio un error al generar la escritura",{
                    type : 'error',
                    position : 'bottom-center'
                });
                return;
            }
            const blobResponse = await response.blob();
            const url = URL.createObjectURL(blobResponse);

            const a = document.createElement('a');
            a.href = url;
            a.download = `escritura-${idContract}.docx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            setTimeout(() => URL.revokeObjectURL(url), 4000);

            const responseContract = await getDataContractByIdContract(idContract);
            const responseContractJSON = await responseContract.json();

            setDataContractDownload(responseContractJSON?.data);
            pushActiveStep();
            
        } catch (err) {
            toast("Error al enviar los datos",{
                type : 'error',
                position : 'bottom-center'
            });
            
        } finally {
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

    if (loading || loadingDataSeniors) {
        return <p>Cargando ...</p>
    }
    switch (activeStep) {
        case 0:
            return (
                <main className='p-6 grid grid-cols-1 gap-2'>
                    <FormUploadMinuta2
                        minutaDir={dataContract?.minutaDirectory}
                        handleContinue={handleContinue}
                    />
                </main>
            )
        case 1:
            return(
                <section className='w-full p-6 shadow'>
                    <FormStepper
                        handleSaveData={handleClickFormStepper}
                        backActiveStep={backActiveStep}
                    />
                </section>
            )
        case 2:
            return(
                <section className='min-w-3xl h-fit p-4 mt-8 bg-white rounded-xl shadow-sm text-xl'>
                    <section className='my-2'>
                        <Title1 className='text-center text-2xl'>Sube los comprobantes de pago</Title1>
                        <p className='text-center text-gray-600 text-sm'>Subr lo comprobantes de pago</p>
                    </section>
                    <ButtonUploadImageMinuta
                        handleChangeImage={handleChangeImageMinuta}
                        handleDeleteImageMinuta={handleChangeDeleteImageMinuta}
                        prewiesImages={dataContract?.evidences ?? []}
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
                        disabled={loading}
                        className={"w-full mt-4"}
                    >   
                        {loading ? <Loader2 className='animate-spin'/> : <p>Continuar</p>}
                    </Button>   
                </section>
            )
        case 3:
            return (
                <main className='w-full flex justify-center items-center'>
                    <div className='max-w-5xl w-full bg-white p-6 rounded-lg shadow mt-8'>
                        <section>
                            <Title1 className='text-3xl'>Información Restante</Title1>
                            <p>Ingresa la información Restante para generar la escritura</p>
                        </section>
                        <section>
                            <Title1 className='text-2xl'>Informacion de Fojas</Title1>
                            <FojasDataForm
                                fojasData={dataSendMinuta.fojasData}
                                handleChangeFojasDatas={handleChangeFojasDatas}
                            />
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
        case 4:
            return (
                <main className='w-full h-screen overflow-y-auto p-8 flex flex-col gap-4'>
                    <TableSelectedUser
                        title='Selecciona un senior'
                        descripcion='Tabla de seniors, selecciona uno para continuar'
                        headers={headersTableroCliente}
                        data={dataSeniors?.data}
                        slugCrear={'/dashboard/seniors/form-add'}
                        handleClickSelect={handleClickSelectSenior}
                        showAddButton={dataSession?.payload?.role === 'admin'}
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
            case 5:
                return(
                    <main className='p-6 w-full'>
                        <Title1>Descarga el documento si es necesario</Title1>
                        <p>En caso no haya empezado la descarga, descarga el documento</p>
                        <ButtonDownloadWord
                            dataContract={dataContractDownload}
                            idContract={dataContractDownload?.id}
                        />  
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
