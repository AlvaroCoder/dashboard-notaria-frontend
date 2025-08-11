import { Info } from 'lucide-react'
import React from 'react'

export default function CardAviso({
    advise="Recuerda subir tus documentos a tiempo"
}) {
  return (
    <div className='bg-amber-100 p-4 w-full rounded-ls flex flex-row gap-4 items-center'>
        <Info/> <p>{advise}</p>
    </div>
  )
};