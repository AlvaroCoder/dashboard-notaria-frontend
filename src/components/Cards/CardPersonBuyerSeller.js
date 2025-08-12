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
  } = person || {};

  const isMarried = maritalStatus?.civilStatus?.toLowerCase().includes("casad");
  const spouse = maritalStatus?.spouse;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full mx-auto border border-gray-200">
      {/* Información de la persona */}
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
          <span>
            Estado civil: {maritalStatus?.civilStatus || "No especificado"}
          </span>
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
            Dirección: {address?.name}, {address?.district},{" "}
            {address?.province}, {address?.department}
          </span>
        </div>
      </div>

      {/* Información del cónyuge si aplica */}
      {isMarried && spouse && (
        <div className="mt-6 border-t border-gray-200 pt-4">
          <div className="flex items-center mb-4 space-x-3">
            <User className="w-8 h-8 text-pink-600" />
            <h3 className="text-lg font-semibold text-gray-800">
              Cónyuge: {spouse.firstName} {spouse.lastName}
            </h3>
          </div>

          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center space-x-2">
              <Badge className="w-4 h-4 text-gray-500" />
              <span>DNI: {spouse.dni}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-gray-500" />
              <span>Profesión: {spouse.job}</span>
            </div>

            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-500" />
              <span>Edad: {spouse.age} años</span>
            </div>

            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-500" />
              <span>Género: {spouse.gender}</span>
            </div>

            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-500" />
              <span>Nacionalidad: {spouse.nationality}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}