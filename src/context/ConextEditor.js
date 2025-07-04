'use client';

import { generarIdRandom } from "@/lib/utils";
import {createContext, useContext, useState} from "react";

const EditorMinuta = createContext({
    blockEditing : null,
    dataBloques : [],
    agregarBloques : ()=>{},
    insertarBloque : ()=>{},
    eliminarBloque : ()=>{},
    subirBloque : ()=>{},
    bajarBloque : ()=>{},
    mostrarBloqueId : ()=>{},
    handleChangeBloque : ()=>{},
    handleEditingBlock : ()=>{},
    removeEditingBlock : ()=>{}
});

export const useEditorContext =()=>useContext(EditorMinuta);

export default function EditorContext({
    children
}) {

    const [dataBloques, setDataBloques] = useState([]);
    const [blockEditing, setBlockEditing] = useState(null);
    const agregarBloques=(data=[])=>{
        const nuevaLista = data?.map((item)=>({id : generarIdRandom(), ...item}));
        
        setDataBloques(nuevaLista);
    }
    const handleEditingBlock=(idBlock)=>{
        const blockSelected = dataBloques?.filter(({id})=> idBlock === id)[0];
        setBlockEditing(blockSelected)
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
    const handleChangeBloque=(idx, newContent, type)=>{
        let nuevoJson = {}
        if (type === "heading-one") {
            nuevoJson['type'] = type
            nuevoJson['content'] = newContent?.target?.value;
            nuevoJson['html'] = "<h1 style='text-align:center;'>"+newContent?.target?.value+"</h1>";
        }
        if (type === 'paragraph') {
            nuevoJson = newContent
        }
        const nuevaLista = [...dataBloques].map((block, index)=>
            index === idx ? nuevoJson : block
        );
        setDataBloques(nuevaLista);
    }
    const removeEditingBlock=()=>{
        setBlockEditing(null);
    }
    return(
        <EditorMinuta.Provider
            value={{
                dataBloques,
                blockEditing,
                agregarBloques,
                insertarBloque,
                subirBloque,
                bajarBloque,
                eliminarBloque,
                mostrarBloqueId,
                handleChangeBloque,
                handleEditingBlock,
                removeEditingBlock
            }}
        >
            {children}
        </EditorMinuta.Provider>
    )
}