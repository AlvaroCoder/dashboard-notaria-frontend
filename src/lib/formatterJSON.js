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
    const formatDate = formatDateToYMD(new Date());
  
    // Helper: determina si es casado/a con bienes mancomunados (type === 2)
    const esCasadoMancomunado = (ms) => {
      const status = (ms?.civilStatus ?? '').toString().trim().toLowerCase();
      // acepta "casado" o "casada"
      const casadoOA = /^casad[oa]$/.test(status);
      const tipo = Number.parseInt(ms?.marriageType?.type, 10);
      return casadoOA && tipo === 2;
    };
  
    const mapPeople = (people = []) =>
      people.map((person = {}) => {
        const { dni, maritalStatus, firstName, lastName } = person || {};
  
        const base = {
          dni,
          firstName,
          lastName,
          signedDate: { date: formatDate },
          maritalStatus: {
            civilStatus: maritalStatus?.civilStatus ?? ''
          }
        };
  
        if (esCasadoMancomunado(maritalStatus) && maritalStatus?.spouse) {
          const s = maritalStatus.spouse || {};
          base.maritalStatus.spouse = {
            firstName: s.firstName ?? '',
            lastName: s.lastName ?? '',
            dni: s.dni ?? '',
            signedDate: { date: formatDate }
          };
        }
  
        return base;
      });
  
    const tiposFundadores = ['asociacion', 'sac', 'razonsocial', 'rs', 'scrl'];
  
    if (tiposFundadores.includes(obj.contractType?.toLowerCase?.())) {
      return {
        contractId: obj?.id,
        founders: { people: mapPeople(obj?.founders?.people || []) },
        signedDocumentDate: { date: formatDate }
      };
    }
  
    return {
      contractId: obj?.id,
      buyers: { people: mapPeople(obj?.buyers?.people || []) },
      sellers: { people: mapPeople(obj?.sellers?.people || []) },
      signedDocumentDate: { date: formatDate }
    };
  }

export function reducCompraVentaJSON(data) {
  const {contractId, signedDocumentDate} = data;
  const buyersPeople = data?.buyers?.people?.map((buyer)=>{
    const { dni, maritalStatus, } = buyer || {};
    const base = {
      dni,
      signedDate: { date: formatDateToYMD(new Date()) },
      maritalStatus: {
        civilStatus: maritalStatus?.civilStatus
      }
    };
    
  return base;
  });
  const sellersPeople = data?.sellers?.people?.map((seller) => {
    const { dni, maritalStatus } = seller || {};
    const base = {
      dni,
      signedDate: { date: formatDateToYMD(new Date()) },
      maritalStatus: {
        civilStatus: maritalStatus?.civilStatus
      }
    };
  

  
    return base;
  });
  return {
    contractId,
    sellers : sellersPeople,
    buyers : buyersPeople,
    signedDocumentDate
  }
}