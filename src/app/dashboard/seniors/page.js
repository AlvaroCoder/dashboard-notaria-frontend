'use client'

import TableroCarga from '@/components/Loading/TableroCarga';
import TableMangeUser from '@/components/Tables/TableManageUser';
import { useFetch } from '@/hooks/useFetch';
import { useRouter } from 'next/navigation'
import React from 'react'

const headers = [
  {value : "Nombre", head : ['firstName', 'lastName']},
  {value : "DNI", head : 'dni'},
  {value : "RUC", head : 'ruc'},
  {value : "Usuario", head : 'userName'},  
  {value : "Email", head : 'email'},
  {value : "Telefono", head : 'phone'},
  {value : "Direccion", head : 'address'}
];


export default function Page() {
  const URL_DATA_SENIORS = 'http://localhost:8000/home/senior';
  const router = useRouter();
  const {
    data : dataSeniors,
    loading : loadingDataSeniors,
    error : errorDataSeniors
  } = useFetch(URL_DATA_SENIORS);

  return (
    <div className='p-6 h-screen overflow-y-auto'>
      <div className='space-y-6'>
        {
          loadingDataSeniors ?
          <TableroCarga
            headers={headers}
          /> :
          <TableMangeUser
            title='Senior'
            handleAddDocument={()=>router.push('seniors/form-add')}
            data={dataSeniors?.data}
            headers={headers}
          />
        }
      </div>
    </div>
  )
};
