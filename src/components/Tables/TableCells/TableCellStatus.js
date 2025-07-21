import { TableCell } from '@/components/ui/table'
import { statusContracts } from '@/lib/commonJSON'
import { cn } from '@/lib/utils'
import React from 'react'


export default function TableCellStatus({
    idStatus
}) {
  return (
    <TableCell>
        {
          statusContracts?.filter(({id})=>idStatus === id)?.map((item)=><p key={item.id} className={cn('px-2 py-1 text-sm rounded-sm w-fit text-center', item.bgColor)}>{item.title}</p>)
        }
    </TableCell>
  )
};