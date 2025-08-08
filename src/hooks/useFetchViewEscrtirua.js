'use client';
import { getDocumentByPath } from "@/lib/apiConnections";
import { useEffect, useState } from "react"
import { toast } from "react-toastify";

export function useFetchViewEscritura(dataContract) {
    const [loading, setLoading] = useState(false);
    const [viewPdf, setViewPdf] = useState(null);;

    useEffect(()=>{
        async function getData() {
            try {
                setLoading(true);
                const response = await getDocumentByPath(dataContract?.documentPaths?.escrituraPath);            
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setViewPdf(url);
                toast("Escritura cargada",{
                    type : 'info', 
                    position: 'bottom-right'
                });
            } catch (err) {
                console.error("Error fetching escritura data:", err);
                toast("Error al cargar la escritura",{
                    type : 'error',
                    position : 'bottom-right'
                });
            } finally{
                setLoading(false)
            }
        }
        getData()
    },[dataContract]);

    return {loading, viewPdf}
}