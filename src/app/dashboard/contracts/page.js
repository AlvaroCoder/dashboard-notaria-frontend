'use client';
import Title1 from '@/components/elements/Title1'
import { headerRS, headersAsociacion, headerSCRL, headersInmuebles, headersSAC, headersVehiculos } from '@/data/Headers';
import { Divider } from '@mui/material';
import { Building2, Car, User} from 'lucide-react'
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const TableManageDocuments=dynamic(()=>import('@/components/Tables/TableManageDocuments'),{
  ssr : false,
  loading : ()=><span>Cargando tabla ...</span>
});

const TableLoading=dynamic(()=>import('@/components/Tables/TableLoading'),{
  ssr : false
});
const CardIndicator=dynamic(()=>import('@/components/elements/CardIndicator'),{
  ssr : false
});
const CardIndicatorLoading=dynamic(()=>import('@/components/elements/CardIndicatorLoading'),{
  ssr : false
});


export default function Page() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [indicators, setIndicators] = useState([]);
  const [data, setData] = useState({
    inmuebles : [],
    vehiculos : [],
    asociacion : [],
    rs : [],
    sac : [],
    scrl : []
  });
  
  useEffect(() => {
    async function getData() {
      try {
        setLoading(true);
        const endpoints = [
          'compraVentaPropiedad', 'compraVentaVehiculo', 'asociacion', 'RS', 'SAC', 'SCRL'
        ];

        const responses = await Promise.all(
          endpoints?.map(type=>fetch(`${process.env.NEXT_PUBLIC_URL_HOME_CONTRACTS}/${type}`))
        );
        const json = await Promise.all(responses.map(res=>res.json()));
        
        const [inmuebles, vehiculos, asociacion, rs, sac, scrl] = json.map(j=>j?.data || []);

        setData({inmuebles, vehiculos, asociacion, rs, sac, scrl});

        setIndicators([
          {id : 1, title : 'Inmuebles', value : inmuebles?.length || 0, icon : Building2},
          {id : 2, title : 'Vehiculos', value : vehiculos?.length || 0, icon : Car},
          {id : 3, title : 'Asociacion', value : asociacion?.length || 0, icon : User},
          {id : 4, title : 'RS', value : rs?.length || 0, icon : User},
          {id : 5, title : 'SAC', value : sac?.length || 0, icon  : User},
          {id : 6, title : 'SCRL', value : scrl?.length || 0, icon : User}
        ]);

        toast("Datos cargados correctamente",{
          type : 'success',
          position : 'bottom-right'
        })
      } catch (error) {
        toast("Ocurrio un error ",{
          type : 'error',
          position : 'bottom-center'
        });
      } finally{
        setLoading(false);
      }
    }
    getData();
  }, [])
  const renderDivider = <Divider className='my-4' />
  const renderTable=(title, dataset, header, path, slugUrlItem)=>(
    <>
      {
        loading ? 
        <TableLoading headers={header} rows={6}/> :
        <TableManageDocuments
          headers={header}
          data={dataset}
          title={title}
          handleAddDocument={()=>router.push(path)}
          slugUrlItem={slugUrlItem}
        />
      }
    </>
  )
  return (
    <div className="p-6 space-y-6 h-screen overflow-y-auto">
      <div>
        <Title1 className='text-4xl'>Gestión de Contratos</Title1>
        <p className="text-gray-600">Gestión de los contratos subidos por los clientes.</p>
      </div>
      <Title1>Indicadores</Title1>
      <section className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3'>
        {
          loading ? 
          Array.from({length : 4},(_, idx)=><CardIndicatorLoading key={idx} />) : 
          indicators?.map((item, key)=><CardIndicator key={key} indicator={item} />)
        }
      </section>
      
      {renderTable("Gestión de Inmuebles", data.inmuebles, headersInmuebles, 'contracts/inmueble/form-add')}
      {renderDivider}
      {renderTable("Gestión de Vehículos", data.vehiculos, headersVehiculos, 'contracts/vehiculo/form-add', '/dashboard/contracts/vehiculo/')}
      {renderTable("Gestión de Asociación", data.asociacion, headersAsociacion, 'contracts/asociacion/form-add','/dashboard/contracts/asociacion/')}
      {renderTable("Gestión de constitución de RS", data.rs, headerRS, 'contracts/RS/form-add', '/dashboard/contracts/rs/')}
      {renderTable("Gestión de constitución de SAC", data.sac, headersSAC, 'contracts/SAC/form-add', '/dashboard/contracts/sac/')}
      {renderTable("Gestión de constitución de SCRL", data.scrl, headerSCRL, 'contracts/SCRL/form-add','/dashboard/contracts/scrl/')}
    </div>
  )
}
