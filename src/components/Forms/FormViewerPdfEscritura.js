import React from 'react'
import Title1 from '../elements/Title1'
import { Divider } from '@mui/material'

export default function FormViewerPdfEscritura() {
  return (
    <section className='p-8'>
        <section className='p-4 bg-white shadow rounded-sm'>
            <section>
                <Title1>PDF de la Escritura</Title1>
                <p className='text-sm text-gray-500'>Descargalo si es necesario</p>
            </section>
            <Divider
                className='my-2'
            />
            <section
                
            >
                {
                    dataPdf && (
                        <iframe
                            src={dataPdf}
                            width={"100%"}
                            height={"600px"}
                            className='mt-4 border rounded'
                        />
                    )
                }
            </section>
        </section>
    </section>
  )
}
