import React from 'react'
import { Button } from '../ui/button'

export default function ButtonDownloadWord({
    viewWord=null,
    fileName="contrato_inmueble"
}) {
    const handleClickDownload=()=>{
        if(!viewWord) return;
        const link = document.createElement('a');
        link.href = viewWord;
        link.download = `${fileName}.docx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  return (
    <div className='w-full border border-gray-200 rounded-sm mt-6 flex justify-between items-center p-4 px-6 gap-4'>
        <p className=''>Escritura generada</p>
        <Button
            onClick={handleClickDownload}
        >
            Descargar Documento
        </Button>
    </div>
  )
};