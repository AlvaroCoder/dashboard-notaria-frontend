'use client'
import React, { useRef, useState } from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Button } from '../ui/button';


function formatearFecha(fechaStr) {
    const [dia, mes, anio] = fechaStr.split('/');
    return `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
  }
  
export default function ButtonDatePicker({
    handleChange
  }) {
    const [fechaNacimiento, setFechaNacimiento] = useState(null);
    const [abrirPicker, setAbrirPicker] = useState(false);
  
    const anchorRef = useRef(null);
  
    const fechaMostrada = fechaNacimiento ? fechaNacimiento : dayjs();
  
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="flex flex-col gap-4 items-start relative ">
          <section className='grid grid-cols-1 w-full'>
            <Button
              ref={anchorRef}
              type="button"
              onClick={() => setAbrirPicker(true)}
              variant="outlined"
              className="w-full  bg-[#0C1019] text-white hover:bg-slate-800 py-4 px-4 rounded normal-case"
            >
              {` ${fechaMostrada.format('DD/MM/YYYY')}`}
            </Button>
          </section>
  
          <DatePicker
            open={abrirPicker}
            onClose={() => setAbrirPicker(false)}
            value={fechaNacimiento}
            onChange={(nuevaFecha) => {
              setFechaNacimiento(nuevaFecha);
              handleChange(formatearFecha(nuevaFecha.format('DD/MM/YYYY')))
            }}
            slotProps={{
              textField: {
                hidden: true,
              },
              popper: {
                anchorEl: anchorRef.current, 
                placement: 'bottom-start',
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [0, 8],
                    },
                  },
                ],
              },
            }}
          />
        </div>
      </LocalizationProvider>
    );
  }