'use client'
import { useFetch } from '@/hooks/useFetch';
import React from 'react'
import Title1 from '../elements/Title1'
import dynamic from 'next/dynamic';
import RedirectButton from '../elements/RedirectButton';
import { Building, Building2, Car, FileText, Handshake, User2 } from 'lucide-react';

const TableroContratosJunior=dynamic(()=>import('@/components/Tables/TableroContratosJunior'),{
  ssr : false,
  loading : ()=><>Cargando Tabla ...</>
})

export default function ViewJuniorDashboard({
  idJunior=""
}) {
    const {
      data : dataContractsJunior
    } = useFetch(process.env.NEXT_PUBLIC_URL_ID_CONTRATOS_JUNIOR+idJunior)
    
    const dataButtons =[
      {
        title : "Agregar Inmueble",
        description : "Crea un nuevo contrato de compra/venta de inmueble",
        slug : "inmueble",
        icon : Building2
      },
      {
        title : "Contrato de Vehiculos",
        description : "Crea un nuevo contrat de compra/venta Vehiculos",
        slug : "vehiculo",
        icon : Car
      },
      {
        title : "Agregar Asociacion",
        description : "Crea un nuevo contrato de asociacion de empresa",
        slug : "asociacion",
        icon : User2
      },

      {
        title : "Agregar Razon Social",
        description : "Crea un nuevo contrato de Razon Social",
        slug : "rs",
        icon : FileText
      },
      {
        title : "Agregar SAC",
        description : "Crea un nuevo contrato de Sociedad Anonima Cerrada",
        slug : "sac",
        icon : Building
      },
      {
        title : "Agregar SCRL",
        description : "Crea un nuevo contrato de Sociedad Constitucion de Responsabilidad Limitada",
        slug :"scrl",
        icon : Handshake
      },

    ];

  return (
    <div className='p-6 space-y-6 h-full overflow-y-auto'>
      <div>
        <Title1 className='text-4xl'>Gestión de Contratos</Title1>
        <p className='text-gray-600'>Gestión de los contratos</p>
      </div>
      <section className='w-full grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 '>
        {
          dataButtons?.map((butt, idx)=>
            <RedirectButton
              key={idx}
              indicator={butt}
            />
          )
        }
      </section>
      <TableroContratosJunior
        dataContracts={dataContractsJunior?.data}
      />
    </div>
  )
};