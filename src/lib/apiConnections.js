const URL_GET_DATA_CLIENT = process.env.NEXT_PUBLIC_URL_HOME_CLIENT + "/id/?idUser=";
const URL_GET_CONTRACT_BY_ID = process.env.NEXT_PUBLIC_URL_HOME_CONTRACT+"/contractId/?idContract=";
const URL_PROCESS_MINUTA=process.env.NEXT_PUBLIC_URL_CONTRACTS+"/processMinuta";
const URL_GET_MINUTA = process.env.NEXT_PUBLIC_URL_HOME+"/minuta";
const URL_REGISTER_CLIENT = process.env.NEXT_PUBLIC_URL_REGISTER_CLIENT;
const URL_CONTRACTS = process.env.NEXT_PUBLIC_URL_HOME_CONTRACTS;

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