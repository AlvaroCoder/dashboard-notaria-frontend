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
  if (['asociacion', 'sac', 'razonSocial', 'scrl'].includes(obj.contractType)) {
    return {
      contractId : obj?.id,
      founders : obj.founders,
      signedDocumentDate : {
        date : formatDateToYMD(new Date())
      }
    }
  }
  else {
    const buyersPeople = obj?.buyers?.people?.map((buyer)=>{
      const { dni, maritalStatus, firstName, lastName  } = buyer || {};
      const base = {
        dni,
        firstName, 
        lastName,
        signedDate: { date: formatDateToYMD(new Date()) },
        maritalStatus: {
          civilStatus: maritalStatus?.civilStatus
        }
      };
      const isCasadoMancomunado =
      maritalStatus?.civilStatus?.toLowerCase() === 'casado' &&
      maritalStatus?.marriageType?.type === 2;
  
    if (isCasadoMancomunado) {
      base.maritalStatus.spouse = {
        firstName : maritalStatus?.spouse?.firstName,
          lastName : maritalStatus?.spouse?.lastName,
        dni: maritalStatus?.spouse?.dni,
        signedDate: { date: formatDateToYMD(new Date()) }
      };
    }
  
    return base;
    });

    const sellersPeople = obj?.sellers?.people?.map((seller) => {
      const { dni, maritalStatus, firstName, lastName } = seller || {};
      const base = {
        dni,
        firstName, 
        lastName,
        signedDate: { date: formatDateToYMD(new Date()) },
        maritalStatus: {
          civilStatus: maritalStatus?.civilStatus
        }
      };
    
      const isCasadoMancomunado =
        maritalStatus?.civilStatus?.toLowerCase() === 'casado' &&
        maritalStatus?.marriageType?.type === 2;
    
      if (isCasadoMancomunado) {
        base.maritalStatus.spouse = {
          firstName : maritalStatus?.spouse?.firstName,
          lastName : maritalStatus?.spouse?.lastName,
          dni: maritalStatus?.spouse?.dni,
          signedDate: { date: formatDateToYMD(new Date()) }
        };
      }
    
      return base;
    });
    
    return {
      contractId: obj.id,
      sellers: {
        people : sellersPeople
      },
      buyers: {
        people : buyersPeople
      },
      signedDocumentDate: {
        date : formatDateToYMD(new Date())
      }
    };
  }
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