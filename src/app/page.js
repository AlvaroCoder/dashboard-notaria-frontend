'use client';
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, FileText, Users, CalendarClock, Lock, Upload } from "lucide-react";
const features = [
  {
    icon: <FileText className="h-6 w-6 text-blue-600" />,
    title: "Gestión de Documentos",
    description: "Organiza y accede fácilmente a escrituras, minutas y otros documentos legales."
  },
  {
    icon: <Users className="h-6 w-6 text-green-600" />,
    title: "Registro de Clientes",
    description: "Administra información de compradores, vendedores y representantes legales."
  },
  {
    icon: <CalendarClock className="h-6 w-6 text-orange-600" />,
    title: "Agendamiento de Citas",
    description: "Controla y programa citas para firmas, asesorías y otros servicios notariales."
  },
  {
    icon: <Lock className="h-6 w-6 text-red-600" />,
    title: "Seguridad de Datos",
    description: "Acceso seguro con autenticación y respaldo de información sensible."
  },
  {
    icon: <Upload className="h-6 w-6 text-purple-600" />,
    title: "Carga de Archivos",
    description: "Permite subir imágenes, PDFs y más a expedientes notariales."
  },
  {
    icon: <CheckCircle className="h-6 w-6 text-emerald-600" />,
    title: "Flujos Automatizados",
    description: "Reduce el trabajo manual con procesos automáticos para validar información."
  }
];

export default function Home() {
  return (
    <main className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Bienvenido al Sistema Notarial</h1>
      <p className="text-gray-600 mb-8">
        Gestiona fácilmente todos los procesos de tu notaría desde un solo lugar.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6 flex items-start gap-4">
              {feature.icon}
              <div>
                <h3 className="font-semibold text-lg text-gray-800">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div>
        
      </div>
    </main>
  );
}
