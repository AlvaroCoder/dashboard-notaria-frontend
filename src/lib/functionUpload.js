import { toast } from "react-toastify";
import { sendDataMinuta, sendMinutaWord, submitDataPreMinuta, submitDataPreMinuta2 } from "./apiConnections";
import { formatDateToYMD } from "./fechas";

 export const funUploadDataMinuta=async(minutaPdf, clientId, contractType='sac')=>{
    const newFormDataPdf = new FormData();
    newFormDataPdf.append('minutaFile', minutaPdf);

    const response = await sendDataMinuta(newFormDataPdf);
    const jsonResponseUpload = await response.json();

    const fileLocation = jsonResponseUpload?.fileLocation;

    const JSONPreMinuta = {
      clientId,
      processPayment : "Pago a la mitad",
      minutaDirectory : `DB_evidences/${fileLocation?.directory}/${fileLocation?.fileName}`,
      datesDocument : {
        processInitiate : formatDateToYMD(new Date())
      },
      directory : `DB_evidences/${fileLocation?.directory}`
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

  export const funUploadDataMinutaCompraVenta=async(minutaWord, minutaPdf, clientId, contractType='sac', caseCompraVenta="")=>{
    const newFormDataPdf = new FormData();
    newFormDataPdf.append('minutaFile', minutaPdf);

    const response = await sendDataMinuta(newFormDataPdf);
    
    const jsonResponseUpload = await response.json();    
    const fileLocation = jsonResponseUpload?.fileLocation;
    
    const JSONPreMinuta = {
      clientId,
      processPayment : "Pago a la mitad",
      minutaDirectory : `DB_evidences/${fileLocation?.directory}/${fileLocation?.fileName}`,
      datesDocument : {
        processInitiate : formatDateToYMD(new Date())
      },
      directory : `DB_evidences/${fileLocation?.directory}`,
      case : caseCompraVenta
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

    
    const newFormDataWord = new FormData();
    newFormDataWord.append('minutaFile', minutaWord);

    await sendMinutaWord(newFormDataWord, idContract);
    
    return {idContract, fileLocation}
  }