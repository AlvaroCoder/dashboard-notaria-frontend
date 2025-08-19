'use client';
import CardAviso from '@/components/Cards/CardAviso';
import CardNotarioSelected from '@/components/Cards/CardNotarioSelected';
import ButtonDownloadWord from '@/components/elements/ButtonDownloadWord';
import ButtonUploadImageMinuta from '@/components/elements/ButtonUploadImageMinuta';
import Title1 from '@/components/elements/Title1';
import FojasDataForm from '@/components/Forms/FojasDataForm';
import FormHeaderInformation from '@/components/Forms/FormHeaderInformation';
import FormStepper from '@/components/Forms/FormStepper';
import FormViewerPdfEscritura from '@/components/Forms/FormViewerPdfEscritura';
import { Button } from '@/components/ui/button';
import { useContracts } from '@/context/ContextContract';
import { cardDataVehiculos } from '@/data/CardData';
import { headersTableroCliente } from '@/data/Headers';
import { useFetch } from '@/hooks/useFetch';
import { useSession } from '@/hooks/useSesion';
import { asignJuniorToContracts, generateScriptCompraVenta, getDataContractByIdContract, subirEvidencias, subirEvidenciasSinDirectorio } from '@/lib/apiConnections';
import { formatDateToYMD } from '@/lib/fechas';
import { funUploadDataMinutaCompraVenta } from '@/lib/functionUpload';
import { Divider, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

const TableSelectedUser = dynamic(()=>import('@/components/Tables/TableSelectedUser'),{
  ssr : false,
  loading : ()=><>Cargando Tabla .... </>
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
    data : dataClientes
  } = useFetch(URL_GET_DATA_CLIENTES);

  const { 
    data : dataSeniors
  } = useFetch(URL_GET_DATA_SENIORS);

  const {
    activeStep,
    dataSelected,
    handleClickClient,
    pushActiveStep,
  } = useContracts();

  const [imagesMinuta, setImagesMinuta] = useState([]);

  const [dataSendMinuta, setDataSendMinuta] = useState({
    contractId : null,
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
  
  const [notarioSelected, setNotarioSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewPdf, setViewPdf] = useState(null);
  const [dataContract, setDataContract] = useState(null);

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

  const handleClickEvidences=async(e)=>{
    e.preventDefault();
    try {
      console.log(imagesMinuta);
      
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
  const handleSubmitData = async () => {
    try {
      setLoading(true);
  
      let newDataSendMinuta = {
        ...dataSendMinuta,
        clientId: dataSelected?.client?.id
      };
  
      if (imagesMinuta && imagesMinuta.length > 0) {
        // Si hay imágenes, las subimos
        const formDataImages = new FormData();
        imagesMinuta.forEach((image) => {
          formDataImages.append("evidence", image[0]);
        });
  
        const responseEvidencias = await subirEvidenciasSinDirectorio(formDataImages);
        const fileLocation = (await responseEvidencias.json())?.fileLocation;
  
        const evidencesList = fileLocation?.fileNames?.map((file) => {
          return `DB_evidences/${fileLocation?.directory}/${file}`;
        });
  
        newDataSendMinuta.paymentMethod = {
          ...dataSendMinuta?.paymentMethod,
          evidences: evidencesList
        };
  
        toast("Imagenes subidas correctamente", {
          type: "success",
          position: "bottom-right"
        });
      } else {
        // Si no hay imágenes, se asigna null
        newDataSendMinuta.paymentMethod = null;
      }
      
      const responseGenerateScript = await generateScriptCompraVenta(
        "vehiculo",
        newDataSendMinuta
      );
  
      if (!responseGenerateScript.ok || responseGenerateScript.status === 404) {
        toast("Hubo un error al generar la escritura", {
          type: "error",
          position: "bottom-center"
        });
        console.log(await responseGenerateScript.json());
        return;
      }
      
      let idContract;
      if (dataSession?.payload?.role === "junior") {
        idContract = responseGenerateScript.headers.get("contractId");
  
        const responseJuniorAsigned = await asignJuniorToContracts(
          idContract,
          dataSession?.payload?.id
        );
  
        if (!responseJuniorAsigned.ok || responseJuniorAsigned.status === 406) {
          console.log(await responseJuniorAsigned.json());
  
          toast("El junior excede la cantidad maxima que puede manipular", {
            type: "error",
            position: "bottom-center"
          });
          return;
        }
  
        toast("Se asigno el Junior correctamente", {
          type: "success",
          position: "bottom-right"
        });
      }
  
      const blobResponse = await responseGenerateScript.blob();
      const url = URL.createObjectURL(blobResponse);

      const a = document.createElement("a");
      a.href = url;
      a.download = "escritura_vehiculo.docx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(()=>URL.revokeObjectURL(url), 4000);

      const responseContract = await getDataContractByIdContract(idContract);
      const responseContractJSON = await responseContract.json();

      setDataContract(responseContractJSON?.data);

      pushActiveStep();
    } catch (err) {
      console.log(err);
  
      toast("Surgio un error en la api", {
        type: "error",
        position: "bottom-center"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleChangePaymentForm = (field, value) => {
    // notifica al padre
    setDataSendMinuta((prev)=>({
      ...dataSendMinuta,
      payment : {
        ...prev.payment,
        [field] : value
      }
    }))
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
              <section>
                <Title1>Ejemplo de lo que debes de subir </Title1>
                <section className='my-4'>
                  <CardAviso
                    advise='CHEQUES DE GERENCIA EMITIDOS POR EL BANCO BBVA'
    
                  />
                </section>
              </section>
              <TextField className='w-full' onChange={(e)=>setDataSendMinuta((prev)=>({...dataSendMinuta, paymentMethod : {...prev?.paymentMethod, caption : e.target.value}}))} label="Indique el medio de pago" fullWidth />
            </div>
          }
          <Button
            disabled={loading}
            className={"w-full mt-6"}
            onClick={handleClickEvidences}
          >
            {loading ? <Loader2 className='animate-spin'/> : <p>Continuar</p>}
          </Button>
        </section>
      )
    case 4:
      return(
        <section className='w-full flex justify-center'>
          <div className='w-full bg-white px-6 rounded-lg shadow mt-8 pb-4'>
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

                {/* Input de Monto */}
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
      )
    case 5:
      return(
        <section className='flex flex-col gap-4'>
          <TableSelectedUser
            title='Selecciona un notario'
            descripcion='Selecciona un notario para el proceso'
            slugCrear={'/dashboard/seniors/form-add'}
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
    case 6:
      return(
        < section className='p-4 w-full'>
          <Title1>Descarga el documento si es necesario</Title1>
          <p>En caso no haya empezado la descarga, descarga el documento</p>
          <ButtonDownloadWord
            dataContract={dataContract}
            idContract={dataContract?.id}
          />
        </section>
      )
  }
}

export default function Page() {
  const {dataSession} = useSession();
  return (
    <section className='w-full h-screen overflow-y-auto pb-24 grid grid-cols-1 p-8 gap-2'>
      <RenderCardsFormStepper
        dataSession={dataSession}
        
      />
    </section>
  )
};