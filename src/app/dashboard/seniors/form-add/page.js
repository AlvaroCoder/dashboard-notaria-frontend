'use client';
import ButtonDatePicker from '@/components/elements/ButtonDatePicker';
import Title1 from '@/components/elements/Title1';
import { Button, Divider, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

export default function page() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [dataSenior, setDataSenior] = useState({
    userName : "",
    firstName : "",
    lastName : "",
    email : "",
    phone : "",
    photo : "",
    dni : "",
    ruc : "",
    address : {
      name : "",
      district : "",
      province : "",
      department : ""
    },
    role : {
      id : 2,
      value : "senior"
    },
    password : "",
    gender : "M",
    birthYear : ""
  });
  const handleSubmit=async(evt)=>{
    evt.preventDefault();
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/login/register',{
        method : 'POST',
        headers : {
          'Content-type' : 'application/json'
        },
        body : JSON.stringify(dataSenior)
      });
      const jsonResponseSenior = await response.json();
      console.log(jsonResponseSenior);
      
      toast('Se guardo correctamente',{
        type : 'success'
      });
      router.back()

    } catch (err) {
      console.log(err);
      
      toast("Error en el servidor",{
        type : 'error'
      })
    } finally{
      setLoading(false);
    }
  }
  const handleChange=(evt)=>{
    evt.preventDefault();
    const target = evt.target;

    setDataSenior({
      ...dataSenior,
      [target.name] : target.value
    });
  }
  return (
    <main className='w-full  overflow-y-auto py-12  bg-gray-300 flex justify-center '>
      <form
        onSubmit={handleSubmit}
        className='bg-white h-fit shadow rounded-sm p-8 w-full max-w-[600px]'
      >
        <section className='mb-6'>
          <Title1 className='text-2xl'>
            Registro de Senior
          </Title1>
          <p className='text-gray-600 text-sm'>Información del Senior</p>
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
              value={dataSenior.userName} 
              name='userName' 
              required  />
          <TextField
            label="Contraseña"
            type='password'
            onChange={handleChange}
            value={dataSenior.password}
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
            label="RUC"
            name='ruc'
            className='col-span-2'

            value={dataSenior.ruc}
            onChange={handleChange}
            required
          />
          <TextField 
            label="DNI"
            name='dni'
            value={dataSenior.dni}
            onChange={handleChange}
            required
          />

          <FormControl>
            <InputLabel>Genero</InputLabel>
            <Select
              value={dataSenior?.gender}
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
            value={dataSenior.firstName}
            onChange={handleChange}
            name='firstName'
          />
          <TextField 
            label="Apellido" 
            value={dataSenior.lastName} 
            onChange={handleChange}
            name="lastName" />
          <TextField 
            label="Email" 
            type='email' 
            onChange={handleChange}
            value={dataSenior.email} 
            name='email' />
          <TextField
            label="Telefono"
            name="phone"
            onChange={handleChange}
            value={dataSenior.phone}
            type='number'
          />
          <TextField
            className='col-span-2'
            label="Direccion"
            value={dataSenior.address.name}
            onChange={(evt)=>setDataSenior((prev)=>({...dataSenior, address : {...prev.address, name : evt.target.value}}))}
          />
          <TextField
            className='col-span-2'
            label="Distrito"
            value={dataSenior.address.district}
            onChange={(evt)=>setDataSenior((prev)=>({...dataSenior, address : {...prev.address, district : evt.target.value}}))}
          />
          <TextField
            className='col-span-2'
            label="Provincia"
            value={dataSenior.address.province}
            onChange={(evt)=>setDataSenior((prev)=>({...dataSenior, address : {...prev.address, province : evt.target.value}}))}
          />
          <TextField
            className='col-span-2'
            label="Departamento"
            value={dataSenior.address.department}
            onChange={(evt)=>setDataSenior((prev)=>({...dataSenior, address : {...prev.address, department : evt.target.value}}))}
          />
          <section className='col-span-2 w-full grid grid-cols-2  gap-4'>
            <p className='place-content-center text-gray-600 font-poppins'>Fecha Nacimiento</p>
            <ButtonDatePicker handleChange={(fechaNacimiento)=>setDataSenior({...dataSenior, birthYear : fechaNacimiento})} />
          </section>
        </section>
        <Button
          variant='outlined'
          loading={loading}
          type='submit'
          className='mt-4'
          fullWidth
        >
          Guardar Senior
        </Button>
      </form>
    </main>
  )
};
