import { TableCell } from '@/components/ui/table';
import { useFetch } from '@/hooks/useFetch';
import { Loader2Icon, UserIcon } from 'lucide-react';
import React from 'react'

export default function TableCellJunior({
    juniorId
}) {
    const URL_DATA_JUNIOR = juniorId && process.env.NEXT_PUBLIC_URL_HOME+'/junior/id/?idUser='+juniorId;
    const {
        data : dataJunior,
        loading : loadingDataJunior
    } = useFetch(URL_DATA_JUNIOR, 'force-cache');
    if (juniorId) {
        return (
            <TableCell>
                {
                    loadingDataJunior ?
                    <Loader2Icon className='animate-spin' /> :
                    <p className='flex flex-row items-center gap-2'> <UserIcon size={20}/> {dataJunior?.data?.userName}</p>
                }
            </TableCell>
          )
    } 
    return (
        <TableCell>
            <p>-</p>
        </TableCell>
    )
};
