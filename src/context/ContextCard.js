import {createContext, useContext, useState} from "react"
const ContextCard = createContext({
    tipoProceso : 'compra',
    client : null,
    isProcessStart : false,
    activeStep : 0,
    establecerTipoProceso : ()=>{},
    initializeClient : ()=>{},
    handleFileLocation : ()=>{},
    continuarCompletarFormulario : ()=>{},
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


    const initializeClient=(newClient)=>{
        setClient(newClient);
        setActiveStep(1);
    }

    const establecerTipoProceso=(tipo='compra')=>{
        setTipoProceso(tipo);
        setActiveStep(2);
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
                initializeClient,
                handleFileLocation,
                continuarCompletarFormulario,
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