export default function TableroContratosCarga({ vista = "tabla" }) {
    if (vista === "canvas") {
      const estados = [
        "PROCESO INICIADO", "EN REVISIÓN", "OBSERVADO", "PENDIENTE DE FIRMA",
        "FIRMADO", "PENDIENTE DE RESPUESTA DEL SID", "TACHADO", "INSCRITO"
      ];
  
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {estados.map((estado, idx) => (
            <div key={idx} className="bg-gray-100 p-4 rounded-xl border h-[300px] flex flex-col">
              <div className="font-semibold text-gray-500 mb-4">{estado}</div>
              <div className="space-y-3 overflow-auto">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg p-4 shadow space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }
  
    // Vista tipo tabla
    return (
      <div className="overflow-x-auto rounded-xl border animate-pulse">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {["#", "Tipo", "Bien", "Compradores", "Vendedores", "Minuta", "Pago", "Estado"].map((title, i) => (
                <th key={i} className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">{title}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(5)].map((_, idx) => (
              <tr key={idx}>
                {[...Array(8)].map((_, i) => (
                  <td key={i} className="px-4 py-3">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }