'use client'
import Title1 from '@/components/elements/Title1'
import { Button, Divider, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import React, { useState } from 'react'

import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import ButtonDatePicker from '@/components/elements/ButtonDatePicker';

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
      const response = await fetch(process.env.NEXT_PUBLIC_URL_SIGNUP,{
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
          <section className=' col-span-2 w-full grid grid-cols-2 gap-4'>
          <p className='place-content-center text-gray-600 font-poppins'>Fecha Nacimiento</p>
          <ButtonDatePicker handleChange={(fechaNacimiento)=>setDataJunior({...dataJunior, birthYear: fechaNacimiento})} />
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
