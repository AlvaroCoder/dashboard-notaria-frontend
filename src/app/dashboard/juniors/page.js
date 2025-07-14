'use client'
import TableroCarga from '@/components/Loading/TableroCarga';
import { useRouter } from 'next/navigation'
import React from 'react';
import { useFetch } from '@/hooks/useFetch';
import TableMangeUser from '@/components/Tables/TableManageUser';

const headers=[
    {value : "Nombre", head : ['firstName', 'lastName']},
    {value : "Usuario", head : 'userName'},
    {value : "DNI", head : 'dni'},
    {value : "Email", head : 'email'},
    {value : "Telefono", head : 'phone'},
    {value : "Dirección", head : 'address'},
]

export default function Page() {
    const URL_DATA_JUNIOR = 'http://localhost:8000/home/junior';

    const router=useRouter();
    const {
        data : dataJunior,
        loading : loadingDataJunior,
        error : errorDataJunior
    } = useFetch(URL_DATA_JUNIOR);

  return (
    <div className='p-6 h-screen overflow-y-auto'>
        <div className='space-y-6'>
            {
                loadingDataJunior ? 
                <TableroCarga
                    headers={headers}
                /> :
                <TableMangeUser
                    title='Junior'
                    handleAddDocument={()=>router.push('juniors/form-add')}
                    data={dataJunior?.data}
                    headers={headers}
                />
            }
        </div>
    </div>
  )
}