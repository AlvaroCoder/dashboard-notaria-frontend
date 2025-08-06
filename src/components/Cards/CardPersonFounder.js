"use client"

import { User, MapPin, Calendar, Briefcase, IdCard, Flag, Heart } from "lucide-react"

export default function CardPersonFounder({ person }) {
  return (
    <div className="w-full mx-auto bg-white shadow-lg rounded-2xl p-6 space-y-4">
      {/* Nombre completo */}
      <div className="flex items-center gap-3 border-b pb-3">
        <User className="text-blue-600 w-6 h-6" />
        <h2 className="text-2xl font-bold">
          {person.firstName} {person.lastName}
        </h2>
      </div>

      {/* Información básica */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <IdCard className="text-gray-600 w-5 h-5" />
          <span className="text-gray-700 font-medium">DNI: </span>
          <span>{person.dni}</span>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="text-gray-600 w-5 h-5" />
          <span className="text-gray-700 font-medium">Edad: </span>
          <span>{person.age} años</span>
        </div>

        <div className="flex items-center gap-2">
          <Briefcase className="text-gray-600 w-5 h-5" />
          <span className="text-gray-700 font-medium">Profesión: </span>
          <span>{person.job}</span>
        </div>

        <div className="flex items-center gap-2">
          <Flag className="text-gray-600 w-5 h-5" />
          <span className="text-gray-700 font-medium">Nacionalidad: </span>
          <span>{person.nationality}</span>
        </div>

        <div className="flex items-center gap-2">
          <Heart className="text-gray-600 w-5 h-5" />
          <span className="text-gray-700 font-medium">Estado Civil: </span>
          <span>{person.maritalStatus.civilStatus}</span>
          {person.maritalStatus.spouse && (
            <span className="ml-2 text-gray-500">
              (Cónyuge: {person.maritalStatus.spouse})
            </span>
          )}
        </div>
      </div>

      {/* Dirección */}
      <div className="pt-3 border-t">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="text-green-600 w-5 h-5" />
          <span className="text-gray-700 font-medium">Dirección</span>
        </div>
        <p className="text-gray-600">
          {person.address.name}, {person.address.district}, {person.address.province}, {person.address.department}
        </p>
      </div>

      {/* Fecha de firma */}
      <div className="pt-3 border-t flex items-center gap-2">
        <Calendar className="text-purple-600 w-5 h-5" />
        <span className="text-gray-700 font-medium">Fecha de firma: </span>
        <span>{person.signedDate ? person.signedDate : "No registrada"}</span>
      </div>
    </div>
  )
}