'use client'
import { login } from '@/authentication/lib';
import ButtonSave from '@/components/elements/ButtonSave';
import ErrorCard from '@/components/elements/ErrorCard';
import InputPassword from '@/components/elements/InputPassword';
import InputStyle from '@/components/elements/InputStyle';
import Title1 from '@/components/elements/Title1'
import { LoginForm } from '@/components/Forms';
import PersonIcon from '@mui/icons-material/Person';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

export default function Page() {
  const URL_IMG_LOGO_NOTARIA = 'https://res.cloudinary.com/dabyqnijl/image/upload/v1750349721/ImagesNotariaRojas/z2znxywil3jx4r6htzra.png'

  const [dataSend, setDataSend] = useState({
    username : "",
    password : ""
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
   
  const handleChangeInput=(evt)=>{
    const target = evt.target;
    setDataSend({
      ...dataSend,
      [target.name] : target.value
    })
  }
  const handleSubmit=async(evt)=>{
    evt.preventDefault();
    if (!dataSend.username.trim() || !dataSend.password.trim()) {
      toast("Completar los campos",{
        type : 'error',
        position : 'top-right'
      })
      setError({
        title : "Campos vacios",
        description : "Complete los campos para continuar"
      });
      return;
    }
    try {
      setLoading(true);
      const response = await login(dataSend, 'admin');
      if (response.error) {
        setError({
          title : 'Error ',
          description : response.message
        });
        return
      }
      toast("Inicio de sesion exitoso",{
        type : 'success',
        position : 'bottom-right'
      });
      router.push('/dashboard');

    } catch (err) {
      toast('Ocurrio un error con el servidor', {
        type : 'error',
        position : 'bottom-right'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='w-full min-h-screen bg-[#CFCFD1] flex flex-row'>
      <section className='flex-1 h-screen bg-[#0C1019] flex justify-center items-center'>
        <div className='p-8 text-center'>
          <Image
            src={URL_IMG_LOGO_NOTARIA}
            alt='logo notaria rojas'
            width={600}
            height={300}
          />
          <Title1 className='text-white text-4xl'>
            NOTARIA ROJAS JAEN
          </Title1>
        </div>
      </section>
     <section className='flex-1 min-h-screen flex justify-center items-center'>
        <section
            className='max-w-md w-full text-[#0C1019] bg-white p-8 rounded-md'
            >
              <Title1
                className='text-2xl text-center'
              >
                Inicio de Sesión
              </Title1>
            <div className='my-4'>
              {
                error && <ErrorCard
                  title={error?.title}
                  message={error?.description}
                />
              }
            </div>
            <form onSubmit={handleSubmit} className='space-y-6'>
              <InputStyle
                label='Usuario'
                name='username'
                value={dataSend.username}
                Icon={PersonIcon}
                onChange={handleChangeInput}
              />
              <InputPassword
                value={dataSend.password}
                onChange={handleChangeInput}
              />
              <ButtonSave
                type='submit'
                loading={loading}
              >
                Iniciar Sesión
              </ButtonSave>
            </form>
        </section>
     </section>
    </div>
  )
};