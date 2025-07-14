'use client';
import React, { useState }  from 'react'
import { Button } from '../ui/button';
import { Loader2Icon } from 'lucide-react';
import { toast } from 'react-toastify';

export default function ButtonDownloadPdf({
    minutaDirectory=""
}) {
    const [loading, setLoading] = useState(false);

    const handleClick=async()=>{
        try {
            setLoading(true);
            const response = await fetch('http://127.0.0.1:8000/home/minuta/',{
                method : 'POST',
                headers : {
                    "Content-Type": "application/json",
                },
                body : JSON.stringify({
                    path : minutaDirectory
                })
            });
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank");
        } catch (err) {
            console.log(err);
            toast("Error en el servidor",{
                type : 'error'
            });
        } finally {
            setLoading(false);
        }
    };

  return (
    <Button
        onClick={handleClick}
        variant={"ghost"}
        className={"block z-20 h-full underline text-blue-500 font-bold hover:bg-transparent cursor-pointer"}
    >
       {
        loading ? <Loader2Icon className='animate-spin'/> :  <p>Ver PDF</p>
       }
    </Button>
  )
};