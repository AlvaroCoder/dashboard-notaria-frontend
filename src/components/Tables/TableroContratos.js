"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableHead, TableRow, TableHeader, TableCell, TableBody } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { List, LayoutGrid } from "lucide-react";

const estadosContrato = [
  "PROCESO INICIADO",
  "EN REVISIÓN",
  "OBSERVADO",
  "PENDIENTE DE FIRMA",
  "FIRMADO",
  "PENDIENTE DE RESPUESTA DEL SID",
  "TACHADO",
  "INSCRITO",
];

// Mock de contratos
const contratosMock = [
  {
    numero: "001",
    tipoContrato: "Compra",
    tipoBien: "Inmueble",
    compradores: ["Ana Ruiz", "Carlos Pérez"],
    vendedores: ["Pedro Sánchez"],
    minutaUrl: "/api/descargar/contrato001.pdf",
    tipoPago: "Transferencia",
    estado: "EN REVISIÓN",
  },
  {
    numero: "002",
    tipoContrato: "Venta",
    tipoBien: "Vehículo",
    compradores: ["Luis Fernández"],
    vendedores: ["Erick Rivas"],
    minutaUrl: "/api/descargar/contrato002.pdf",
    tipoPago: "Contado",
    estado: "FIRMADO",
  },
  // Agrega más contratos si necesitas
];

export default function TableroContratos() {
  const [vista, setVista] = useState("tabla"); // "tabla" o "canvas"

  return (
    <div className="space-y-4">
      {/* Botones para cambiar de vista */}
      <div className="flex justify-end gap-2">
        <Button
          variant={vista === "tabla" ? "default" : "outline"}
          onClick={() => setVista("tabla")}
        >
          <List className="w-4 h-4 mr-1" /> Tabla
        </Button>
        <Button
          variant={vista === "canvas" ? "default" : "outline"}
          onClick={() => setVista("canvas")}
        >
          <LayoutGrid className="w-4 h-4 mr-1" /> Canvas
        </Button>
      </div>

      {/* VISTA TABLA */}
      {vista === "tabla" && (
        <div className="overflow-auto rounded-lg border">
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
              {contratosMock.map((contrato, idx) => (
                <TableRow key={idx}>
                  <TableCell>{contrato.numero}</TableCell>
                  <TableCell>{contrato.tipoContrato}</TableCell>
                  <TableCell>{contrato.tipoBien}</TableCell>
                  <TableCell>{contrato.compradores.join(", ")}</TableCell>
                  <TableCell>{contrato.vendedores.join(", ")}</TableCell>
                  <TableCell>
                    <a
                      href={contrato.minutaUrl}
                      target="_blank"
                      className="text-blue-600 underline"
                      rel="noopener noreferrer"
                    >
                      Descargar
                    </a>
                  </TableCell>
                  <TableCell>{contrato.tipoPago}</TableCell>
                  <TableCell>{contrato.estado}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* VISTA CANVAS */}
      {vista === "canvas" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
          {estadosContrato.map((estado) => (
            <div key={estado}>
              <h3 className="text-lg font-semibold mb-2">{estado}</h3>
              <div className="space-y-2">
                {contratosMock
                  .filter((contrato) => contrato.estado === estado)
                  .map((contrato, idx) => (
                    <Card key={idx} className="shadow border">
                      <CardContent className="p-4 space-y-1">
                        <p className="text-sm font-bold">#{contrato.numero} - {contrato.tipoContrato}</p>
                        <p className="text-sm text-gray-600">{contrato.tipoBien}</p>
                        <p className="text-sm text-gray-600">Pago: {contrato.tipoPago}</p>
                        <a
                          href={contrato.minutaUrl}
                          target="_blank"
                          className="text-blue-600 text-sm underline"
                          rel="noopener noreferrer"
                        >
                          Ver minuta
                        </a>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}