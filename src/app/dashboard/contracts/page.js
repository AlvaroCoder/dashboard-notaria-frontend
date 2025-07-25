'use client';
import CardIndicator from '@/components/elements/CardIndicator'
import CardIndicatorLoading from '@/components/elements/CardIndicatorLoading'
import Title1 from '@/components/elements/Title1'
import TableLoading from '@/components/Tables/TableLoading';
import TableManageDocuments from '@/components/Tables/TableManageDocuments';
import { headersAsociacion, headersInmuebles, headersVehiculos } from '@/data/Headers';
import { Divider } from '@mui/material';
import { Building2, Car, User} from 'lucide-react'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

export default function Page() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [dataInmuebles, setDataInmuebles] = useState([]);
  const [dataVehiculos, setDataVehiculos] = useState([]);
  const [dataAsociacion, setDataAsociacion] = useState([]);
  const [indicators, setIndicators] = useState([]);
  
  useEffect(() => {
    async function getData() {
      try {
        setLoading(true);
        const [resInmuebes, resVehiculos, resAsociacion, resRS, resSAC, resSCRL] = await Promise.all([
          fetch('http://localhost:8000/home/contracts/compraVentaPropiedad'),
          fetch('http://localhost:8000/home/contracts/compraVentaVehiculo'),
          fetch('http://localhost:8000/home/contracts/asociacion'),
          fetch('http://localhost:8000/home/contracts/RS'),
          fetch('http://localhost:8000/home/contracts/SAC'),
          fetch('http://localhost:8000/home/contracts/SCRL')
        ]);
        
        const [jsonInmuebles, jsonVehiculos, jsonAsociacion, jsonRS, jsonSAC, jsonSCRL] = await Promise.all([
          resInmuebes.json(),
          resVehiculos.json(),
          resAsociacion.json(),
          resRS.json(),
          resSAC.json(),
          resSCRL.json()
        ]);

        const dInmuebles = jsonInmuebles?.data;
        const dVehiculos = jsonVehiculos?.data;
        const dAsociacion = jsonAsociacion?.data;
        const dRS = jsonRS?.data;
        const dSAC = jsonSAC?.data;
        const dSCRL = jsonSCRL;

        setDataInmuebles(dInmuebles);
        setDataVehiculos(dVehiculos);
        setDataAsociacion(dAsociacion);


        setIndicators([
          {id : 1, title : 'Inmuebles', value : dInmuebles?.length || 0, icon : Building2},
          {id : 2, title : 'Vehiculos', value : dVehiculos?.length || 0, icon : Car},
          {id : 3, title : 'Asociacion', value : dAsociacion?.length || 0, icon : User},
          {id : 4, title : 'RS', value : dRS?.length || 0, icon : User},
          {id : 5, title : 'SAC', value : dSAC?.length || 0, icon  : User},
          {id : 6, title : 'SCRL', value : dSCRL?.length || 0, icon : User}
        ]);

        toast("Data exitosa",{
          type : 'success'
        })
      } catch (error) {
        toast("Ocurrio un error ",{
          type : 'error'
        });
      } finally{
        setLoading(false);
      }
    }
    getData();
  }, [])
  
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
      {
        loading ?
        <TableLoading headers={headersInmuebles} rows={6} /> :
        <TableManageDocuments
          data={dataInmuebles}
          headers={headersInmuebles}
          title="Gestión de Inmuebles"
          handleAddDocument={()=>router.push('contracts/inmueble/form-add')}
        />
      }
      <section className='w-full mb-6'>
        <Divider className='my-2 '/>
      </section>
      {
        loading ?
        <TableLoading headers={headersVehiculos} rows={6} /> :
        <TableManageDocuments
          data={dataVehiculos}
          headers={headersVehiculos}
          title="Gestión de Vehículos"
          handleAddDocument={()=>router.push('contracts/vehiculo/form-add')}
        />
      }
      <section className='w-full mb-6'>
        <Divider className='my-2 '/>
      </section>
      {
        loading ?
        <TableLoading headers={headersAsociacion} rows={6} /> :
        <TableManageDocuments
          data={dataAsociacion}
          headers={headersAsociacion}
          title='Gestion de Asociacion'
          handleAddDocument={()=>router.push('contracts/inmueble/form-add')}
        />
      }
      <section className='w-full mb-6'>
        <Divider className='my-2 '/>
      </section>
      
    </div>
  )
}
