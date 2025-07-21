"use client"

import { getSession } from "@/authentication/lib";
import { useEffect, useState } from "react";

export function useFetch(URL="") {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    useEffect(()=>{
        async function fetchData() {
            try {
                const session = await getSession();
                const response = session ? await fetch(URL, {
                    headers : {
                        'Content-Type' : 'application/json',
                    },
                    method : 'GET',
                    mode : 'cors'
                }) :  await fetch(URL);
                
                if (!response.ok) {
                    const jsonResponse = await response.json();
                    setError(jsonResponse?.detail);
                    return;
                }

                const jsonResponse = await response.json();          
                      
                setData(jsonResponse);

            } catch (err) {
                setError(err);
                console.log(err);
                
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    },[URL]);
    return {loading, error, data};
}