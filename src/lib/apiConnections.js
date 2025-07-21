const URL_GET_DATA_CLIENT = "http://localhost:8000/home/client/id/?idUser=";
const URL_GET_CONTRACT_BY_ID = "http://localhost:8000/home/contract/contractId/?idContract=";
const URL_PROCESS_MINUTA="http://localhost:8000/contracts/processMinuta";
const URL_GET_MINUTA = "http://localhost:8000/home/minuta";

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
    
}