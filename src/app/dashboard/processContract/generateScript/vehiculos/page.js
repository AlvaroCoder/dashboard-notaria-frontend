'use client';
import { getSession } from '@/authentication/lib';
import CardAviso from '@/components/Cards/CardAviso';
import CardShowDnisPerson from '@/components/Cards/CardShowDnisPerson';
import CardShowVehicleData from '@/components/Cards/CardShowVehicleData';
import ButtonDownloadWord from '@/components/elements/ButtonDownloadWord';
import ButtonUploadImageMinuta from '@/components/elements/ButtonUploadImageMinuta';
import Title1 from '@/components/elements/Title1';
import FojasDataForm from '@/components/Forms/FojasDataForm';
import FormHeaderInformation from '@/components/Forms/FormHeaderInformation';
import FormStepper from '@/components/Forms/FormStepper';
import TableSelectedUser from '@/components/Tables/TableSelectedUser';
import { Button } from '@/components/ui/button';
import { useContracts } from '@/context/ContextContract';
import { headersTableroCliente } from '@/data/Headers';
import { useFetch } from '@/hooks/useFetch';
import { generateScriptCompraVenta, getDataContractByIdContract, subirEvidencias } from '@/lib/apiConnections';
import { fetchImageEvidence } from '@/lib/apiConnectionsEvidences';
import { formatDateToYMD } from '@/lib/fechas';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import TextField from '@mui/material/TextField';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react'
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
        backActiveStep,
    } = useContracts();
    const [loading, setLoading] = useState(true);

    const searchParams = useSearchParams();
    const idContract = searchParams.get('idContract');
    const [seniorSelected, setSeniorSelected] = useState(null);
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
        },
        payment : {
          unit : 'dollar',
          amount : ''
        },
    });

    const router = useRouter();
    const [imagesMinuta, setImagesMinuta] = useState([]);
    const [fileLocation, setFileLocation] = useState(null);
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
                  return url;
                });
      
                const images = await Promise.all(promiseImages);
                if (isMounted) setImagesMinuta(images);
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
    };

    const handleChangeHeader=(e)=>{
        const target = e.target;
        setDataSendMinuta((prev)=>({
            ...prev,
            header : {
                ...prev.header,
                [target.name] : target.value
            }
        }));
    };

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

    const handleSubmitData=async()=>{
        try {
            setLoading(true);
            
            let newDataSendMinuta = {
                ...dataSendMinuta,
                contractId : idContract
            };

            if (imagesMinuta && imagesMinuta.length > 0) {
                const responseEvidencias = await subirEvidencias(imagesMinuta, fileLocation?.directory);
                newDataSendMinuta.paymentMethod = {
                    ...dataSendMinuta?.paymentMethod,
                    evidences : responseEvidencias
                };

            } else {
                newDataSendMinuta.paymentMethod = null;
            }

            const response = await generateScriptCompraVenta('vehiculo', newDataSendMinuta)

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
            a.download = "escritura-vehiculo.docx";
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
    };

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
    };

    const handleChangePaymentForm = (field, value) => {
        setDataSendMinuta((prev)=>({
          ...dataSendMinuta,
          payment : {
            ...prev.payment,
            [field] : value
          }
        }))
      };

    const handleChangeDeleteImageMinuta=(idx)=>{
        const newDataImage = imagesMinuta?.filter((_, index)=>index!== idx);
        setImagesMinuta(newDataImage);
    };

    if (loading || loadingDataSeniors) {
        return <p>Cargando ...</p>
    };

    switch(activeStep){
        case 0:
            return(
                <main className='grid grid-cols-3 gap-2'>
                    <section className='col-span-2 p-6'>
                        <FormStepper
                            handleSaveData={handleClickFormStepper}
                            backActiveStep={backActiveStep}
                        />
                    </section>
                    <section className='col-span-1'>
                        <CardShowDnisPerson
                            buyersData={dataContract?.buyersData}
                            sellersData={dataContract?.sellersData}
                        />
                    </section>
                </main>
            )
        case 1:
            return (
                <main className='p-6 w-full'>
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
                </main>
            )
        case 2:
            return(
                <main className='w-full grid grid-cols-3 gap-4 '>
                    <section className='flex justify-center col-span-2 p-6'>
                    <div className='w-full bg-white p-6 rounded-lg shadow mt-8 pb-4'>
                    <section>
                        <Title1 className='text-3xl'>Información Restante</Title1>
                        <p>Ingresa la información restantes para generar la escritura</p>
                    </section>
                    <section>
                        <Title1 className='text-2xl'>Información de las fojas</Title1>
                        <FojasDataForm
                        fojasData={dataSendMinuta.fojasData}
                        handleChangeFojasDatas={handleChangeFojasDatas}
                        />
                    </section>
                    <section className='my-2'>
                        <Title1>Información del pago</Title1>
                        <div className='flex flex-row gap-4 w-full'>
                        <FormControl  className="w-[400px]">
                            <InputLabel>Moneda</InputLabel>
                            <Select
                            value={dataSendMinuta?.payment.unit}
                            onChange={(e) => handleChangePaymentForm("unit", e.target.value)}
                            >
                            <MenuItem value="soles">Soles</MenuItem>
                            <MenuItem value="dollar">Dólares</MenuItem>
                            </Select>
                        </FormControl>
        
                        <TextField
                            label="Monto"
                            type="number"
                            value={dataSendMinuta?.payment.amount}
                            onChange={(e) => handleChangePaymentForm("amount", parseFloat(e.target.value) || 0)}
                            fullWidth
                        />
                        </div>
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
                    <section className='col-span-1'>
                        <CardShowVehicleData
                            cardData={dataContract?.carData}
                        />
                    </section>
                </main>
            )
        case 3:
            return(
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
        case 4:
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
    <Suspense fallback={()=><p>Cargando...</p>}>
        <RenderPageScript/>
    </Suspense>
  )
};