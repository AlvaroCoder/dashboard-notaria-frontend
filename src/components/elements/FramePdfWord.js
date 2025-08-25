'use client';
import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '../ui/card';
import { Skeleton } from '@mui/material';
import { toast } from 'react-toastify';

export default function FramePdfWord({
  handlePdf=null,
  path
}) {
    const URL_PDF_DOCUMENT=`${process.env.NEXT_PUBLIC_BASE_URL}/home/pdfDocument`
      const [dataPdf, setDataPdf] = useState(null);
      const [loading, setLoading] = useState(false);
      useEffect(()=>{
        async function getData() {
          try {
            setLoading(true);
            const responsePdfDocument = await fetch(URL_PDF_DOCUMENT,{
              method : 'POST',
              mode : 'cors',
              headers : {
                'Content-type' : 'application/json'
              },
              body : JSON.stringify({path})
            });

            
            const blob = await responsePdfDocument.blob();
            const pdf = URL.createObjectURL(blob);       
            setDataPdf(pdf);
            
            if (handlePdf) {
              handlePdf(blob);
          }
          } catch (err) {
            console.log(err);
            
              toast("Error con el servidor",{
                  type : 'error',
                  position : 'bottom-center'
              });
              setLoading(false);
          } finally { 
            setLoading(false)
          }
        }
        getData();

      },[path]);
  if (loading) {
    return(
        <Card className="w-full h-32">
            <CardContent>
                <Skeleton/>
            </CardContent>
        </Card>
    )
  }
  return(
    <div className='mt-6'>
        {
            dataPdf ?
            <embed
            src={dataPdf}
            className="w-full h-96 border rounded"
            type='application/json'
            title='Vista previa de PDF'
            /> :
            <section className='w-full border border-red-300 rounded-sm h-32 flex justify-center items-center'>
                <p className='text-red-400 font-bold'>No se pudo cargar el WORD :/</p>
            </section>
        }
    </div>
  )
}
