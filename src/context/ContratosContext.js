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
    loadingProcess : false,
    viewerPdf : null,
    dataMinuta : null,
    notarioSelected : null,
    dataBloquesMinuta : [],
    dataPreMinuta : null,
    inicializarBloquesMinuta : (bloques)=>{},
    inicializarDataMinuta : (data)=>{},
    generarContrato : async ()=>{},
    agregarBloqueMinuta : (idx, data)=>{},
    handleChangeDataPreMinuta : ()=>{},
    handleChangeNumeroMinuta : ()=>{},
    handleChangeDataPreMinutaFileLocation : ()=>{},
    handleChangePreMinutaDate : ()=>{},
    selectNotario: ()=>{},
    subirInformacionMinuta : async()=>{},
    subirEvidencias : async(dataImagesMinuta)=>{},
    flushDataContrato : ()=>{},
    handleChangeFileLocation:()=>{}
});

export const useContratoContext = ()=>useContext(Contratos);

const initialDataPreMinuta = {
    case : 'compra',
    clientId : '',
    processPayment : 'Pago la mitad',
    minutaDirectory : '',
    datesDocument : {},
    directory : ''
};

export default function ContratoContext ({
    children
}){
    const [dataMinuta, setDataMinuta] = useState({
        
    });
    const [dataPreMinuta, setDataPreMinuta] = useState(initialDataPreMinuta);
    const [notarioSelected, setNotarioSelected] = useState(null);
    const [fileLocationPdf, setFileLocationPdf] = useState(null);
    const [viewerPdf, setViewerPdf] = useState(null);

    const [loadingProcess, setLoadingProcess] = useState(false);

    const flushDataContrato=()=>{
        setDataPreMinuta(initialDataPreMinuta);
        setNotarioSelected(null);
        setFileLocationPdf(null);
        setViewerPdf(null);
        
    }
    const handleChangeDataPreMinutaFileLocation=(fileLocation)=>{ 
        const {directory, fileName} = fileLocation;
        setDataPreMinuta({...dataPreMinuta,
            minutaDirectory :`DB_evidences/${directory}/${fileName}`,
            directory : `DB_evidences/${directory}`
        });
        setFileLocationPdf(fileLocation);
    };

    const handleChangeFileLocation=(fileLocation)=>{
        setFileLocationPdf(fileLocation);
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
    };

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
    };

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
    };

    const handleChangeNumeroMinuta=(numeroMinuta)=>{
        setDataMinuta((prev)=>({
            ...dataMinuta,
            minuta : {
                ...prev?.minuta,
                minutaNumber : numeroMinuta
            }
        }))
    };

    const subirEvidencias=(evidencias=[])=>{
        try {
            setLoadingProcess(true);
            const respuestas = evidencias?.map(async (evidencia)=>{
                const formDataEvidence = new FormData();
                formDataEvidence.append('evidence', evidencia[0]);
    
                const response = await fetch(`http://127.0.0.1:8000/contracts/sendEvidence/?dir=${fileLocationPdf?.directory}`,{
                    method : 'POST',
                    body : formDataEvidence
                });

                const responseJSON = await response.json();                
                const file = responseJSON?.fileLocation;
                // Ahora me devuelve un campo llamado fileNames
                return `DB_evidences/${file?.directory}/${file?.fileName}`;
            });
    
            return Promise.all(respuestas);
        } catch (err) {
            console.log(err);
            
            throw new Error('Ocurrio algo al subir la imagen');
        } finally{
            setLoadingProcess(false);
        }
    };

    const subirInformacionMinuta=async(contractId, vendedores, compradores, paymentMethod)=>{
        try {
            setLoadingProcess(true);
            const newDataSend ={
                contractId,
                sellers : {
                    people : vendedores
                },
                buyers : {
                    people : compradores
                },
                creationDay : {
                    date : formatearFecha(new Date())
                },
                notario : {
                    firstName : "Javier",
                    lastName : 'Rojas',
                    dni : '123456',
                    ruc : '1234567'
                },
                minuta : {
                    ...dataMinuta?.minuta,
                    creationDay : {
                        date : formatearFecha(new Date())
                    },
                    place : {
                        name : 'NO IMPORTA',
                        district : 'Piura'
                    }
                },
                paymentMethod,
                header:{
                    numeroDocumentoNotarial:123,
                    numeroRegistroEscritura:456,
                    year:2025,
                    folio:12,
                    tomo:"XXIV",
                    kardex:"I1234O"
                },
                fojaData:{
                    start:{
                        number:"1123",
                        serie:"C"
                    },
                    end:{
                        number:"1125V",
                        serie:"C"
                    }
                }
    
            };
                        
            const response = await fetch('http://localhost:8000/contracts/compra_venta/inmueble/escritura/',{
                mode : 'cors',
                method : 'POST',
                headers : {
                    'Content-type' : 'application/json'
                },
                body : JSON.stringify(newDataSend),
                
            });
    
            const blobResponse = await response.blob();
            const url = URL.createObjectURL(blobResponse);
            setViewerPdf(url);

        } catch (err) {
            console.log(err);
            setLoadingProcess(false);
        } finally{
            setLoadingProcess(false);
        }
        
    }
    const selectNotario = (notarioData)=>{
        setDataMinuta({
            ...dataMinuta,
            notario : notarioData
        });
        setNotarioSelected(notarioData);
    }
    const generarContrato=async()=>{

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
                loadingProcess,
                viewerPdf,
                dataMinuta,
                dataBloquesMinuta,
                dataPreMinuta,
                notarioSelected,
                inicializarDataMinuta,
                inicializarBloquesMinuta,
                agregarBloqueMinuta,
                generarContrato,
                handleChangeDataPreMinuta,
                handleChangeNumeroMinuta,
                handleChangeDataPreMinutaFileLocation,
                handleChangePreMinutaDate,
                selectNotario,
                subirInformacionMinuta,
                subirEvidencias,
                flushDataContrato,
                handleChangeFileLocation
            }}
        >
            {children}
        </Contratos.Provider>
    )
}