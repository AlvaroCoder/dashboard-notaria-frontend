import { CalendarClock, CheckCircle, FileText, Lock, Upload, Users } from "lucide-react";

export const features = [
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

export const estadosContrato = [
  {id : 1, title : "PROCESO INICIADO", bgColor : "bg-green-50"},
  {id : 2, title : "EN REVISIÓN", bgColor : "bg-amber-100"},
  {id : 3, title : "OBSERVADO", bgColor : "bg-slate-100"},
  {id : 4, title : "PENDIENTE DE FIRMA", bgColor : "bg-blue-200 "},
  {id : 5, title : "FIRMADO", bgColor : "bg-amber-200"},
  {id : 6, title : "PENDIENTE DE RESPUESTA DEL SID", bgColor : "bg-gray-50"},
  {id : 7, title : "TACHADO", bgColor : "bg-red-100"},
  {id : 8 ,title : "INSCRITO", bgColor : "bg-green-100"},
];