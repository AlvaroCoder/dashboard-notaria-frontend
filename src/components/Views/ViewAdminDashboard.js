'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import TableLoading from '../Tables/TableLoading';
import Title1 from '../elements/Title1';
import CardIndicatorLoading from '../elements/CardIndicatorLoading';
import CardIndicator from '../elements/CardIndicator';
import { Divider } from '@mui/material';
import { headerRS, headersAsociacion, headerSCRL, headersInmuebles, headersSAC, headersVehiculos } from '@/data/Headers';
import { Building2, Car, User } from 'lucide-react';
import dynamic from 'next/dynamic';

const TableManageDocuments=dynamic(()=>import('@/components/Tables/TableManageDocuments'),{
  ssr : false,
  loading : ()=><>Cargando Tabla ...</>
})

export default function ViewAdminDashboard() {
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
          
          const [inmuebles, vehiculos, asociacion, rs, sac, scrl] = json.map(j=>typeof(j?.data) === 'string'? [] : j?.data);
  
          setData({inmuebles, vehiculos, asociacion, rs, sac, scrl});
  
          setIndicators([
            {id : 1, title : 'Inmuebles', value : inmuebles?.length || 0, icon : Building2, targetId : "contracts-inmuebles"},
            {id : 2, title : 'Vehiculos', value : vehiculos?.length || 0, icon : Car, targetId : "contracts-vehiculos"},
            {id : 3, title : 'Asociacion', value : asociacion?.length || 0, icon : User, targetId : "contracts-asociacion"},
            {id : 4, title : 'RS', value : rs?.length || 0, icon : User, targetId : "contracts-rs"},
            {id : 5, title : 'SAC', value : sac?.length || 0, icon  : User, targetId : "contracts-sac"},
            {id : 6, title : 'SCRL', value : scrl?.length || 0, icon : User, targetId : "contracts-scrl"}
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
    }, []);

    const renderDivider = <Divider className='my-4' style={{marginTop : 10, marginBottom : 10}} />
    const renderTable=(title, dataset, header, path, slugUrlItem, id)=>(
      <>
        {
          loading ? 
          <TableLoading headers={header} rows={6}/> :
          <TableManageDocuments
            id={id}
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
      <div className="p-6 space-y-6 h-full overflow-y-auto">
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
        
        {renderTable("Contratos de Inmuebles", data.inmuebles, headersInmuebles, 'contracts/inmueble/form-add', '/dashboard/contracts/inmueble/', 'contracts-inmuebles')}
        {renderDivider}
        {renderTable("Contratos de Vehículos", data.vehiculos, headersVehiculos, 'contracts/vehiculo/form-add', '/dashboard/contracts/vehiculo/','contracts-vehiculos')}
        {renderDivider}
        {renderTable("Constitución de Asociación", data.asociacion, headersAsociacion, 'contracts/asociacion/form-add','/dashboard/contracts/asociacion/','contracts-asociacion')}
        {renderDivider}
        {renderTable("Constitución de RS", data.rs, headerRS, 'contracts/rs/form-add', '/dashboard/contracts/rs/', 'contracts-rs')}
        {renderDivider}
        {renderTable("Constitución de SAC", data.sac, headersSAC, 'contracts/sac/form-add', '/dashboard/contracts/sac/', 'contracts-sac')}
        {renderDivider}
        {renderTable("Constitución de SCRL", data.scrl, headerSCRL, 'contracts/scrl/form-add','/dashboard/contracts/scrl/', 'contracts-scrl')}
      </div>
    )
}
