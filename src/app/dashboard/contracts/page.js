import { TableroContratos } from '@/components/Tables'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search } from 'lucide-react'
import React from 'react'

export default function Page() {
  return (
    <div className="p-6 space-y-6">
      {/* Título y descripción */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Contratos</h1>
        <p className="text-gray-600">Gestión de los contratos subidos por los clientes.</p>
      </div>
      {/* Buscador y botón */}
      <div className="w-full flex flex-row sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Buscador */}
        <div className="relative w-full ">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar contratos..."
            className="pl-10 w-full"
          />
        </div>
        {/* Botón agregar contrato */}
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Agregar contrato
        </Button>
      </div>
      {/* Tablero (solo maqueta por ahora) */}
      <div className=" space-y-6">
        <TableroContratos/>
      </div>
    </div>
  )
}
