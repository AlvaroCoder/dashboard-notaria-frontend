'use client'
import Title1 from '@/components/elements/Title1';
import FojasDataForm from '@/components/Forms/FojasDataForm';
import FormFounders from '@/components/Forms/FormFounders';
import FormHeaderInformation from '@/components/Forms/FormHeaderInformation';
import FormUploadMinuta2 from '@/components/Forms/FormUploadMinuta2';
import FormViewerPdfEscritura from '@/components/Forms/FormViewerPdfEscritura';
import { Button } from '@/components/ui/button';
import { useContracts } from '@/context/ContextContract';
import { headersTableroCliente } from '@/data/Headers';
import { useFetch } from '@/hooks/useFetch';
import { generateScriptContract, getDataContractByIdContract } from '@/lib/apiConnections';
import { formatDateToYMD } from '@/lib/fechas';
import { TextField } from '@mui/material';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const TableSelectedUser = dynamic(()=>import('@/components/Tables/TableSelectedUser'),{
  ssr : false,
  loading : ()=><>Cargando Tabla ...</>
});

function RenderPageScript() {
    const URL_GET_DATA_SENIORS = process.env.NEXT_PUBLIC_URL_HOME+'/senior';
    const {
        data : dataSeniors,
        loading : loadingDataSeniors
    } = useFetch(URL_GET_DATA_SENIORS);

    const searchParams = useSearchParams();
    const idContract = searchParams?.get('idContract');
    const contractType = searchParams?.get('contractType');

    const {
        activeStep,
        dataSelected,
        pushActiveStep,
        backActiveStep
    } = useContracts();
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
    const [loading, setLoading] = useState(false);
    const [seniorSelected, setSeniorSelected] = useState(null);
    const [viewPdf, setViewPdf] = useState(null);
    
    useEffect(()=>{ 
        async function getData() {
            try {
                setLoading(true);
                const responseContract = await getDataContractByIdContract(idContract);

                const responseContractJSON = await responseContract.json();
                
                if (responseContractJSON?.data?.juniorId === '') {
                    toast("Asigne primero al junior",{
                        type : 'warning',
                        position : 'bottom-center'
                    });
                    router.push(`/dashboard/juniors/asign/?idContract=${idContract}`)
                    return;
                }

                

            } catch (err) {
                console.log(err);
                
                toast("Se produjo un error",{
                    position : 'bottom-center',
                    type : 'error'
                });

            } finally {
                setLoading(false);
            }
        }
        getData();
    }, [idContract]);
    

    const handleSubmitFormStepperPerson=(dataFounder)=>{
        setDataSendMinuta({
            ...dataSendMinuta,
            founders : {
                people : dataFounder
            }
        });
        setActiveStep(activeStep+1)
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
        setSeniorSelected(senior);
        setDataSendMinuta((prev)=>({
            ...dataSendMinuta,
            notario : {
                firstName : senior?.firstName,
                lastName : senior?.lastName,
                dni : senior?.dni,
                ruc : senior?.ruc
            },
            creationDay : {
                date : formatDateToYMD(new Date())
            },
            contractId : idContract,
            minuta : {
                ...prev.minuta,
                creationDay : {
                    date : formatDateToYMD(new Date())
                }
            }
        }))
    }

 

    const handleSubmitData=async()=>{
        try {
            setLoading(true);

            const response = await generateScriptContract(contractType === 'RS'?'razonSocial':contractType?.toLowerCase(), dataSendMinuta);
            if (!response.ok) {
                console.log(await response.json());
                console.log(dataSendMinuta);
                return
            }
            
            const blobResponse = await response.blob();
            const url = URL.createObjectURL(blobResponse);

            setViewPdf(url);
            pushActiveStep()

        } catch (err) {
            console.log(err);
            toast("Surgio un error",{
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

    if (loading || loadingDataSeniors) {
        return <p>Cargando ...</p>
    }
    switch (activeStep) {
        case 0:
            return (
                <main className='p-6 grid grid-cols-1 gap-2'>
                    <FormUploadMinuta2
                        loading={loading}

                    />
                </main>
            )
        case 1:
            return(
                <main className='w-full flex justify-center items-center'>
                    <div className='max-w-5xl p-4 lg:p-0 w-full'>
                        <FormFounders
                            handleSendFounder={handleSubmitFormStepperPerson}
                        />
                    </div>
                </main>
            )
        case 2:
            return(
                <main className='w-full flex justify-center items-center'>
                    <div className='max-w-5xl w-full bg-white p-6 rounded-lg shadow mt-8'>
                        <section>
                            <Title1 className='text-3xl'>Información Restante</Title1>
                            <p>Ingresa la información restante para generar la escritura</p>
                        </section>
                        <section>
                            <Title1 className='text-2xl'>Informacion de Fojas</Title1>
                            <FojasDataForm
                                fojasData={dataSendMinuta.fojasData}
                                handleChangeFojasDatas={handleChangeFojasDatas}
                            />
                        </section>
                        <section>
                            <Title1>Información de la asociación</Title1>
                            <TextField label="Coporacion" onChange={(e)=>setDataSendMinuta({...dataSendMinuta, corporation : e.target.value})} fullWidth required />
                        </section>
                        <section className='flex flex-col gap-4'>
                            <Title1>Informacion de la minuta</Title1>
                            <TextField label="Numero de la minuta" onChange={(e)=>setDataSendMinuta((prev)=>({...dataSendMinuta, minuta : {...prev?.minuta, minutaNumber : e.target.value}}))} fullWidth required />
                            <TextField label="Lugar de la minuta" onChange={(e)=>setDataSendMinuta((prev)=>({...dataSendMinuta, minuta : {...prev?.minuta, place : {...prev.minuta.place, name : e.target.value}}}))} fullWidth required />
                            <TextField label="Distrito de la minuta" onChange={(e)=>setDataSendMinuta((prev)=>({...dataSendMinuta, minuta : {...prev?.minuta, place : {...prev.minuta.place, district : e.target.value}}}))} fullWidth required />
                        </section>
                        
                        <FormHeaderInformation
                            handleChangeHeader={handleChangeHeader}
                            data={dataSendMinuta}
                        />
                        <Button
                            onClick={()=>setActiveStep(activeStep + 1)}
                            className={"w-full mt-4"}
                        >
                            Continuar
                        </Button>
                    </div>
                </main>
            )
        case 3:
            return (
                <main className='w-full h-screen overflow-y-auto p-8 flex flex-col gap-4'>
                    <TableSelectedUser
                        title='Selecciona un senior'
                        descripcion='Tabla de seniors, selecciona uno para continuar'
                        headers={headersTableroCliente}
                        data={dataSeniors?.data}
                        slugCrear={'/dashboard/seniors/form-add'}
                        handleClickSelect={handleClickSenior}
                    />
                    {
                        seniorSelected && 
                        (
                            <div className='p-4 bg-white shadow rounded-lg'>
                                <Title1>Notario Seleccionado : </Title1>
                                <p>Información del notario seleccionado</p>
                                <section>
                                    <h1>Nombre : {seniorSelected?.firstName} {seniorSelected?.lastName}</h1>
                                    <h1>Usuario : {seniorSelected?.userName}</h1>
                                </section>
                            </div>
                        )
                    }
                    <Button
                        disabled={!seniorSelected}
                        onClick={handleSubmitData}
                        className={"w-full mt-4"}
                    >
                        {loading ? <Loader2 className='animate-spin'/> : <p>Enviar datos</p>}
                    </Button>
                </main>
            )
        case 3:
            return (
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
        <section>
          
        <RenderPageScript/>
        </section>
    </Suspense>
  )
}
