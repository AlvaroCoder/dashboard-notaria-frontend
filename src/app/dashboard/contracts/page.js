'use client';
import CardIndicator from '@/components/elements/CardIndicator'
import CardIndicatorLoading from '@/components/elements/CardIndicatorLoading'
import Title1 from '@/components/elements/Title1'
import TableLoading from '@/components/Tables/TableLoading';
import TableManageDocuments from '@/components/Tables/TableManageDocuments';
import { Divider } from '@mui/material';
import { Building2, Car} from 'lucide-react'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';

const estadosContrato = [
  {title : "PROCESO INICIADO", bgColor : "bg-green-50"},
  {title : "EN REVISIÓN", bgColor : "bg-amber-100"},
  {title : "OBSERVADO", bgColor : "bg-slate-100"},
  {title : "PENDIENTE DE FIRMA", bgColor : "bg-blue-200 "},
  {title : "FIRMADO", bgColor : "bg-amber-200"},
  {title : "PENDIENTE DE RESPUESTA DEL SID", bgColor : "bg-gray-50"},
  {title : "TACHADO", bgColor : "bg-red-100"},
  {title : "INSCRITO", bgColor : "bg-green-100"},
];

const headersInmuebles = [
  {value: "Tipo de Contrato"},
  {value: "Tipo de Bien"},
  {value: "Compradores"},
  {value: "Vendedores"},
  {value: "Minuta"},
  {value: "Estado"}
];

const headersVehiculos = [
  {value: "Tipo de Contrato"},
  {value: "Tipo de Bien"},
  {value: "Compradores"},
  {value: "Vendedores"},
  {value: "Minuta"},
  {value: "Estado"}
];

export default function Page() {
  const router = useRouter();

  const URL_TIPO_CONTRATOS = "";

  const [loading, setLoading] = useState(false);
  const [vista, setVista] = useState("tabla");
  const [dataDocumentos, setDataDocumentos] = useState([]);
  const [dataInmuebles, setDataInmuebles] = useState([]);
  const [dataVehiculos, setDataVehiculos] = useState([]);
  const [indicators, setIndicators] = useState([]);

  useEffect(() => {
    async function getData() {
      try {
        setLoading(true);
        const responseInmuebles = await fetch('http://localhost:8000/home/contracts/propertyCompraVenta');
        const jsonResponseImuebles = await responseInmuebles.json();
        const dInmuebles = typeof(jsonResponseImuebles?.data) === 'string' ? [] : jsonResponseImuebles?.data;
        setDataInmuebles(dInmuebles);

        const responseVehiculos = await fetch('http://localhost:8000/home/contracts/vehicleCompraVenta');
        const jsonResponseVehiculos = await responseVehiculos.json();
        const dVehiculos = typeof(jsonResponseVehiculos?.data) === 'string' ? [] : jsonResponseVehiculos?.data;
        setDataVehiculos(dVehiculos);

        setIndicators([
          {id : 1, title : 'Inmuebles', value : dInmuebles?.length, icon : Building2},
          {id : 2, title : 'Vehiculos', value : dVehiculos?.length, icon : Car}
        ]);

        toast("Data exitosa",{
          type : 'success'
        })
      } catch (error) {
        console.log(error);
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
          data={[]}
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
          data={[]}
          headers={headersVehiculos}
          title="Gestión de Vehículos"
          handleAddDocument={()=>router.push('contracts/vehiculo/form-add')}
        />
      }
    </div>
  )
}
