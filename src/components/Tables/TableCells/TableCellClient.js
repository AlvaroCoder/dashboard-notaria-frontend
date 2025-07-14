import { TableCell } from '@/components/ui/table';
import { useFetch } from '@/hooks/useFetch';
import { Loader2, Loader2Icon, UserIcon } from 'lucide-react';
import React from 'react'

export default function TableCellClient({
    clientId    
}) {
    const URL_DATA_CLIENT = `http://localhost:8000/home/client/id/?idUser=${clientId}`;
    const {
        data : dataCliente,
        loading : loadingDataCliente,
        error : errorDataCliente
    } = useFetch(URL_DATA_CLIENT);

    return (
        <TableCell>
            {
                loadingDataCliente ?
                <Loader2Icon className='animate-spin'/> :
                <p className='flex flex-row items-center gap-2'> <UserIcon size={20}/> {dataCliente?.data?.userName}</p>
            }
        </TableCell>
      )
};