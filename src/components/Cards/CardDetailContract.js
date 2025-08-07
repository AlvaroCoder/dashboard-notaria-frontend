import { statusContracts } from '@/lib/commonJSON'
import { camelCaseToTitle, cn } from '@/lib/utils'
import { Loader2, User2 } from 'lucide-react'
import React from 'react'

export default function CardDetailContract({
    idContract='',
    status=1,
    loadingDataClient=false,
    client=null,
    contractType=''
}) {
  return (
    <div>
        <p><b>ID: </b>{idContract}</p>
        <p className='my-1'><b>Estado : </b>{statusContracts?.filter((est)=>est?.id === status)?.map((item)=><span key={item?.title} className={cn('px-2 py-1 rounded-sm text-sm space-y-4', item.bgColor)}>{item.title}</span>)}</p>
        <p><b>Tipo de Contrato : </b><span>{camelCaseToTitle(contractType)}</span></p>
        <p className='flex flex-row gap-2'><b>Cliente : </b><User2/>{loadingDataClient ? <Loader2 className='animate-spin' /> : <span>{client?.userName}</span>}</p>
    </div>
  )
};