import React from 'react'
import { Button } from '../ui/button'
import Title1 from './Title1';
import { fetchEscrituraWord } from '@/lib/apiConnections';

export default function ButtonDownloadWord({
    dataContract=null,
    idContract="asdasd",
    title="Escritura generada",
    slugDownload=""
}) {
    const handleDownload =async(e)=>{
        e.preventDefault();
        
        const response = await fetchEscrituraWord(slugDownload === '' ? dataContract?.documentPaths?.escrituraPath : slugDownload);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `escritura-${idContract}.docx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setTimeout(()=>URL.revokeObjectURL(url), 4000);

    }
  return (
    <section className='bg-white p-4 rounded-lg mt-4 shadow'>
        <Title1 className='text-xl'>{title}</Title1>
        <section>
            <p>Descarga el word si es necesario</p>
            <Button
                onClick={handleDownload}

            >
                Descargar Escritura
            </Button>
        </section>
    </section>
  )
};