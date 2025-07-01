'use client'
import { TableroUsuarios } from '@/components/Tables'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function Page() {
  const router = useRouter();
  return (
    <div className="p-6 w-full mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
        <p className="text-gray-600">Administra los usuarios que tienen acceso al sistema de la notaría.</p>
      </div>

      {/* Fila de búsqueda y botón */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <Input
          placeholder="Buscar usuario por nombre, correo..."
          className="w-full"
        />
        <Button 
          className="w-full md:w-auto"
          onClick={()=>router.push("usuarios/form-add")}
          >
          Agregar nuevo usuario</Button>
      </div>

      {/* Tablero (solo maqueta por ahora) */}
      <div className="space-y-6">
        <TableroUsuarios/>
      </div>
    </div>
  )
};