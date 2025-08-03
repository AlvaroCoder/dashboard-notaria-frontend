'use client';

import { parseTextoToJSON } from '@/common/parserText';
import Title1 from '@/components/elements/Title1';
import FormFounders from '@/components/Forms/FormFounders';
import FormUploadMinuta2 from '@/components/Forms/FormUploadMinuta2';
import FormViewerPdfEscritura from '@/components/Forms/FormViewerPdfEscritura';
import { Button } from '@/components/ui/button';
import EditorView from '@/components/Views/EditorView';
import { useEditorContext } from '@/context/ConextEditor';
import { useContracts } from '@/context/ContextContract';
import { headersTableroCliente } from '@/data/Headers';
import { useFetch } from '@/hooks/useFetch';
import {
  asignJuniorToContracts,
  generateScriptContract,
  processDataMinuta,
  sendDataMinuta,
  submitDataPreMinuta,
} from '@/lib/apiConnections';
import { formatDateToYMD } from '@/lib/fechas';
import { TextField } from '@mui/material';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import React, { useReducer, useState } from 'react';
import { toast } from 'react-toastify';

const TableSelectedUser = dynamic(() => import('@/components/Tables/TableSelectedUser'), {
  ssr: false,
  loading: () => <>Cargando Tabla ... </>
});

const TableroCarga = dynamic(() => import('@/components/Loading/TableroCarga'), {
  ssr: false
});

// Reducer para el estado complejo de la minuta
const initialMinutaState = {
  header: {
    numeroDocumentoNotarial: '',
    numeroRegistroEscritura: '',
    year: '',
    folio: '',
    tomo: '',
    kardex: ''
  },
  fojasData: {
    start: { number: '1123', serie: 'C' },
    end: { number: '1125V', serie: 'C' }
  },
  clientId: null,
  minuta: null,
  contractId: null,
  founders: null,
  corporation: '',
  notario: null,
  creationDay: null
};

function minutaReducer(state, action) {
  switch (action.type) {
    case 'SET_CLIENT_ID':
      return { ...state, clientId: action.payload };
    case 'SET_MINUTA':
      return { ...state, minuta: action.payload };
    case 'SET_MINUTA_CONTENT':
      return { ...state, minuta: { ...state.minuta, minutaContent: action.payload } };
    case 'SET_CONTRACT_ID':
      return { ...state, contractId: action.payload };
    case 'SET_FOUNDERS':
      return { ...state, founders: { people: action.payload } };
    case 'SET_CORPORATION':
      return { ...state, corporation: action.payload };
    case 'SET_HEADER':
      return { ...state, header: { ...state.header, ...action.payload } };
    case 'SET_NOTARIO':
      return {
        ...state,
        notario: action.payload,
        creationDay: { date: formatDateToYMD(new Date()) }
      };
    default:
      return state;
  }
}

// Componentes para cada paso
const Step0SelectClient = ({ dataClientes, headersTableroCliente, handleClickSelectClient }) => (
  <TableSelectedUser
    title='Selecciona un cliente'
    descripcion='Tabla de clientes, selecciona uno para continuar'
    headers={headersTableroCliente}
    data={dataClientes?.data}
    slugCrear={'/dashboard/clientes/form-add'}
    handleClickSelect={handleClickSelectClient}
  />
);

const Step1UploadMinuta = ({ loading, handleUploadMinuta, dataSelected }) => (
  <section className='p-6 grid grid-cols-1 lg:grid-cols-3 gap-2'>
    <FormUploadMinuta2 loading={loading} handleUploadMinuta={handleUploadMinuta} />
    <section className='hidden col-span-1 bg-white p-4 h-fit shadow rounded-sm lg:flex flex-col gap-4'>
      <section>
        <Title1>Cliente Seleccionado : </Title1>
        <h1 className='text-sm'>Nombre : {dataSelected?.client?.firstName || '-'}</h1>
        <h1 className='text-sm'>Usuario : {dataSelected?.client?.userName || '-'}</h1>
        <p>Cliente</p>
      </section>
      <section>
        <Button className={'w-full py-4'}>Cambiar Cliente</Button>
      </section>
    </section>
  </section>
);

const Step2Editor = ({ loading, handleSubmitPreMinuta }) => (
  <section className='relative h-screen overflow-y-auto w-full flex-1'>
    <EditorView />
    <div className='p-4 w-full'>
      <Button onClick={handleSubmitPreMinuta} className={'w-full mt-4'}>
        {loading ? <Loader2 /> : <p>Continuar</p>}
      </Button>
    </div>
  </section>
);

const Step3SelectJunior = ({ loading, loadingDataJuniors, dataJuniors, headersTableroCliente, handleClickSelectJunior }) => (
  <section className='w-full h-screen overflow-y-auto pb-24 grid grid-cols-1 p-8 gap-2'>
    {loadingDataJuniors || loading ? (
      <TableroCarga headers={headersTableroCliente} />
    ) : (
      <TableSelectedUser
        title='Selecciona un Junior'
        descripcion='Selecciona el Junior que se va a encargar (5 tareas por Junior)'
        headers={headersTableroCliente}
        data={dataJuniors?.data}
        slugCrear={'/dashboard/juniors/form-add'}
        handleClickSelect={handleClickSelectJunior}
      />
    )}
  </section>
);

const Step4Founders = ({ handleSubmitFormStepperPerson }) => (
  <section className='w-full flex justify-center items-center'>
    <div className='max-w-5xl w-full'>
      <FormFounders handleSendFounder={handleSubmitFormStepperPerson} />
    </div>
  </section>
);

const Step5RemainingInfo = ({ minutaState, handleChangeHeader, handleNextStep }) => (
  <section className='w-full flex justify-center items-center'>
    <div className='max-w-5xl w-full bg-white p-6 rounded-lg shadow mt-8'>
      <section>
        <Title1 className='text-3xl'>Informacion Restante</Title1>
        <p>Ingresa la información restante para generar la escritura</p>
      </section>
      <section className='my-4'>
        <Title1>Información de la asociación</Title1>
        <TextField
          label='Corporacion'
          onChange={e => handleChangeHeader({ corporation: e.target.value })}
          value={minutaState.corporation}
          fullWidth
          required
        />
      </section>
      <section className='my-4'>
        <Title1>Información de la cabecera</Title1>
        <div className='grid grid-cols-2 gap-4'>
          {[
            { name: 'numeroDocumentoNotarial', label: 'Nro Documento Notarial', type: 'number' },
            { name: 'numeroRegistroEscritura', label: 'Nro Registro Escritura', type: 'number' },
            { name: 'year', label: 'Año', type: 'number' },
            { name: 'folio', label: 'Folio', type: 'number' },
            { name: 'tomo', label: 'Tomo' },
            { name: 'kardex', label: 'Kardex', type: 'number' }
          ].map(field => (
            <TextField
              key={field.name}
              label={field.label}
              type={field.type}
              onChange={e => handleChangeHeader({ [e.target.name]: e.target.value })}
              name={field.name}
              value={minutaState.header[field.name]}
              fullWidth
              required
            />
          ))}
        </div>
      </section>
      <Button onClick={handleNextStep} className={'w-full mt-4'}>
        Continuar
      </Button>
    </div>
  </section>
);

const Step6SelectSenior = ({ loading, loadingDataSeniors, dataSeniors, headersTableroCliente, handleClickSenior, notarioSelected, handleSubmitData }) => (
  <section className='w-full h-screen overflow-y-auto p-8 pb-24 flex flex-col gap-4'>
    {loadingDataSeniors ? (
      <TableroCarga headers={headersTableroCliente} />
    ) : (
      <TableSelectedUser
        title='Selecciona un seniors'
        descripcion='Tabla de seniors, selecciona uno para continuar'
        headers={headersTableroCliente}
        data={dataSeniors?.data}
        slugCrear={'/dashboard/seniors/form-add'}
        handleClickSelect={handleClickSenior}
      />
    )}
    {notarioSelected && (
      <div className='p-4 bg-white shadow rounded-lg'>
        <Title1>Notario Seleccionado : </Title1>
        <p>Información del notario seleccionado</p>
        <section>
          <h1>Nombre {notarioSelected?.firstName} {notarioSelected?.lastName}</h1>
          <h1>Usuario : {notarioSelected?.userName}</h1>
        </section>
      </div>
    )}
    <Button disabled={!notarioSelected} onClick={handleSubmitData} className={'w-full mt-4'}>
      {loading ? <Loader2 className='animate-spin' /> : <p>Enviar data</p>}
    </Button>
  </section>
);

const Step7PdfViewer = ({ viewPdf }) => (
  <section className='p-4 w-full'>
    <FormViewerPdfEscritura viewerPdf={viewPdf} />
  </section>
);

function RenderApp() {
  const [loading, setLoading] = useState(false);
  const [minutaState, dispatch] = useReducer(minutaReducer, initialMinutaState);
  const [notarioSelected, setNotarioSelected] = useState(null);
  const [viewPdf, setViewPdf] = useState(null);

  const { activeStep, dataSelected, fileLocation, handleClickClient, pushActiveStep, handleChangeFileLocation } =
    useContracts();
  const { agregarBloques, parserData } = useEditorContext();

  const URL_GET_DATA_CLIENTES = process.env.NEXT_PUBLIC_URL_HOME + '/client';
  const URL_GET_DATA_JUNIORS = process.env.NEXT_PUBLIC_URL_HOME + '/junior';
  const URL_GET_DATA_SENIORS = process.env.NEXT_PUBLIC_URL_HOME + '/senior';

  const { data: dataClientes, loading: loadingDataClientes } = useFetch(URL_GET_DATA_CLIENTES);
  const { data: dataJuniors, loading: loadingDataJuniors } = useFetch(URL_GET_DATA_JUNIORS);
  const { data: dataSeniors, loading: loadingDataSeniors } = useFetch(URL_GET_DATA_SENIORS);

  const handleClickSelectClient = client => {
    pushActiveStep();
    handleClickClient(client);
    toast.info('Cliente seleccionado', { position: 'bottom-right' });
    dispatch({ type: 'SET_CLIENT_ID', payload: client?.id });
  };

  const handleClickSelectJunior = async junior => {
    setLoading(true);
    try {
      const response = await asignJuniorToContracts(minutaState?.contractId, junior?.id);
      if (!response.ok || response.status === 406) {
        throw new Error('El junior excede la cantidad maxima que puede manipular');
      }
      toast.success('Se asignó el Junior correctamente', { position: 'bottom-right' });
      pushActiveStep();
    } catch (err) {
      toast.error('Ocurrió un error al asignar el junior', { position: 'bottom-center' });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadMinuta = async (minuta, detailsMinuta) => {
    if (!minuta) {
      toast.error('Subir minuta', { position: 'bottom-center' });
      return;
    }
    setLoading(true);
    try {
      const newFormData = new FormData();
      newFormData.append('minutaFile', minuta);
      const responseUpload = await sendDataMinuta(newFormData);
      const jsonResponseUpload = await responseUpload.json();
      const fileLocation = jsonResponseUpload?.fileLocation;
      const responseProcess = await processDataMinuta(newFormData);
      const responseProcessJson = await responseProcess.json();
      const parserText = parseTextoToJSON(responseProcessJson?.minuta_content);
      handleChangeFileLocation(fileLocation);
      agregarBloques(parserText?.data);

      dispatch({
        type: 'SET_MINUTA',
        payload: {
          minutaNumber: detailsMinuta?.number,
          creationDay: { date: formatDateToYMD(new Date()) },
          place: { name: detailsMinuta?.namePlace, district: detailsMinuta?.districtPlace }
        }
      });
      pushActiveStep();
    } catch (err) {
      console.error(err);
      toast.error('Error con la vista de minuta', { position: 'bottom-center' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPreMinuta = async () => {
    setLoading(true);
    try {
      const dataParseada = parserData();
      const JSONPreMinuta = {
        clientId: dataSelected?.client?.id,
        processPayment: 'Pago a la mitad',
        minutaDirectory: `DB_evidences/${fileLocation?.directory}/${fileLocation?.fileName}`,
        datesDocument: { processInitiate: formatDateToYMD(new Date()) },
        directory: `DB_evidences/${fileLocation?.directory}`
      };

      const response = await submitDataPreMinuta(JSONPreMinuta, 'rs');
      if (!response.ok || response.status === 422) {
        throw new Error('Error al momento de subir la informacion');
      }
      const responseJSON = await response.json();
      dispatch({ type: 'SET_MINUTA_CONTENT', payload: { data: dataParseada } });
      dispatch({ type: 'SET_CONTRACT_ID', payload: responseJSON?.contractId });
      toast.success('Se creó el proceso', { position: 'bottom-right' });
      pushActiveStep();
    } catch (err) {
      console.error(err);
      toast.error('Hubo un error en iniciar el proceso', { position: 'bottom-center' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitData = async () => {
    setLoading(true);
    try {
      const response = await generateScriptContract('razonSocial', minutaState);
      const blobResponse = await response.blob();
      const url = URL.createObjectURL(blobResponse);
      setViewPdf(url);
      pushActiveStep();
    } catch (err) {
      console.error(err);
      toast.error('Surgió un error', { position: 'bottom-center' });
    } finally {
      setLoading(false);
    }
  };

  const stepComponents = {
    0: (
      <section className='p-6'>
        <Step0SelectClient
        dataClientes={dataClientes}
        headersTableroCliente={headersTableroCliente}
        handleClickSelectClient={handleClickSelectClient}
      />
      </section>
    ),
    1: (
      <Step1UploadMinuta
        loading={loading}
        handleUploadMinuta={handleUploadMinuta}
        dataSelected={dataSelected}
      />
    ),
    2: <Step2Editor loading={loading} handleSubmitPreMinuta={handleSubmitPreMinuta} />,
    3: (
      <Step3SelectJunior
        loading={loading}
        loadingDataJuniors={loadingDataJuniors}
        dataJuniors={dataJuniors}
        headersTableroCliente={headersTableroCliente}
        handleClickSelectJunior={handleClickSelectJunior}
      />
    ),
    4: (
      <Step4Founders
        handleSubmitFormStepperPerson={dataFounder => {
          dispatch({ type: 'SET_FOUNDERS', payload: dataFounder });
          pushActiveStep();
        }}
      />
    ),
    5: (
      <Step5RemainingInfo
        minutaState={minutaState}
        handleChangeHeader={payload => dispatch({ type: 'SET_HEADER', payload })}
        handleNextStep={() => pushActiveStep()}
      />
    ),
    6: (
      <Step6SelectSenior
        loading={loading}
        loadingDataSeniors={loadingDataSeniors}
        dataSeniors={dataSeniors}
        headersTableroCliente={headersTableroCliente}
        handleClickSenior={senior => {
          setNotarioSelected(senior);
          dispatch({
            type: 'SET_NOTARIO',
            payload: {
              firstName: senior?.firstName,
              lastName: senior?.lastName,
              dni: senior?.dni,
              ruc: senior?.ruc
            }
          });
        }}
        notarioSelected={notarioSelected}
        handleSubmitData={handleSubmitData}
      />
    ),
    7: <Step7PdfViewer viewPdf={viewPdf} />
  };

  return stepComponents[activeStep] || null;
}

export default function Page() {
  const { loading } = useContracts();

  if (loading) {
    return <p>Cargando ...</p>;
  } else {
    return (
      <main>
        <section className='p-6 w-full'>
          <Title1 className='text-3xl'>Nuevo Contrato de constitucion de Razon Social</Title1>
          <p className='text-gray-600 text-sm'>Genera la escritura de la Razon Social</p>
        </section>
        <RenderApp />
      </main>
    );
  }
}