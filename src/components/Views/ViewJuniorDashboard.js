'use client'
import { useFetch } from '@/hooks/useFetch';
import React from 'react'
import Title1 from '../elements/Title1'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const TableroContratosJunior=dynamic(()=>import('@/components/Tables/TableroContratosJunior'),{
  ssr : false,
  loading : ()=><>Cargando Tabla ...</>
})

export default function ViewJuniorDashboard({
  idJunior=""
}) {
    const {
      data : dataContractsJunior,
    } = useFetch(process.env.NEXT_PUBLIC_URL_ID_CONTRATOS_JUNIOR+idJunior)
    console.log(dataContractsJunior);
    
    const dataButtons =[
      {
        title : "Contrato Constitucion de Asociacion",
        slug : "/dashboard/contracts/asociacion/form-add"
      },
      {
        title : "Contrato de Inmueble",
        slug : "/dashboard/contracts/inmueble/form-add"
      },
      {
        title : "Contrato de Constitucion de RS",
        slug : "/dashboard/contracts/rs/form-add"
      },
      {
        title : "Contrato de constitucion de SAC",
        slug : "/dashboard/contracts/sac/form-add"
      },
      {
        title : "Contrato de constitucion de SCRL",
        slug :"/dashboard/contracts/scrl/form-add"
      },
      {
        title : "Contrato de Vehiculos",
        slug : "/dashboard/contracts/vehiculo/form-add"
      }
    ];
    const router = useRouter();
  // const {data : dataContractsJunior, loading : loadingDataContractJunior} = useFetch(`${process.env.NEXT_PUBLIC_URL_ID_CONTRATOS_JUNIOR}`)
  return (
    <div className='p-6 space-y-6 h-full overflow-y-auto'>
      <div>
        <Title1 className='text-4xl'>Gestión de Contratos</Title1>
        <p className='text-gray-600'>Gestión de los contratos</p>
      </div>
      <section className='w-full grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 '>
        {
          dataButtons?.map((butt)=><Button
          onClick={()=>router.push(butt.slug)}
          >{butt.title}</Button>)
        }
      </section>
      <TableroContratosJunior
        dataContracts={dataContractsJunior?.data}
      />
    </div>
  )
};