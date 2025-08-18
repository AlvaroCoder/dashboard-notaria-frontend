const URL_BASE = process.env.NEXT_PUBLIC_BASE_URL;
const URL_GET_DATA_CLIENT = process.env.NEXT_PUBLIC_URL_HOME_CLIENT + "/id/?idUser=";
const URL_GET_CONTRACT_BY_ID = process.env.NEXT_PUBLIC_URL_HOME_CONTRACT+"/contractId/?idContract=";
const URL_PROCESS_MINUTA=process.env.NEXT_PUBLIC_URL_CONTRACTS+"/processMinuta";
const URL_GET_MINUTA = process.env.NEXT_PUBLIC_URL_HOME+"/minuta";
const URL_REGISTER_CLIENT = process.env.NEXT_PUBLIC_URL_REGISTER_CLIENT;
const URL_CONTRACTS = process.env.NEXT_PUBLIC_URL_HOME_CONTRACTS;
const URL_SEND_MINUTA = process.env.NEXT_PUBLIC_URL_CONTRACTS+"/sendMinuta";
const URL_ASSIGN_JUNIOR_TO_CONTRACT = process.env.NEXT_PUBLIC_URL_ASSIGN_JUNIOR
const URL_CREATE_PROCESS = process.env.NEXT_PUBLIC_URL_CREATE_PROCESS;
const URL_CREATE_PROCESS_2 = process.env.NEXT_PUBLIC_URL_CREATE_PROCESS_2;
const URL_CREATE_SCRIPT=process.env.NEXT_PUBLIC_URL_GENERATE_SCRIPT
const URL_CREATE_EVIDENCE=process.env.NEXT_PUBLIC_URL_SEND_EVIDENCE;
const URL_GENERATE_SCRIPT_COMPRA_VENTA= process.env.NEXT_PUBLIC_URL_CREATE_COMPRA_VENTA;
const URL_GENERATE_SCRIPT_WATER_MAKER_CONSTITUTION = process.env.NEXT_PUBLIC_URL_CREATE_ESCRITURA_MARCA_AGUA;
const URL_GET_DOCUMENT_BY_PATH=process.env.NEXT_PUBLIC_URL_GET_DOCUMENT_BY_PATH;
const URL_ESTABLECER_FIRMA=process.env.NEXT_PUBLIC_URL_FIRMAR_DOCUMENTO;
const URL_SEND_MINUTA_WORD= process.env.NEXT_PUBLIC_URL_SEND_MINUTA_WORD;
const URL_SUBIR_EVIDENCIAS_SIN_DIR = process.env.NEXT_PUBLIC_URL_UPLOAD_EVIDENCE_WITHOUT_DIR;


export async function getDataClientByClientId(idClient) {
    return fetch(`${URL_GET_DATA_CLIENT}${idClient}`,{
        method : 'GET',
        mode : 'cors'
    })
}
export async function getDataContractByIdContract(idContract) {
    return fetch(`${URL_GET_CONTRACT_BY_ID}${idContract}`,{
        method : 'GET',
        mode : 'cors'
    })
}

export async function asignJuniorToContracts(idContract, idJunior) {
    return fetch(`${URL_ASSIGN_JUNIOR_TO_CONTRACT}${idContract}&juniorId=${idJunior}`,{
        method : 'POST',
        mode : 'cors'
    })
};

export async function generateScriptContract(type, bodyScript) {
    return fetch(`${URL_CREATE_SCRIPT}/${type}/escritura/`,{
        method : 'POST',
        mode : 'cors',
        headers : {
            'Content-type' : 'application/json'
        },
        body : JSON.stringify(bodyScript)
    })
};

export async function generateScriptCompraVenta(type, bodyScript) {
    return fetch(`${URL_GENERATE_SCRIPT_COMPRA_VENTA}/${type}/escritura`,{
        method : 'POST',
        mode : 'cors',
        headers : {
            'Content-type' : 'application/json'
        },
        body : JSON.stringify(bodyScript)
    })
}

export async function aceptarEscritura(contractId) {
    return fetch(`${URL_BASE}/update/contract/confirmation/?contractId=${contractId}`,{
        method : 'PUT',
        mode : 'cors',
    })
}

export async function generarParteNotarial(data, type) {
    return fetch(`${URL_BASE}/contracts/compra_venta/${type}/parteNotarial/`,{
        method : 'POST',
        mode : 'cors',
        headers : {
            'Content-type' : 'application/json'
        },
        body : JSON.stringify(data)
    });
}

export async function generarParteNotarialConstitucion(data, type) {
    return fetch(`${URL_BASE}/contracts/constitucion/${type}/parteNotarial/`,{
        method : 'POST',
        mode : 'cors',
        headers : {
            'Content-type' : 'application/json'
        },
        body : JSON.stringify(data)
    });
}

export async function generateScriptMarcaAguaCompraVenta(type, bodyScript) {
    return fetch(`${URL_GENERATE_SCRIPT_COMPRA_VENTA}/${type}/escritura/?waterMark=true`,{
        method : 'POST',
        mode : 'cors',
        headers : {
            'Content-type' : 'application/json'
        },
        body : JSON.stringify(bodyScript)
    })
}

export async function submitDataPreMinuta(dataPreMinuta, typeProcess) {
    return fetch(`${URL_CREATE_PROCESS}${typeProcess}`,{
        method : 'POST',
        headers :{
            'Content-Type' : 'application/json'
        },
        mode : 'cors',
        body : JSON.stringify(dataPreMinuta)
    })
}

export async function submitDataPreMinuta2(dataPreMinuta, typeProcess) {
    return fetch(`${URL_CREATE_PROCESS_2}/${typeProcess}`,{
        method : 'POST',
        headers :{
            'Content-Type' : 'application/json'
        },
        mode : 'cors',
        body : JSON.stringify(dataPreMinuta)
    });
}

export async function subirEvidencias(evidencias=[], directory='') {
    const responsesEvidences = evidencias?.map(async(evidencia)=>{
        const formDataEvidence = new FormData();
        formDataEvidence.append('evidence', evidencia[0])

        const response = await fetch(`${URL_CREATE_EVIDENCE}${directory}`,{
            method : 'POST',
            body : formDataEvidence
        });

        const responseJSON = await response.json();
        const file = responseJSON?.fileLocation;

        return `DB_evidences/${file?.directory}/${file?.fileNames[0]}`
    });
    return Promise.all(responsesEvidences);
}

export async function subirEvidenciasSinDirectorio(dataImagesMinuta) {
    return await fetch(URL_SUBIR_EVIDENCIAS_SIN_DIR,{
        method : 'POST',
        body : dataImagesMinuta,
        redirect : 'follow'
    })
}

export async function getDataContractByTypeContract(typeContract) {
    return fetch(`${URL_CONTRACTS}/${typeContract}`,{
        method : 'GET',
        mode : 'cors',
        redirect : 'follow'
    })
}

export async function processDataMinuta(dataMinuta) {
    return fetch(URL_PROCESS_MINUTA,{
        method : 'POST',
        body : dataMinuta,
        redirect : 'follow'
    });
}

export async function sendDataMinuta(dataMinuta) {
    return fetch(URL_SEND_MINUTA,{
        method : 'POST',
        body : dataMinuta,
        redirect : 'follow'
    });
}

export async function sendMinutaWord(dataMinuta, idContract) {
    return fetch(URL_SEND_MINUTA_WORD+idContract,{
        method : 'POST',
        body : dataMinuta,
        redirect : 'follow'
    })
};

export async function getMinutaFile(minutaDirectory) {
    return fetch(URL_GET_MINUTA,{
        method : 'POST',
        mode : 'cors',
        headers :{
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({ path : minutaDirectory })
    });
    
};

export async function registerClient(data) {
    return fetch(URL_REGISTER_CLIENT,{
        method : 'POST',
        headers : {
            'Content-type' : 'application/json'
        },
        body : JSON.stringify(data)
    });
};

export async function submitEscrituraCliente(data, type) {
    return fetch(`${URL_GENERATE_SCRIPT_WATER_MAKER_CONSTITUTION}${type}/escritura/?waterMark=true`,{
        method : 'POST',
        headers : {
            'Content-type':'application/json'
        },
        mode : 'cors',
        body : JSON.stringify(data)
    })
}

export async function submitEscrituraClienteCompraVenta(data, type) {
    return fetch(`${ URL_GENERATE_SCRIPT_COMPRA_VENTA}/${type}/escritura/`,{
        method : 'POST',
        headers : {
            'Content-type':'application/json'
        },
        mode : 'cors',
        body : JSON.stringify(data)
    })
}

export async function getDocumentByPath(path) {
    return fetch(`${URL_GET_DOCUMENT_BY_PATH}`,{
        method : 'POST',
        headers : {
            'Content-type' : 'application/json'
        },
        mode : 'cors',
        body : JSON.stringify({path})
    });
}
export async function submitFirmarDocumento(contractId, fecha) {
    return fetch(`${URL_ESTABLECER_FIRMA}${contractId}&signedDocumentDate=${fecha}`,{
        method : 'PUT',
        mode : 'cors'
    })
};

export async function setUpTestimonioCompraVenta(data, type) {
    return fetch(`${URL_BASE}/contracts/compra_venta/${type}/testimonio/`,{
        method : 'POST',
        mode : 'cors',
        headers : {
            'Content-type' :'application/json'
        },
        body : JSON.stringify(data)
    });
}

export async function setUpTestimonioConstitucion(data, type) {
    return fetch(`${URL_BASE}/contracts/constitucion/${type}/testimonio/`,{
        method : 'POST',
        headers : {
            'Content-type' : 'application/json'
        },
        mode : 'cors',
        body : JSON.stringify(data)
    });
}

export async function fetchEscrituraWord(path) {
    return fetch(`${URL_BASE}/home/document`,{
        method : 'POST',
        headers : {
            'Content-type' : 'application/json'
        },
        body : JSON.stringify({path})
    })
}