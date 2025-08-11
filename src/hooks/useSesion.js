'use client';
import { getSession } from "@/authentication/lib";
import { useEffect, useState } from "react";

export const useSession =()=>{
    const [dataSession, setDataSession] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        async function fetchDataSession() {
            try {
                setLoading(false);
                const session = await getSession();
                setDataSession(session?.user);

            } catch (err) {
                
            } finally{
                setLoading(false);
            }

        }   
        fetchDataSession();
    },[]);

    return {dataSession, loading}
}