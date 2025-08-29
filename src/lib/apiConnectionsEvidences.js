const URL_FETCH_EVIDENCE=process.env.NEXT_PUBLIC_URL_FETCH_EVIDENCE;

export function fetchImageEvidence(path) {
    return fetch(URL_FETCH_EVIDENCE,{
        method : 'POST',
        mode : 'cors',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({path})
    })
}