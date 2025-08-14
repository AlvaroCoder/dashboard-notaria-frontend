import React from 'react'
import Title1 from '../elements/Title1'

export default function CardNotarioSelected({
    notario={}
}) {
  return (
    <div>
        <Title1>Notario seleccinonado : </Title1>
        <p>Información del notario seleccionado</p>
        <section className='bg-white rounded-sm shadow p-4'>
            <h1>Nombre : {notario?.firstName} {notario?.lastName}</h1>
            <h1>Usuario : {notario?.userName}</h1>
        </section>
    </div>
  )
};