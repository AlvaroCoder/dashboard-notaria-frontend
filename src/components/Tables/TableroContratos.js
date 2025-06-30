"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableHead, TableRow, TableHeader, TableCell, TableBody } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { List, LayoutGrid, Users } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Title1 from "../elements/Title1";
import CardContract from "../elements/CardContract";
import { useRouter } from "next/navigation";

const estadosContrato = [
  {id : 1, title : "PROCESO INICIADO", bgColor : "bg-green-50"},
  {id : 2, title : "EN REVISIÓN", bgColor : "bg-amber-100"},
  {id : 3, title : "OBSERVADO", bgColor : "bg-slate-100"},
  {id : 4, title : "PENDIENTE DE FIRMA", bgColor : "bg-blue-200 "},
  {id : 5, title : "FIRMADO", bgColor : "bg-amber-200"},
  {id : 6, title : "PENDIENTE DE RESPUESTA DEL SID", bgColor : "bg-gray-50"},
  {id : 7, title : "TACHADO", bgColor : "bg-red-100"},
  {id : 8 ,title : "INSCRITO", bgColor : "bg-green-100"},
];

export default function TableroContratos({
  titulo="Contratos",
  dataContracts=[]
}) {
  const [vista, setVista] = useState("tabla"); // "tabla" o "canvas"
  const router = useRouter();

  return (
    <div className="w-full rounded-sm shadow-sm bg-white p-4">
      <section className="flex flex-row items-center justify-between">
        <Title1 className="text-2xl">
          {titulo}
        </Title1>
        <div className="flex justify-end gap-2">
          <Button
            className={"bg-[#0C1019]"}
            onClick={()=>router.push("inmueble/form-add")}
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
              {dataContracts.map((contrato, idx) => (
                <TableRow key={idx}>
                  <TableCell>{idx}</TableCell>
                  <TableCell>
                    <Link href={"/dashboard/contracts/inmueble/" + contrato?.id} className="text-blue-600 underline">
                    {contrato?.case}
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
                    <Link
                      href={`/dashboard/download/?idContract=${contrato?.id}`}
                      target="_blank"
                      className="text-blue-600 underline"
                      rel="noopener noreferrer"
                    >
                      Descargar
                    </Link>
                  </TableCell>
                  <TableCell><p className="text-sm break-words whitespace-normal w-20">
                  {contrato.paymentMethod?.caption}</p></TableCell>
                  <TableCell>{contrato.estado}</TableCell>
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
              <h3 className={cn("text-sm p-2 rounded-lg", estado?.bgColor)}>{estado?.title}</h3>
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