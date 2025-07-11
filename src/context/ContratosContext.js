'use client'
import {createContext, useContext, useState} from "react"
import { toast } from "react-toastify";


function formatearFecha(fechaInput) {
    const fecha = new Date(fechaInput);
    
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Meses de 0 a 11
    const dia = String(fecha.getDate()).padStart(2, '0');
  
    return `${año}-${mes}-${dia}`;
};

const Contratos = createContext({
    dataMinuta : null,
    dataBloquesMinuta : [],
    dataPreMinuta : null,
    inicializarBloquesMinuta : (bloques)=>{},
    inicializarDataMinuta : (data)=>{},
    generarContrato : async ()=>{},
    agregarBloqueMinuta : (idx, data)=>{},
    handleChangeDataPreMinuta : ()=>{},
    handleChangeNumeroMinuta : ()=>{},
    handleChangeDataPreMinutaFileLocation : ()=>{},
    handleChangePreMinutaDate : ()=>{}
});

export const useContratoContext = ()=>useContext(Contratos);

export default function ContratoContext ({
    children
}){
    const [dataMinuta, setDataMinuta] = useState({
        
    });
    const [dataPreMinuta, setDataPreMinuta] = useState({
        case : 'compra',
        clientId : '',
        processPayment : 'Pago la mitad',
        minutaDirectory : '',
        datesDocument : {},
        directory : ''
    });
    const handleChangeDataPreMinutaFileLocation=(fileLocation)=>{
        setDataPreMinuta({...dataPreMinuta,
            minutaDirectory :`DB_evidences/${fileLocation?.directory}/${fileLocation?.fileName}`,
            directory : `DB_evidences/${fileLocation?.directory}`
        });
    }
    const handleChangeDataPreMinuta=(key, value)=>{
        setDataPreMinuta({...dataPreMinuta, [key] : value});
    }
    const handleChangePreMinutaDate=()=>{
        setDataPreMinuta({...dataPreMinuta, datesDocument : {processInitiate : formatearFecha(new Date())}})
    }
    const [dataBloquesMinuta, setDataBloquesMinuta] = useState([]);

    const inicializarDataMinuta =(idContract)=>{
        setDataMinuta({...dataMinuta, contractId : idContract});
    }
    const inicializarBloquesMinuta=(bloques)=>{
        setDataBloquesMinuta(bloques);
        const setNewDataMinuta=(data)=>{
            return {
                minutaNumber : 123,
                creationDay : {
                    date : "2025-06-30"
                },
                minutaContent : {
                    data
                },
                place : {
                    name : 'Notaria de Piura',
                    district : 'Piura'
                }
            }
        }
        setDataMinuta({...dataMinuta, minuta : setNewDataMinuta(bloques)})
    }

    const agregarBloqueMinuta=(blocksParser)=>{
        setDataMinuta((prev)=>({
            ...dataMinuta,
            minuta : {
                ...prev?.minuta,
                minutaContent : {
                    data : blocksParser
                }
            }
        }))
    }
    const handleChangeNumeroMinuta=(numeroMinuta)=>{
        setDataMinuta((prev)=>({
            ...dataMinuta,
            minuta : {
                ...prev?.minuta,
                minutaNumber : numeroMinuta
            }
        }))
    }
    const handlerGeneralJSONContract=()=>{

    }
    const generarContrato=async()=>{
        console.log(dataMinuta);
        const URL_GENERAR_MINUTA = 'http://localhost:8000/contracts/compra_venta/inmueble'; 
        const response = await fetch(URL_GENERAR_MINUTA,{
            method : 'POST',
            headers : {
                'Content-Type': 'application/json',
            },
            body : JSON.stringify(dataMinuta),
            redirect  : 'follow',
            mode : 'cors'
        });

        if (!response.ok) {
            toast("Error en el servidor", {
                type : 'error'
            });
            console.log(await response.text());
            
            return
        }
        console.log(await response.json());
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'contrato_inmueble.pdf'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url);
        
    }

    return(
        <Contratos.Provider
            value={{
                dataMinuta,
                dataBloquesMinuta,
                dataPreMinuta,
                inicializarDataMinuta,
                inicializarBloquesMinuta,
                agregarBloqueMinuta,
                generarContrato,
                handleChangeDataPreMinuta,
                handleChangeNumeroMinuta,
                handleChangeDataPreMinutaFileLocation,
                handleChangePreMinutaDate
            }}
        >
            {children}
        </Contratos.Provider>
    )
}