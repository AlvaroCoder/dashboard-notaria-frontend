'use client'
import React, { useEffect, useRef, useState } from 'react'
import { motion} from "framer-motion"
import ParagraphEditorTiptap from './ParagraphEditorTipTap';
import TitleEditorTipTap from './TitleEditorTipTap';


export default function Blocks({
    blockData={},
    onUpdateBlock
}) {
    const [hovered, setHovered] = useState(false);

    const typeLabel = {
        "heading-one": "Título principal (h1)",
        "paragraph": "Párrafo",
        "bullet-list": "Lista con viñetas",
        "numbered-list": "Lista numerada",
        "table": "Tabla"
      }[blockData.type] || "Otro";

    const handlerBlock=(block, onUpdate)=>{
        switch(block?.type){
            case "heading-one":
                return <TitleEditorTipTap
                  data={block}
                  onUpdate={onUpdate}
                />
            case "paragraph":
                return <ParagraphEditorTiptap 
                data={block} 
                onUpdate={onUpdate} />
            default :
          return <pre className='w-[20px]'></pre>
          }
    }

    return(
        <motion.div
            className="relative group p-4 rounded-lg "
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {
                hovered && (
                    <div className="z-50 absolute top-2 right-2 text-xs bg-black text-white rounded px-2 py-1">
                        {typeLabel}
                    </div>
                )
            }
            {handlerBlock(blockData, onUpdateBlock)}
        </motion.div>
    )
}
