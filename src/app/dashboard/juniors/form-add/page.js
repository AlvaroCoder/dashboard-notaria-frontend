'use client'
import Title1 from '@/components/elements/Title1'
import { Button, Divider, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import React, { useRef, useState } from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

function formatearFecha(fechaStr) {
  const [dia, mes, anio] = fechaStr.split('/');
  return `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
}

function FechaNacimientoSelector({
  handleChange
}) {
  const [fechaNacimiento, setFechaNacimiento] = useState(null);
  const [abrirPicker, setAbrirPicker] = useState(false);

  const anchorRef = useRef(null);

  const fechaMostrada = fechaNacimiento ? fechaNacimiento : dayjs();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="flex flex-col gap-4 items-start relative ">
        <section className='grid grid-cols-2 gap-4 w-full'>
          <div className='flex items-center justify-center'>
          <Title1 className='text-gray-600 text-lg'>Fecha de Nacimiento : </Title1>
          </div>
          <Button
            ref={anchorRef}
            onClick={() => setAbrirPicker(true)}
            className="w-full   py-4 px-4 rounded normal-case"
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

export default function Page() {
  const [dataJunior, setDataJunior] = useState({
    userName : "",
    firstName : "",
    lastName : "",
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
    birthYear : ""
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange=(evt)=>{
    evt.preventDefault();
    const target = evt.target;
    setDataJunior({
      ...dataJunior,
      [target.name] : target.value
    });
  }
  const handleSubmit=async(evt)=>{
    evt.preventDefault();
    try {
      setLoading(true);
      const newDataJunior = {
        ...dataJunior,
        role : {
          id : 3,
          value : "junior"
        },
        photo : ""
      }
      const response = await fetch('http://localhost:8000/login/register',{
        method : 'POST',
        headers :{
          'Content-type':'application/json'
        },
        body : JSON.stringify(newDataJunior)
      });
      const jsonResponseJunior = await response.json();
      console.log(jsonResponseJunior);
      
      toast("Guardo correctamente el junior",{
        type : 'success'
      });
      router.back();

    } catch (err) {
      toast("Error en el servidor",{
        type : 'error'
      });
    } finally{
      setLoading(false);
    }
  }
  return (
    <main className='w-full  overflow-y-auto py-12  bg-gray-300 flex justify-center '>
      <form 
        onSubmit={handleSubmit}
        className='bg-white h-fit shadow rounded-sm p-8 w-full max-w-[600px]'>
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
          <p className='text-gray-600 text-sm'>Información del usuario del junior</p>
        </section>

        <section className='grid grid-cols-1 gap-4 mb-4'>
          <TextField 
              label="Nombre de Usuario" 
              onChange={handleChange}
              value={dataJunior.userName} 
              name='userName' 
              required  />
          <TextField
            label="Contraseña"
            type='password'
            onChange={handleChange}
            value={dataJunior.password}
            name='password'
            required  />
        </section>
        <Divider/>
        <section className='my-4'>
          <Title1 className='text-xl'>
            Información personal
          </Title1>
          <p className='text-gray-600 text-sm'>Información personal del junior.</p>
        </section>
        <section className='grid grid-cols-2 gap-4 mb-4'>
          <TextField 
            label="DNI" 
            value={dataJunior.dni} 
            name='dni' 
            onChange={handleChange}
            required />
          <FormControl>
            <InputLabel>Genero</InputLabel>
            <Select
              value={dataJunior?.gender}
              label="Genero"
              onChange={handleChange}
              name='gender'
            >
              <MenuItem value="M">Masculino</MenuItem>
              <MenuItem value="F">Femenino</MenuItem>
            </Select>
          </FormControl>
          <TextField 
            label="Nombre" 
            className='' 
            value={dataJunior.firstName} 
            onChange={handleChange}
            name="firstName" />
          <TextField 
            label="Apellido" 
            value={dataJunior.lastName} 
            onChange={handleChange}
            name="lastName" />
          <TextField 
            label="Email" 
            type='email' 
            onChange={handleChange}
            value={dataJunior.email} 
            name='email' />
          <TextField
            label="Telefono"
            name="phone"
            onChange={handleChange}
            value={dataJunior.phone}
            type='number'
          />
          <TextField
            className='col-span-2'
            label="Direccion"
            value={dataJunior.address.name}
            onChange={(evt)=>setDataJunior((prev)=>({...dataJunior, address : {...prev.address, name : evt.target.value}}))}
          />
          <TextField
            className='col-span-2'
            label="Distrito"
            value={dataJunior.address.district}
            onChange={(evt)=>setDataJunior((prev)=>({...dataJunior, address : {...prev.address, district : evt.target.value}}))}
          />
          <TextField
            className='col-span-2'
            label="Provincia"
            value={dataJunior.address.province}
            onChange={(evt)=>setDataJunior((prev)=>({...dataJunior, address : {...prev.address, province : evt.target.value}}))}
          />
          <TextField
            className='col-span-2'
            label="Departamento"
            value={dataJunior.address.department}
            onChange={(evt)=>setDataJunior((prev)=>({...dataJunior, address : {...prev.address, department : evt.target.value}}))}
          />
          <section className=' col-span-2 w-full '>
            <FechaNacimientoSelector
              handleChange={(fechaNacimiento)=>setDataJunior({...dataJunior, birthYear : fechaNacimiento})}
            />
          </section>
        </section>
        <Button
          variant='outlined'
          loading={loading} 
          type='submit'
          className='mt-4'
          fullWidth 
        > 
          Guardar Junior
        </Button> 
      </form>
    </main>
  )
};
