import React from 'react'
import {statusContracts} from '@/lib/commonJSON';
import dynamic from 'next/dynamic';
import {Button} from '../ui/button';
import {camelCaseToTitle, cn} from '@/lib/utils';
import {Loader2, User2} from 'lucide-react';

// ✅ Dynamic imports
const FramePdf = dynamic(() => import('@/components/elements/FramePdf'), { ssr: false });
const Separator2 = dynamic(() => import('@/components/elements/Separator2'));
const Title1 = dynamic(() => import('@/components/elements/Title1'));

export default function View2ContractEscritura() {
  return (
    <div className="h-screen pb-24 p-8 space-y-6 overflow-y-auto">
	<section className="flex flex-row justify-between">
	   <div>
	    <Title1 className="text-3xl">Contrato Generado</Title1>
	    <p>Informacion del de la escritura generada</p>
	  </div>
	</section>
	<section>
	    <p><b>ID : </b>{idContract}</p>
	    <p className="my-1"><b>Estado : </b>{statusContracts?.filter((est)=>est?.id === dataContracts?.status).map((item)=><span>{item?.title}</span>)}</p>
	    <p><b>Tipo de Contrato : </b><span>{camelCaseToTitle(dataContract?.contractType)}</span></p>
        <p className='flex flex-row gap-2'><b>Cliente : </b> <User2/>{loadingDataClient ?<Loader2 className='animate-spin'/> : <span>{client?.userName}</span>}</p>
    </section>
   </div>
  )
};
