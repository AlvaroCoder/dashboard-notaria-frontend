import { Button } from '@/components/ui/button'
import { Frown } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
      <div className="bg-white p-10 rounded-2xl shadow-md max-w-lg w-full">
        <div className="flex flex-col items-center space-y-4">
          <Frown className="h-12 w-12 text-red-500" />
          <h1 className="text-3xl font-bold text-gray-800">Página no encontrada</h1>
          <p className="text-gray-600">
            Lo sentimos, la ruta que estás buscando no existe o fue movida.
          </p>
          <Link href="/">
            <Button className="mt-4">Volver al inicio</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
