import React from 'react'
import Title1 from '../elements/Title1'
import { camelCaseToTitle, cn } from '@/lib/utils'
import { useRouter } from 'next/navigation';
import { statusContracts } from '@/lib/commonJSON';
import { Loader2, User2 } from 'lucide-react';

export default function View5ContractParteNotarial({
  idContract='',
  dataContract={},
  loadingDataClient,
  client=null,
  title="Detalles del Contrato",
  description="Información del contrato"
}) {
    const router = useRouter();
  return (
    <div className='h-screen pb-24 p-8 space-y-6  overflow-y-auto'>
       <section className='flex flex-row justify-between'>
            <div>
              <Title1 className='text-3xl'>{title}</Title1>
              <p>{description}</p> 
            </div>
       </section>
       <section className=''>
            <p><b>ID: </b>{idContract}</p>
            <p className='my-1'><b>Estado : </b>{statusContracts?.filter((est)=>est.id === dataContract?.status).map((item)=><span key={item.title} className={cn('px-2 py-1 rounded-sm text-sm space-y-4', item.bgColor)}>{item.title}</span>)}</p>
            <p><b>Tipo de Contrato :</b> <span>{camelCaseToTitle(dataContract?.contractType)}</span></p>
            <p className='flex flex-row gap-2'><b>Cliente : </b> <User2/>{loadingDataClient ?<Loader2 className='animate-spin'/> : <span>{client?.userName}</span>}</p>
          </section>

        <section>
        vehiculo
        </section>
    </div>
  )
};