import { useEffect, useState } from "react";

export const useDataContracts=(type="SAC")=>{
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(()=>{
        async function fetchData() {
            try {
                const response = await fetch(`http://localhost:8000/home/contracts/${type}`,{
                    mode : 'cors',
                    redirect : 'follow',
                    method :'GET'
                });

                if (!response.ok) {
                    const jsonResponse = await response.json();
                    setError(jsonResponse?.detail);
                    return;

                }
                const jsonResponse = await response.json();
                setData(jsonResponse?.data)
            } catch (err) {

                setError(err);
            } finally{
                setLoading(false);
            }
        }
        fetchData();
    },[]);

    return {loading, data, error}
}