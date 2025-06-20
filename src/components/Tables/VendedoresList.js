"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Title1 from "../elements/Title1";
import Separator2 from "../elements/Separator2";

// Datos de prueba
const vendedoresData = [
  {
    id: 1,
    firstName: "Carlos",
    lastName: "Pérez",
    dni: "12345678",
    nationality: "Peruano",
  },
  {
    id: 2,
    firstName: "Lucía",
    lastName: "Gómez",
    dni: "87654321",
    nationality: "Peruana",
  },
];

export default function CompradoresList({
    dataVendedores = vendedoresData
}) {
const [vendedores, setVendedores] = useState(dataVendedores);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  const handleEditClick = (comprador) => {
    setSelected(comprador);
    setOpen(true);
  };

  const handleInputChange = (field, value) => {
    setSelected((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setVendedores((prev) =>
      prev.map((item) => (item.id === selected.id ? selected : item))
    );
    setOpen(false);
  };

  return (
    <div className="">
      <Title1 className="text-xl">Vendedores ({vendedores?.length})</Title1>
      <Separator2/>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vendedores.map((comprador) => (
          <div
            key={comprador.id}
            onClick={() => handleEditClick(comprador)}
            className="border p-4 rounded-xl shadow hover:bg-gray-50 cursor-pointer transition"
          >
            <p className="font-semibold">{comprador.firstName} {comprador.lastName}</p>
            <p className="text-sm text-gray-600">DNI: {comprador.dni}</p>
            <p className="text-sm text-gray-600">Nacionalidad: {comprador.nationality}</p>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Comprador</DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="space-y-3 mt-2">
              <Input
                value={selected.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder="Nombre"
              />
              <Input
                value={selected.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder="Apellido"
              />
              <Input
                value={selected.dni}
                onChange={(e) => handleInputChange("dni", e.target.value)}
                placeholder="DNI"
              />
              <Input
                value={selected.nationality}
                onChange={(e) => handleInputChange("nationality", e.target.value)}
                placeholder="Nacionalidad"
              />

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>Guardar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}