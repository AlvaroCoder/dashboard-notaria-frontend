import React from 'react'
import Title1 from '../elements/Title1'

export default function FormHeadContract({
    handleClick=()=>{}
}) {
    const [] = React.useState({
        header : {
            numeroDocumentoNotarial : '',
            
        }
    })
  return (
    <section className='w-full flex justify-center items-center'>
        <div className='max-w-5xl w-full bg-white p-6 rounded-lg shadow mt-8'>
            <section>
                <Title1 className='text-3xl'>Información Restante</Title1>
                <p>Ingresa la información restante para generar el contrato</p>
            </section>
            <section className='my-4'>
                <Title1>Información de la asocóacion</Title1>

            </section>
        </div>
    </section>
  )
};