'use client';
import {createContext, useContext, useState} from "react"
const ContextCard = createContext({
    tipoProceso : 'compra',
    client : null,
    isProcessStart : false,
    activeStep : 0,
    establecerTipoProceso : ()=>{},
    handleFileLocation : ()=>{},
    continuarCompletarFormulario : ()=>{},
    pushActiveStep : ()=>{},
    initializeClient : ()=>{},
    flushDataCard : ()=>{}
});

export const useContextCard = ()=> useContext(ContextCard);

export default function ContextCardComp({
    children
}) {
    const [isProcessStart, setIsProcessStart] = useState(false);
    const [activeStep, setActiveStep] = useState(0);

    const [tipoProceso, setTipoProceso] = useState('');
    const [client, setClient] = useState(null);
    const [fileLocation, setFileLocation] = useState(null);

    const pushActiveStep=()=>{
        setActiveStep(activeStep+1);
    }
    const flushDataCard =()=>{
        setActiveStep(0);
        setTipoProceso('');
        setClient(null);
        setFileLocation(null);
    }
    const initializeClient=(newClient)=>{
        setClient(newClient);
    }

    const establecerTipoProceso=(tipo='compra')=>{
        setTipoProceso(tipo);
    }
    const handleFileLocation=(directory)=>{
        setFileLocation(directory);
    }

    const continuarCompletarFormulario=()=>{
        setActiveStep(3);
    }
    return (
        <ContextCard
            value={{
                establecerTipoProceso,
                handleFileLocation,
                continuarCompletarFormulario,
                pushActiveStep,
                initializeClient,
                flushDataCard,
                isProcessStart,
                activeStep,
                tipoProceso,
                client
            }}
        >
            {children}
        </ContextCard>
    )
}