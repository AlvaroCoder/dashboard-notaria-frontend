'use client'
import { useRouter } from 'next/navigation'
import React from 'react'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Button } from '@/components/ui/button';
import SaveIcon from '@mui/icons-material/Save';
import ContratoContext, { useContratoContext } from '@/context/ContratosContext';


function ButtonsTop() {
    
    const {back} = useRouter();
    const {generarContrato} = useContratoContext();
    return (
        <nav className='p-4 w-full shadow-sm h-20 flex flex-row items-center justify-between'>
            <div className='flex flex-row items-center text-gray-500  text-sm'>
                <ArrowBackIosIcon fontSize='20'/>
                <p className='underline cursor-pointer' onClick={()=>back()}>
                    Regresar
                </p>
            </div>
            <div>
                <Button 
                    className={'bg-green-900 rounded-sm hover:opacity-30 text-white'} 
                    variant={"outlined"}
                    onClick={async()=>{
                        console.log("Guardar");
                        await generarContrato();
                    }}
                >
                    <SaveIcon/>
                    <p>Guardar</p>
                </Button>
            </div>
        </nav>
    )
}

export default function Layout({children}) {
  return (
    <ContratoContext>
        <div className='flex flex-col h-full w-full'>
            <ButtonsTop/>
            <main className='w-full h-screen overflow-y-hidden'>
                {children}
            </main>
        </div>
    </ContratoContext>
  )
};