import { toast } from "react-toastify";
import {  submitDataPreMinuta, submitDataPreMinuta2 } from "./apiConnections";
import { formatDateToYMD } from "./fechas";

 export const funUploadDataMinuta=async( clientId, contractType='sac')=>{

    const JSONPreMinuta = {
      clientId,
      processPayment : "PAGADO",
      datesDocument : {
        processInitiate : formatDateToYMD(new Date())
      },
    };

    const responsePreMinuta = await submitDataPreMinuta(JSONPreMinuta, contractType);
    if (!responsePreMinuta.ok || responsePreMinuta.status == 422) {
      toast("Error al momento de subir la información",{
        type : 'error',
        position : 'bottom-center'
      });
      return;
    }

    const responsePreMinutaJSON =  await responsePreMinuta.json();
    const idContract = responsePreMinutaJSON?.contractId;
        
    return {idContract}
  }

  export const funUploadDataMinutaCompraVenta=async(clientId, contractType='sac')=>{
    
    const JSONPreMinuta = {
      clientId,
      datesDocument : {
        processInitiate : formatDateToYMD(new Date())
      },
    };

    const responsePreMinuta = await submitDataPreMinuta2(JSONPreMinuta, contractType);
    if (!responsePreMinuta.ok || responsePreMinuta.status == 422) {
      toast("Error al momento de subir la información",{
        type : 'error',
        position : 'bottom-center'
      });
      return;
    }

    const responsePreMinutaJSON =  await responsePreMinuta.json();
    const idContract = responsePreMinutaJSON?.contractId;
    
    return {idContract}
  }