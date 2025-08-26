'use client'
import Separator2 from '@/components/elements/Separator2';
import Title1 from '@/components/elements/Title1';
import { headersTableroCliente } from '@/data/Headers';
import { useFetch } from '@/hooks/useFetch';
import { asignJuniorToContracts } from '@/lib/apiConnections';
import { statusContracts } from '@/lib/commonJSON';
import { camelCaseToTitle, cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation'
import React, { Suspense, useState } from 'react'
import { toast } from 'react-toastify';

const TableSelectedUser = dynamic(()=>import('@/components/Tables/TableSelectedUser'),{
    ssr : false,
    loading : ()=><p>Cargando Tabla</p>
})

function RenderPage() {
    const params = useSearchParams();
    const idContract =  params.get('idContract');
    const URL_GET_DATA_JUNIORS = process.env.NEXT_PUBLIC_URL_HOME+"/junior";
    const URL_GET_DATA_CONTRACT =process.env.NEXT_PUBLIC_URL_HOME+"/contract/contractId/?idContract="+idContract;

    const {
        data : dataContrato,
        loading : loadingDataContrato
    } = useFetch(URL_GET_DATA_CONTRACT)
    const {
        data : dataJuniors,
        loading : loadingDataJuniors
    } = useFetch(URL_GET_DATA_JUNIORS);

    const dataContract = dataContrato?.data;
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    const handleClickSelectJunior=async(junior)=>{
        try {
            setLoading(true);
            const responseJuniorAsigned = await asignJuniorToContracts(idContract, junior?.id);
            if (!responseJuniorAsigned.ok) {
                console.log(await responseJuniorAsigned.json());
                
                toast("El junior excede la cantidad maxima que puede manipular",{
                    type : 'error',
                    position : 'bottom-center'
                });
                return;
            }

            toast("Se asigno el junior correctamente",{
                type : 'success',
                position : 'bottom-center'
            });
            
            router.push("/dashboard/contracts")
            
        } catch (err) {
            console.log(err);
            toast("Error al seleccionar el Junior",{
                type : 'error',
                position : 'bottom-center'
            });
            
        } finally{
            setLoading(false);
        }
    }
    return(
        <section className='w-full min-h-screen p-6'>
            <section className='my-4 font-poppins'>
                <div>
                    <Title1 className='text-3xl'>Informacion del Contrato </Title1>
                    <p>Asigna un contrato al junior</p>
                </div>
                {
                    !loadingDataContrato &&
                    <section>
                        <p><b>ID : </b>{idContract}</p>
                        <p className="my-1"><b>Estado : </b>{statusContracts?.filter((est)=>est?.id === dataContract?.status).map((item)=><span key={item.title} className={cn('px-2 py-1 rounded-sm text-sm space-y-4', item.bgColor)}>{item.title}</span>)}</p>
                        <p><b>Tipo de Contrato : </b><span>{camelCaseToTitle(dataContract ? dataContract?.contractType : '')}</span></p>
                    </section>
                }
            </section>
            <Separator2/>
            <section>
                <TableSelectedUser
                    title='Asigna un Junior'
                    descripcion='Selecciona el Junior que se encargara para esta tarea'
                    headers={headersTableroCliente}
                    data={dataJuniors?.data}
                    slugCrear={'/dashboard/juniors/form-add'}
                    handleClickSelect={handleClickSelectJunior}

                />
            </section>
        
        </section>
    )
}

export default function Page() {
  return (
    <Suspense>
        <RenderPage/>
    </Suspense>
  )
}
