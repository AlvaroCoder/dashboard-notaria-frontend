import {createContext, useContext, useState} from "react"

const Contratos = createContext({
    dataMinuta : null,
    dataBloquesMinuta : [],
    inicializarBloquesMinuta : (bloques)=>{},
    inicializarDataMinuta : (data)=>{},
    generarContrato : ()=>{},
    agregarBloqueMinuta : (idx, data)=>{}
});

export const useContratoContext = ()=>useContext(Contratos);

export default function ContratoContext ({
    children
}){
    const [dataMinuta, setDataMinuta] = useState({
        contractId: "",
        sellers : {
            people : []
        },
        buyers : {
            people : []
        },
        creationDay : {},
        notario : {},
        minuta : {
            minutaNumber : 0,
            creationDay : {
                date : ""
            },
            minutaContent : {
                data : []
            },
            place : {}
        },
        header : {},
        paymentMethod : {},
        fojaData : {
            start : {},
            end : {}
        }
    });

    const [dataBloquesMinuta, setDataBloquesMinuta] = useState([]);

    const inicializarDataMinuta =(data)=>{
        setDataMinuta(data);
    }

    const inicializarBloquesMinuta=(bloques)=>{
        setDataBloquesMinuta(bloques);
    }

    const agregarBloqueMinuta=(idx, data)=>{

    }

    const generarContrato=()=>{

    }

    return(
        <Contratos.Provider
            value={{
                dataMinuta,
                dataBloquesMinuta,
                inicializarDataMinuta,
                inicializarBloquesMinuta,
                agregarBloqueMinuta,
                generarContrato
            }}
        >
            {children}
        </Contratos.Provider>
    )
}