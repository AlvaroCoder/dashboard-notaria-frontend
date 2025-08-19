import React from 'react'
import Title1 from '../elements/Title1'
import { TextField } from '@mui/material'

export default function FormHeaderInformation({
    data={},
    handleChangeHeader=()=>{}
}) {
  return (
    <section className='my-4'>
        <Title1>Información de la cabecera</Title1>
        <div className='grid grid-cols-2 gap-4'>
            <TextField
                label="Nro Documento Notarial"
                type='number'
                onChange={handleChangeHeader}
                name='numeroDocumentoNotarial'
                value={data?.header?.numeroDocumentoNotarial}
                fullWidth
                required
            />
            <TextField
                label="Nro Registro Escritura"
                type='number'
                onChange={handleChangeHeader}
                name='numeroRegistroEscritura'
                value={data?.header?.numeroRegistroEscritura}
                fullWidth
                required
            />
            <TextField
                label="Año"
                onChange={handleChangeHeader}
                name='year'
                type='number'
                value={data?.header.year}
                fullWidth
                required
            />
            <TextField
                label="Folio"
                onChange={handleChangeHeader}
                name='folio'
                type='number'
                value={data?.header?.folio}
                fullWidth
                required
            />
            <TextField
                label="Tomo"
                onChange={handleChangeHeader}
                name="tomo"
                value={data?.header?.tomo}
                fullWidth
                inputProps={{
                    pattern: "[A-Za-z ]*"
                  }}
                required
                onKeyPress={(e) => {
                    if (!/[a-zA-Z\s]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
            />
            <TextField
                label="Kardex"
                onChange={handleChangeHeader}
                name='kardex'
                type='number'
                value={data?.header?.kardex}
                fullWidth
                required
            />
        </div>
    </section>
  )
};
