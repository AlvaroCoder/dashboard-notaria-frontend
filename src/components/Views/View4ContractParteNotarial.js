'use client';
import React from 'react'
import Title1 from '../elements/Title1';
import CardDetailContract from '../Cards/CardDetailContract';

export default function View4ContractParteNotarial({
    idContract="",
    dataContract={},
    loadingDataClient=false,
    client=null,
    title="Detalles del contrato",
    description="Informacion del contrato",

}) {
  return (
    <div className='w-full h-screen pb-24 p-8 space-y-6 overflow-y-auto'>
        <section className='flex flex-row justify-between'>
            <div>
                <Title1 className='text-xl'>{title}</Title1>
                <p>{description}</p>
            </div>
        </section>
        <CardDetailContract
            idContract={idContract}
            status={dataContract?.status}
            loadingDataClient={loadingDataClient}
            client={client}
            contractType={dataContract?.contractType}
        />
    </div>
  )
}
