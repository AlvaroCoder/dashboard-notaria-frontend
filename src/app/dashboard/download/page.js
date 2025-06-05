import React from 'react'

export default function Page() {
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-gray-50">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">
        Su archivo está a punto de descargarse...
      </h1>
      <p className="text-gray-600 text-lg">
        Si la descarga no comienza automáticamente, por favor verifique su conexión o intente nuevamente.
      </p>
    </div>
  )
}