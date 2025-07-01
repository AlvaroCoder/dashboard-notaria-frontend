'use client'
import {createContext, useContext, useState} from "react"
import { toast } from "react-toastify";

const Contratos = createContext({
    dataMinuta : null,
    dataBloquesMinuta : [],
    inicializarBloquesMinuta : (bloques)=>{},
    inicializarDataMinuta : (data)=>{},
    generarContrato : async ()=>{},
    agregarBloqueMinuta : (idx, data)=>{},
    
});

export const useContratoContext = ()=>useContext(Contratos);

export default function ContratoContext ({
    children
}){
    const [dataMinuta, setDataMinuta] = useState({
        contractId: "",
        sellers : {
            people : [
                {
                    firstName:"William Jesús",
                    lastName:"Macalupú",
                    dni:"43211234",
                    gender:"M",
                    nationality:"Narniano",
                    age:120,
                    job:"Programador",
                    maritalStatus:{
                        civilStatus:"Casado",
                        marriageType:{
                            type:1,
                            partidaRegistralNumber:"123KJ334",
                            province:"Piura"
                        }
                    },
                    address:{
                        name:"Jr. Gotham #332",
                        district:"Catacaos",
                        province:"Macondo",
                        department:"Narnia"
                    }
                }
            ]
        },
        buyers : {
            people : [
                {
                    firstName:"Amaranta",
                    lastName:"Pérez",
                    dni:"87654321",
                    gender:"F",
                    nationality:"Peruana",
                    age:20,
                    job:"Ingeniera",
                    address:{
                        name:"Jr. Arequipa",
                        district:"Piura",
                        province:"Piura",
                        department:"Piura"
                    },
                    maritalStatus:{
                        civilStatus:"Casada",
                        marriageType:{
                            type:2
                        },
                        spouse:{
                            firstName:"Jorge",
                            lastName:"Guerra",
                            dni:"12345678",
                            gender:"M",
                            nationality:"Peruano",
                            age:30,
                            job:"Ingeniero"
                        }
                    }
                }
            ]
        },
        creationDay : {
            date : '2025-06-30'
        },
        notario : {
            firstName:"Alvaro",
            lastName:"Pupuche",
            dni:"12345678",
            ruc:"078791045"
        },
        minuta : {
            minutaNumber : 123,
            creationDay : {
                date : "2025-06-30"
            },
            minutaContent : {
                data : []
            },
            place : {
                name : 'Notaria de Piura',
                district : 'Piura'
            }
        },
        header : {
            numeroDocumentoNotarial:123,
            numeroRegistroEscritura:456,
            year:2025,
            folio:12,
            tomo:"XXIV",
            kardex:"I1234O"
        },
        paymentMethod : {
            caption : ' CHEQUES DE GERENCIA EMITIDOS POR EL BANCO BBVA PERU',
            evidences : [
                "BD_evidences/b89bb648-18dc-4d04-95aa-dfda5af0df04/anthony-maw-XcjVef6uvYA-unsplash.jpg"
            ]
        },
        fojaData : {
            start : {
                number : "1123",
                serie : "C"
            },
            end : {
                number : "1125V",
                serie : "C"
            }
        }
    });

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

    const agregarBloqueMinuta=(idx, data)=>{

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