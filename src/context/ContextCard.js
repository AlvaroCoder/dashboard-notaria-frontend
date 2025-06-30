import {createContext, useContext, useState} from "react"
const ContextCard = createContext({
    tipoProceso : 'compra',
    isProcessStart : false,
    establecerTipoProceso : ()=>{}
});

export const useContextCard = ()=> useContext(ContextCard);

export default function ContextCardComp({
    children
}) {
    const [isProcessStart, setIsProcessStart] = useState(false);
    const [tipoProceso, setTipoProceso] = useState('');

    const establecerTipoProceso=(tipo='compra')=>{
        setTipoProceso(tipo);
        setIsProcessStart(true);
    }
    return (
        <ContextCard
            value={{
                establecerTipoProceso,
                isProcessStart,
                tipoProceso
            }}
        >
            {children}
        </ContextCard>
    )
}