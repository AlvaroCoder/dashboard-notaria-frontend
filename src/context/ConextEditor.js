'use client';

import {createContext, useContext, useState} from "react";

const EditorMinuta = createContext({
    dataBloques : [],
    agregarBloques : ()=>{},
    insertarBloque : ()=>{},
    eliminarBloque : ()=>{},
    subirBloque : ()=>{},
    bajarBloque : ()=>{},
    mostrarBloqueId : ()=>{}
});

export const useEditorContext =()=>useContext(EditorMinuta);

export default function EditorContext({
    children
}) {

    const [dataBloques, setDataBloques] = useState([]);

    const agregarBloques=(data=[])=>{
        setDataBloques(data);
    }
    const insertarBloque=(index, jsonData={})=>{
        const nuevaLista = [
            ...dataBloques.slice(0, index),
            jsonData,
            ...dataBloques.slice(index)
        ];
        setDataBloques(nuevaLista);
    }
    const eliminarBloque=(index)=>{
        if (index < 0 || index >= dataBloques.length) return;
        const nuevaLista = [...dataBloques].filter((_, idx)=>index !== idx);
        setDataBloques(nuevaLista);
    }
    const subirBloque=(index)=>{
        if (index > 0) {
            const nuevaLista = [...dataBloques];
            [nuevaLista[index - 1], nuevaLista[index]] = [nuevaLista[index], nuevaLista[index - 1]];
            setDataBloques(nuevaLista);
        }
    }
    const bajarBloque=(index)=>{
        if (index !== -1 && index < dataBloques.length - 1) {
            const nuevaLista = [...dataBloques];
            [nuevaLista[index + 1], nuevaLista[index]] = [nuevaLista[index], nuevaLista[index + 1]];
            setDataBloques(nuevaLista);
        }
    }
    const mostrarBloqueId=(index)=>{
        return dataBloques.filter((_,idx)=>idx === index)[0]
    }
    return(
        <EditorMinuta.Provider
            value={{
                dataBloques,
                agregarBloques,
                insertarBloque,
                subirBloque,
                bajarBloque,
                eliminarBloque,
                mostrarBloqueId
            }}
        >
            {children}
        </EditorMinuta.Provider>
    )
}