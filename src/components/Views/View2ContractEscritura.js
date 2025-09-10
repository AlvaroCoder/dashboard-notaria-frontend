import React, { useState } from 'react'
import {statusContracts} from '@/lib/commonJSON';
import dynamic from 'next/dynamic';
import {Button} from '../ui/button';
import {camelCaseToTitle, cn} from '@/lib/utils';
import {Loader2, User2} from 'lucide-react';
import { TextField } from '@mui/material';
import CardPersonBuyerSeller from '../Cards/CardPersonBuyerSeller';
import ButtonDownloadWord from '../elements/ButtonDownloadWord';
import ButtonUploadWord from '../elements/ButtonUploadWord';
import CardAviso from '../Cards/CardAviso';
import { updateEscrituraWord } from '@/lib/apiConnections';
import { toast } from 'react-toastify';
import Separator2 from '../elements/Separator2';
import ViewButtonUploadMinuta from './ViewButtonUploadMinuta';

// ✅ Dynamic imports
const FramePdf = dynamic(() => import('@/components/elements/FramePdf'), { ssr: false });
const Title1 = dynamic(() => import('@/components/elements/Title1'), {ssr : false});
const FramePdfWord = dynamic(()=>import('@/components/elements/FramePdfWord'),{ssr : false})
export default function View2ContractEscritura({
	idContract,
	dataContract,
	loadingDataClient,
	client,
	junior,
	loading=false,
	checkViewEscritura =()=>{}
}) {
	const [loadingUpdateWord, setLoadingUpdateWord] = useState(false)
	const [fileWord, setFileWord] = useState(null);
	const handleChangeDocumentWord=(file)=>{
		setFileWord(file);
	}

	const handleUpdateEscritura=async()=>{
		try {
			setLoadingUpdateWord(true);
			const newFormData = new FormData();
			newFormData.append('file', fileWord);

			await updateEscrituraWord(dataContract?.documentPaths?.escrituraPath, newFormData, idContract);
			
			toast("Se actualizo la información de la escritura",{
				type : 'info',
				position : 'bottom-right'
			});
			
			window.location.reload();

		} catch (err) {
			toast("Ocurrio un error",{
				type : 'error',
				position : 'bottom-center'
			})
		}finally {
			setLoadingUpdateWord(false);
		}
	}

	return (
    <div className="h-screen pb-24 p-8 space-y-6 overflow-y-auto">
	<section className="flex flex-row justify-between">
	   <div>
	    <Title1 className="text-3xl">Contrato Generado</Title1>
	    <p>Informacion general de la escritura generada</p>
	  </div>
	</section>
	<section>
	    <p><b>ID : </b>{idContract}</p>
	    <p className="my-1"><b>Estado : </b>{statusContracts?.filter((est)=>est?.id === dataContract?.status).map((item)=><span key={item.title} className={cn('px-2 py-1 rounded-sm text-sm space-y-4', item.bgColor)}>{item.title}</span>)}</p>
	    <p><b>Tipo de Contrato : </b><span>{camelCaseToTitle(dataContract ? dataContract?.contractType : '')}</span></p>
        <p className='flex flex-row gap-2'><b>Cliente : </b> <User2/>{loadingDataClient ?<Loader2 className='animate-spin'/> : <span>{client?.userName}</span>}</p>
    </section>

	<section className='shadow bg-white p-4 rounded-lg '>
		<Title1 className='text-2xl' >Información de la minuta</Title1>
		<div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4'>
			<TextField label="Nro Documento Notarial" value={dataContract?.minuta?.minutaNumber}  type='number' disabled fullWidth  />
			<TextField label="Lugar" value={dataContract?.minuta?.place?.name} disabled fullWidth />
			<TextField label="Distrito" value={dataContract?.minuta?.place?.district} disabled fullWidth />
			<TextField label="Fecha creacion" value={dataContract?.minuta?.creationDay?.date} disabled fullWidth />
			
		</div>
		<Separator2/>
		<div className='mt-4'>
			<Title1>Minuta Subida</Title1>
			{
				dataContract?.minutaDirectory ?
				<FramePdf
					directory={dataContract?.minutaDirectory}
				/> :
				<div className='w-full p-4 rounded-sm'>
					<CardAviso
						advise='Aun no se sube la minuta'
					/>
					<ViewButtonUploadMinuta
						contractId={dataContract?.id}
						directory={dataContract?.directory?.split('/')[1]}
					/>
				</div>
			}
		</div>
	</section>
	<section className='bg-white p-4 rounded-lg mt-4 shadow'>
		<Title1 className='text-2xl'>Información de los fundadores</Title1>
		<div className='w-full grid grid-cols-1 mt-4 gap-4 md:grid-cols-2 lg:grid-cols-3'>
			{
				dataContract?.founders?.people?.map((found, idx)=>(
					<CardPersonBuyerSeller
						key={idx}
						person={found}
					/>
				))
			}
		</div>
	</section>


	<ButtonDownloadWord
		dataContract={dataContract}
		idContract={idContract}
	/>

	<section className='rounded-lg shadow p-4'>
		<div>
			<Title1 className='text-2xl'>Información de la escritura</Title1>
			<div className=''>
				<Title1>Información de las Fojas</Title1>
				<div className='flex flex-col gap-4'>
					<Title1>Inicio</Title1>
					<section className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
						<TextField
							disabled
							value={dataContract?.fojasData?.start?.number}
						/>
						<TextField
							disabled
							value={dataContract?.fojasData?.start?.serie}
						/>
					</section>
				</div>
				<div className='flex flex-col gap-4'>
					<Title1>Final</Title1>
					<section className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
						<TextField
							disabled
							value={dataContract?.fojasData?.end?.number}
						/>
						<TextField
							disabled
							value={dataContract?.fojasData?.end?.serie}
						/>
					</section>
				</div>
			</div>
		</div>

		<Separator2/>
		<div>

			<Title1 className='text-2xl'>Escritura generada</Title1>
			{
				dataContract?.pdfDocumentPaths?.escrituraPath === '' ?
				<div className='w-full p-4 rounded-sm'>
					<CardAviso
						advise='Aun no se genera el PDF de la escritura, actualiza la escritura para generar el PDF'
					/>

				</div> :
				<FramePdfWord
				
					path={dataContract?.pdfDocumentPaths?.escrituraPath}
				/>
			}
		</div>
	</section>

	<section className='w-full rounded-sm shadow p-4'>
		<div className='w-full'>
			<Title1>Subir Escritura actualizada</Title1>
			<div className='my-4'>
				<CardAviso
					advise='NO OLVIDAR DE AGREGAR EL CUERPO DE LA MINUTA'
				/>
			</div>
		</div>
		<ButtonUploadWord
			handleSetFile={handleChangeDocumentWord}
		/>
		<Button
			disabled={!fileWord || loadingUpdateWord}
			className={"w-full mt-4"}
			onClick={handleUpdateEscritura}
		>
			{loadingUpdateWord ? <Loader2 className='animate-spin'/> : <p>Actualizar Escritura</p>}
		</Button>
	</section>

	<Button
		className={"w-full my-4 "}
		onClick={checkViewEscritura}
		disabled={loading}
	>
		{loading ? <Loader2 className='animate-spin'/> : <p>Verificar la Escritura</p>}
	</Button>
   </div>
  )
};
