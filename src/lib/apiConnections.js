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
}

export async function generateScriptContract(type, bodyScript) {
    return fetch(`${URL_CREATE_SCRIPT}/${type}/escritura/`,{
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
}