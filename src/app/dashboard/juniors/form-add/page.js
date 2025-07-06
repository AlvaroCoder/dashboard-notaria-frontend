'use client'
import Title1 from '@/components/elements/Title1'
import { Button, Divider, TextField } from '@mui/material'
import React, { useState } from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

function FechaNacimientoSelector() {
  const [fechaNacimiento, setFechaNacimiento] = useState(null);
  const [abrirPicker, setAbrirPicker] = useState(false);
  const fechaMostrada = fechaNacimiento ? fechaNacimiento : dayjs();
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="flex flex-col gap-4 items-start">
        <Button
          variant="outlined"
          onClick={() => setAbrirPicker(true)}
          
        >
          {`${fechaMostrada.format('DD/MM/YYYY')}`}
        </Button>

        <DatePicker
          className='absolute'
          open={abrirPicker}
          onClose={() => setAbrirPicker(false)}
          value={fechaNacimiento}
          onChange={(nuevaFecha) => {
            setFechaNacimiento(nuevaFecha);
          }}
          slotProps={{
            textField: {
              hidden: true,
            },
          }}
        />
      </div>
    </LocalizationProvider>
  );
}

export default function Page() {
  const [dataJunior, setdataJunior] = useState({
    user_name : "",
    first_name : "",
    last_name : "",
    email : "",
    phone : "",
    dni : "",
    role : {
      id : 3,
      value : "junior"
    },
    address:{
      name : "",
      district : "",
      province : "",
      department : ""
    },
    gender : "M",
    password :"",
    birthDay : ""
  });

  const handleChange=(evt)=>{
    evt.preventDefault();
    
  }

  return (
    <main className='w-full h-full overflow-y-auto pb-4 pt-32 bg-gray-300 flex justify-center items-center'>
      <form className='bg-white shadow rounded-sm p-8 w-full max-w-[600px]'>
        <section className='mb-6'>
          <Title1 className='text-2xl'>
            Registro de Junior
          </Title1>
          <p className='text-gray-600 text-sm'>Información de los juniors</p>
        </section>
        <Divider/>
        <section className='my-4'>
          <Title1 className='text-xl'>
            Información de usuario
          </Title1>
          <p className='text-gray-600 text-sm'>Información de los juniors</p>
        </section>

        <section className='grid grid-cols-1 gap-4 mb-4'>
          <TextField 
              label="Nombre de Usuario" 
              value={dataJunior.user_name} 
              name='user_name' 
              required  />
          <TextField
            label="Contraseña"
            value={dataJunior.password}
            name='password'
            required  />
        </section>
        <Divider/>
        <section className='my-4'>
          <Title1 className='text-xl'>
            Información personal
          </Title1>
          <p className='text-gray-600 text-sm'>Información de los juniors</p>
        </section>
        <section className='grid grid-cols-2 gap-4 mb-4'>

          <TextField 
            label="DNI" 
            className='col-span-2' 
            value={dataJunior.dni} 
            name='dni' 
            required />
          <TextField 
            label="Nombre" 
            className='' 
            value={dataJunior.first_name} 
            name="first_name" />
          <TextField 
            label="Apellido" 
            value={dataJunior.last_name} 
            name="last_name" />
          <TextField 
            label="Email" 
            type='email' 
            value={dataJunior.email} 
            name='email' />
          <TextField
            label="Telefono"
            name="phone"
            value={dataJunior.phone}
            type='number'
          />
          <section className='relative'>
            <FechaNacimientoSelector

            />
          </section>
        </section>
        <Button
          variant='outlined' 
          className='mt-4'
          fullWidth 
        > 
          Guardar Junior
        </Button> 
      </form>
    </main>
  )
};
