import { formatDateToYMD } from "./fechas";

export function transformarJSON(jsonOriginal) {
    // Parsear el string JSON a un objeto JavaScript
    let datos = jsonOriginal
  
    // Obtener la fecha firmada del documento si existe
    if (datos.datesDocument && datos.datesDocument.escrituraSigned) {
      const fechaCompleta = datos.datesDocument.escrituraSigned;
      const fechaFirmado = fechaCompleta.split('T')[0];
  
      // Agregar el campo "signedDocumentDate"
      datos.signedDocumentDate = {
        date: fechaFirmado
      };
    }
  
    // Agregar el campo "signedDocument" si existe la ruta de la escritura
    if (datos.documentPaths && datos.documentPaths.escrituraPath) {
      datos.signedDocument = {
        signedDocument: datos.documentPaths.escrituraPath
      };
    }
  
    // Devolver el objeto transformado como un string JSON formateado
    return datos
  }

export function filtrarCampos(obj) {
  console.log(obj);
  if (['asociacion', 'sac', 'razonSocial', 'scrl'].includes(obj.contractType)) {
    return {
      contractId : obj?.id,
      founders : obj.founders,
      signedDocumentDate : {
        date : formatDateToYMD(new Date())
      }
    }
  }
  return {
    contractId: obj.id,
    sellers: obj.sellers,
    buyers: obj.buyers,
    signedDocumentDate: {
      date : formatDateToYMD(new Date())
    }
  };
}