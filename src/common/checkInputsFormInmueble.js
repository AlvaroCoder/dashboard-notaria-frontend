export function checkEmptyFieldsFormCompra(dataCompra) {
    let listaErroresCompra = [];
    for (const indice in dataCompra ){
        for (const key in dataCompra[indice]){
            const valor = dataCompra[indice][key];
            if (typeof valor === 'object' && valor !== null && !Array.isArray(valor)) {
                for (const j in valor){
                    if (valor[j] === '') {
                        listaErroresCompra[indice] = {
                            error : true,
                            value : 'Por favor completar el formulario'
                        }
                    }
                }
            }else {
                if (valor === '') {
                    listaErroresCompra[indice] = {
                        error : true,
                        value : 'Por favor completar el formulario'
                    }
                }
            }
        }
    }
    return listaErroresCompra;
}

export function checkEvidenceEmpty(data=[]) {
    return data?.length > 0 ? {error : false, value : "Evidencias subidas"} : {error : true, value : 'Suba las evidencia de pago'}
}