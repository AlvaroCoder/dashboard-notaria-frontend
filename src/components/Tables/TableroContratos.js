"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableHead, TableRow, TableHeader, TableCell, TableBody } from "@/components/ui/table";
import { List, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Title1 from "../elements/Title1";
import CardContract from "../elements/CardContract";
import { useRouter } from "next/navigation";
import ButtonDownloadPdf from "../elements/ButtonDownloadPdf";
import { estadosContrato } from "@/data/Features";


export default function TableroContratos({
  titulo="Contratos",
  dataContracts=[],
  baseSlugIdContract='/dashboard/contracts/inmueble/',
  slugCreateProcess='/dashboard/contracts/inmueble/form-add'
}) {
  const [vista, setVista] = useState("tabla"); // "tabla" o "canvas"
  const router = useRouter();
  
  return (
    <div className="w-full rounded-sm shadow-sm bg-white p-4">
      <section className="flex flex-row items-center justify-between">
        <div>
          <Title1 className="text-2xl">
            Tablero de {titulo}
          </Title1>
          <p className="text-sm text-gray-500">Tablero para visualizar la información</p>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            className={"bg-[#0C1019]"}
            onClick={()=>router.push(slugCreateProcess)}
          >
            Agregar Contrato
          </Button>
          <Button
            className='text-[#0C1019] text-center'
            variant={vista === "tabla" ? "outline" : 'ghost'}
            onClick={() => setVista("tabla")}
          >
            <List className='w-4 h-8 text-lg'/>
          </Button>
          <Button
            className='text-[#0C1019]'
            variant={vista === "canvas" ? "outline" : "ghost"}
            onClick={() => setVista("canvas")}
          >
            <LayoutGrid className="w-4 h-8 text-lg"/>
          </Button>
        </div>
      </section>
      {/* VISTA TABLA */}
      {vista === "tabla" && (
        <div className="mt-8 overflow-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Tipo de Contrato</TableHead>
                <TableHead>Tipo de Bien</TableHead>
                <TableHead>Compradores</TableHead>
                <TableHead>Vendedores</TableHead>
                <TableHead>Minuta</TableHead>
                <TableHead>Tipo de Pago</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataContracts?.map((contrato, idx) => (
                <TableRow key={idx}>
                  <TableCell>{idx}</TableCell>
                  <TableCell>
                    <Link href={baseSlugIdContract+ contrato?.id} className="text-blue-600 underline">
                    {contrato?.case || contrato?.contractType}
                    </Link>
                  </TableCell>
                  <TableCell>{"Inmueble"}</TableCell>
                  <TableCell>{
                      contrato?.buyers?.people?.map((person, idx)=><p key={idx}>{person?.firstName} {person?.lastName}</p>)
                    }</TableCell>
                  <TableCell>{
                    contrato?.sellers?.people?.map((person, idx)=><p key={idx}>{person?.firstName} {person?.lastName}</p>)
                    }</TableCell>
                  <TableCell>
                    <ButtonDownloadPdf
                      minutaDirectory={contrato?.minutaDirectory}
                    />
                  </TableCell>
                  <TableCell>
                    <p className="text-sm break-words whitespace-normal w-20">
                      {contrato.paymentMethod?.caption}</p></TableCell>
                  <TableCell>
                    {estadosContrato?.filter((_, idx)=>contrato.status === idx+1).map((item)=>(
                      <p key={idx} className={cn(item.bgColor, 'w-32 p-1 rounded-sm text-wrap text-center')}>{item?.title}</p>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* VISTA CANVAS */}
      {vista === "canvas" && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
          {estadosContrato.map((estado, idx) => (
            <div key={idx}>
              <h3 className={cn("text-sm p-2 rounded-lg", estado?.bgColor)}>{estado?.title} </h3>
              <div className="space-y-2 mt-4">
                {dataContracts
                  .filter((contrato) => contrato.status === estado.id)
                  .map((contrato, idx) => ( <CardContract key={idx} contract={contrato} />))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}