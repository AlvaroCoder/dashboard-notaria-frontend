// components/CardPersonBuyerSeller.jsx
import { User, Badge, MapPin, Briefcase, Heart } from "lucide-react";

export default function CardPersonBuyerSeller({ person }) {
  const {
    firstName,
    lastName,
    dni,
    gender,
    nationality,
    age,
    job,
    address,
    maritalStatus,
  } = person;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full  mx-auto border border-gray-200">
      <div className="flex items-center mb-4 space-x-3">
        <User className="w-8 h-8 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">
          {firstName} {lastName}
        </h2>
      </div>

      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex items-center space-x-2">
          <Badge className="w-4 h-4 text-gray-500" />
          <span>DNI: {dni}</span>
        </div>

        <div className="flex items-center space-x-2">
          <Heart className="w-4 h-4 text-gray-500" />
          <span>Estado civil: {maritalStatus?.civilStatus || 'No especificado'}</span>
        </div>

        <div className="flex items-center space-x-2">
          <Briefcase className="w-4 h-4 text-gray-500" />
          <span>Profesión: {job}</span>
        </div>

        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-gray-500" />
          <span>Edad: {age} años</span>
        </div>

        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-gray-500" />
          <span>Género: {gender}</span>
        </div>

        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-gray-500" />
          <span>Nacionalidad: {nationality}</span>
        </div>

        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span>
            Dirección: {address?.name}, {address?.district}, {address?.province}, {address?.department}
          </span>
        </div>
      </div>
    </div>
  );
}