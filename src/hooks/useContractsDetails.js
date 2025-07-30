'use client'
import { useContextCard } from "@/context/ContextCard"
import { useContratoContext } from "@/context/ContratosContext"
import { getDataClientByClientId } from "@/lib/apiConnections"
import { useEffect, useState } from "react"

export function useContractDetails(dataResponseContract) {
    const { flushDataCard, establecerTipoProceso } = useContextCard()
    const { inicializarDataMinuta, flushDataContrato, handleChangeFileLocation } = useContratoContext()
    const [client, setClient] = useState(null)
    const [loadingDataClient, setLoadingDataClient] = useState(true)
  
    useEffect(() => {
      async function fetchClient() {
        if (!dataResponseContract) return
        try {
          flushDataCard()
          flushDataContrato()
          const response = await getDataClientByClientId(dataResponseContract.data?.clientId)
          const json = await response.json()
          establecerTipoProceso(dataResponseContract.data?.case)
          setClient(json?.data)
          inicializarDataMinuta(dataResponseContract.data?.id)
          const [ , directory, fileName ] = dataResponseContract.data?.minutaDirectory?.split('/') || []
          handleChangeFileLocation({ fileName, directory })
        } finally {
          setLoadingDataClient(false)
        }
      }
      fetchClient()
    }, [dataResponseContract])
  
    return { client, loadingDataClient }
  }