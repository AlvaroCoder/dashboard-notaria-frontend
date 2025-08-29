'use client';
import React, { useEffect, useState } from 'react';
import Title1 from '../elements/Title1';
import Separator2 from '../elements/Separator2';
import { fetchImageEvidence } from '@/lib/apiConnectionsEvidences';
import Image from 'next/image';
import { toast } from 'react-toastify';
import ImageSlider from '../elements/ImageSlider';
import CardAviso from './CardAviso';

// ✅ Componente para mostrar los DNIs
function CardDni({ data = [] }) {
  console.log(data);
  
  if (!data || data.length === 0) {
    return <p className="text-gray-500">No hay imágenes para mostrar.</p>;
  }

  return (
    <div className="w-full grid grid-cols-1 gap-4 mt-4">
      {data.map((item, idx) => (
        <div
          key={idx}
          className="w-full border rounded-lg p-3 shadow hover:shadow-md bg-white"
        >
          <Title1 className="text-lg mb-2">Persona {idx + 1}</Title1>
          <div className='my-2'>
          <CardAviso
            advise={item?.maritalStatus?.civilStatus}
          />
          </div>
          {/* Imágenes de la persona */}
          <div className="flex gap-2 flex-wrap">
            <ImageSlider
                images={item?.person}
            />
          </div>

          {
            (item?.maritalStatus?.marriageType?.type == 1) && 
            <div className='my-4'>
               <Title1>Conyugue</Title1>
               <p className='p-2 rounded-sm text-sm bg-amber-50'>Bienes separados</p>
            </div>
          }
          {/* Si hay cónyuge */}
          {(item.spouse && item?.maritalStatus?.marriageType?.type == 2) && (
            <>
              <p className="mt-2 text-sm text-gray-700 font-semibold">Cónyuge:</p>
              <div className="flex gap-2 flex-wrap">
                {item.spouse?.map((img, i) => (
                  <Image
                    key={`spouse-${idx}-${i}`}
                    src={img}
                    alt="DNI cónyuge"
                    width={100}
                    height={80}
                    className="rounded border"
                    unoptimized
                  />
                ))}
              </div>
            </>
          )}


        </div>
      ))}
    </div>
  );
}

// ✅ Componente principal
export default function CardShowDnisPerson({ buyersData = [], sellersData = [] }) {
  const [loading, setLoading] = useState(false);
  const [dnisBuyers, setDnisBuyers] = useState([]);
  const [dnisSellers, setDnisSellers] = useState([]);

  useEffect(() => {
    let objectUrls = []; // Para cleanup

    async function getDataImagesDnis() {
      try {
        setLoading(true);

        const processPerson = async (dniList = []) => {
          const blobs = await Promise.all(
            dniList.map(dniRuta => fetchImageEvidence(dniRuta))
          );

          const urls = await Promise.all(
            blobs.map(async (item) => {
              const blob = await item.blob();
              const url = URL.createObjectURL(blob);
              objectUrls.push(url);
              return url;
            })
          );

          return urls;
        };

        const promiseImagesDnisBuyers = buyersData.map(async (comp) => {
          const isCasado =
            comp.maritalStatus?.civilStatus === 'casada' ||
            comp.maritalStatus?.civilStatus === 'casado';

          if (isCasado && comp.maritalStatus?.marriageType?.type == 2) {
            return {
              person: await processPerson(comp?.dni),
              spouse: await processPerson(comp?.maritalStatus?.spouse?.dni),
              maritalStatus : comp?.maritalStatus
            };
          } else {
            return {
              person: await processPerson(comp?.dni),
              maritalStatus : comp?.maritalStatus
            };
          }
        });

        const promiseImagesDnisSellers = sellersData.map(async (venta) => {
          const isCasado =
            venta.maritalStatus?.civilStatus === 'casada' ||
            venta.maritalStatus?.civilStatus === 'casado';

          if (isCasado && venta.maritalStatus?.marriageType?.type == 2) {
            return {
              person: await processPerson(venta?.dni),
              spouse: await processPerson(venta?.maritalStatus?.spouse?.dni),
              maritalStatus : venta?.maritalStatus
            };
          } else {
            return {
              person: await processPerson(venta?.dni),
              maritalStatus : venta?.maritalStatus
            };
          }
        });

        const imagesDnisCompradores = await Promise.all(promiseImagesDnisBuyers);
        setDnisBuyers(imagesDnisCompradores);

        const imagesDnisVendedores = await Promise.all(promiseImagesDnisSellers);
        setDnisSellers(imagesDnisVendedores);

        toast('Se cargaron las imágenes', {
          type: 'success',
          position: 'bottom-right',
        });
      } catch (err) {
        console.error('Error cargando imágenes de DNI:', err);
      } finally {
        setLoading(false);
      }
    }

    getDataImagesDnis();

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [buyersData, sellersData]);

  return (
    <section className="w-full p-6 bg-slate-100 h-full">
      <div className="w-full p-4 shadow-destructive bg-white rounded-lg">
        <Title1 className="text-2xl">Imágenes de los DNIS</Title1>
        <p>Guíate de la información de los Dnis para completar el formulario</p>
        <Separator2 />

        <Title1 className="mt-4">DNI de los compradores</Title1>
        {loading ? (
          <p>Cargando ...</p>
        ) : (
          <CardDni data={dnisBuyers} />
        )}

        <Title1 className="mt-6">DNI de los vendedores</Title1>
        {loading ? (
          <p>Cargando ...</p>
        ) : (
          <CardDni data={dnisSellers} />
        )}
      </div>
    </section>
  );
}