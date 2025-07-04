'use client'
import React, { useState } from 'react'
import { motion} from "framer-motion"
import ParagraphEditorTiptap from './ParagraphEditorTipTap';
import TitleEditorTipTap from './TitleEditorTipTap';
import Title2Editor from './Title2Editor';

export default function Blocks({
    blockData={},
    onUpdateBlock
}) {
    const [hovered, setHovered] = useState(false);
    const typeLabel = {
        "heading-one": "Título principal (h1)",
        "heading-two" : "Titulo secundario (h2)",
        "paragraph": "Párrafo",
        "bullet-list": "Lista con viñetas",
        "numbered-list": "Lista numerada",
        "table": "Tabla"
      }[blockData.type] || "Otro";

    const handlerBlock=(block, onUpdate)=>{
        switch(block?.type){
            case "heading-one":
                return (
                <section>
                    <TitleEditorTipTap
                        data={block}
                        onUpdate={onUpdate}
                    />
                </section>
                )
            case "paragraph":
                return( 
                <section>
                    <ParagraphEditorTiptap 
                        data={block} 
                        onUpdate={onUpdate} 
                    />
                </section>
                )
            case "heading-two":
                return(
                    <section>
                        <Title2Editor
                            data={block}
                            onUpdate={onUpdate}
                        />
                    </section>
                )
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
                    <div className="z-30 absolute top-2 right-2 text-xs bg-black text-white rounded px-2 py-1">
                        {typeLabel}
                    </div>
                )
            }
            {handlerBlock(blockData, onUpdateBlock)}
        </motion.div>
    )
}
