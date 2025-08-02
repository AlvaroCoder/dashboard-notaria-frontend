'use client';
import React from 'react'
import Title1 from '../elements/Title1';
import { Button } from '../ui/button';

export default function CardRequirements({
    nombre, 
    descripcion,
    requisitos=[],
    slug,
    handleClick=()=>{}
}) {
    
  return (
    <section className='p-2 w-full max-w-[450px] bg-[#102945] rounded-sm shadow-sm'>
    <div
        className='rounded-sm bg-white p-4  flex flex-col gap-2'
    >
        <section className='my-2'>
            <Title1 className='text-2xl'>{nombre}</Title1>
            <p className='text-sm'>
                {descripcion}
            </p>
        </section>
        <Button
            className={"bg-[#102945] w-full hover:bg-[#0C1019]"}
            onClick={()=>handleClick(slug)}
        >
            Iniciar Proceso
        </Button>
    </div>  
    <div className='text-white p-4'>
        <h1 className='my-2'>Requisitos:</h1>
        <ul className='list-disc pl-4'>
            {
                requisitos?.map((item, idx)=><li key={idx} className='ml-0 p-0 left-0'>{item}</li>)
            }
        </ul>
    </div>
</section>
  )
};
