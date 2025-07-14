import { TableCell } from '@/components/ui/table'
import React from 'react'

const statusList = [
    {id : 1, value : 'PROCESO INICIADO'},
    {id : 2, value : 'EN REVISIÓN'},
    {id : 3, value : 'OBSERVADOR'},
    {id : 4, value : 'PENDIENTE DE FIRMA'},
    {id : 5, value : 'FIRMADO'},
    {id : 6, value : 'PENDIENTE DE RESPUESTA DEL SID'},
    {id : 7, value : 'TACHADO'},
    {id : 8, value : 'INSCRITO'}
]

export default function TableCellStatus({
    idStatus
}) {
  return (
    <TableCell>
        <p className='bg-amber-200 px-2 py-1 text-sm rounded-sm w-fit text-center'>{statusList?.filter(({ id })=>idStatus === id)[0].value}</p>
    </TableCell>
  )
};