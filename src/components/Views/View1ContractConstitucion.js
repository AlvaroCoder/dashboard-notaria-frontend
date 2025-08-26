import { statusContracts } from '@/lib/commonJSON';
import dynamic from 'next/dynamic';
import React from 'react'
import { Button } from '../ui/button';
import { camelCaseToTitle, cn } from '@/lib/utils';
import { Loader2, User2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

// ✅ Dynamic imports
const FramePdf = dynamic(() => import('@/components/elements/FramePdf'), { ssr: false });
const Separator2 = dynamic(() => import('@/components/elements/Separator2'));
const Title1 = dynamic(() => import('@/components/elements/Title1'));

export default function View1ContractConstitucion({
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
            <Title1 className='text-xl'>Minuta del Contrato</Title1>
            <section className='my-2 flex flex-col gap-4'>
            <div>
                <Title1 className=''>Accesos Rapidos</Title1>
            </div>
            <section className='flex flex-row gap-4 w-full'>
              <Button
                className={"flex-1 py-4"}
                onClick={()=>router.push(`/dashboard/juniors/asign/?idContract=${idContract}`)}
              >
                Asignar un Junior
              </Button>
              <Button 
                className={"flex-1 py-4"}
                onClick={()=>router.push(`/dashboard/processContract/generateScript/?status=${dataContract?.status}&contractType=${dataContract?.contractType}&idContract=${idContract}`)}
              >
                  Generar Escritura
              </Button>
            </section>
          </section>
            <Separator2/>
            <FramePdf
              directory={dataContract?.minutaDirectory}
            />
          </section>

        </div>
      )
}
