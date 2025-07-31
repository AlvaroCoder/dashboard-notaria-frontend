'use client';
import React from "react";
const Contracts = React.createContext({
    dataSelected : {},
    loading : false,
    activeStep : 0,
    typeProcess : '',
    fileLocation : {},
    pushActiveStep :()=>{},
    changeLoading :()=>{},
    handleTypeProces :()=>{},
    handleClickClient : ()=>{},
    handleClickJunior : ()=>{},
    handleChangeFileLocation : ()=>{}
});


export const useContracts = ()=>React.useContext(Contracts);

export default function ContractContext({
    children
}) {
    const [loading, setLoading] = React.useState(false);
    const [activeStep, setActiveStep] = React.useState(0);
    const [dataSelected, setDataSelected] = React.useState({
        client : '',
        junior : ''
    });
    const [typeProcess, setTypeProcess] = React.useState('');
    const [fileLocation, setFileLocation] = React.useState({})

    const handleClickClient=(client)=>{
        setDataSelected({
            ...dataSelected,
            client
        })
    };

    const handleClickJunior=(junior)=>{
        setDataSelected({
            ...dataSelected,
            junior
        })
    }

    const pushActiveStep=()=>{
        setActiveStep(activeStep+1);
    };

    const changeLoading=()=>{
        setLoading(!loading);
    }

    const handleTypeProces=(process='compra')=>{
        setTypeProcess(process);
    }
    
    const handleChangeFileLocation=(newFileLocation)=>{
        setFileLocation(newFileLocation);
    }
    return (
        <Contracts.Provider
            value={{
                loading,
                activeStep,
                dataSelected,
                typeProcess,
                fileLocation,
                pushActiveStep,
                changeLoading,
                handleTypeProces,
                handleClickClient,
                handleClickJunior,
                handleChangeFileLocation
            }}
        >
            {children}
        </Contracts.Provider>
    )
}