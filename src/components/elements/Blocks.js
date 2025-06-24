'use client'
import React, { useEffect, useRef, useState } from 'react'
import {motion} from "framer-motion"
import Title1 from './Title1';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import ParagraphEditorTiptap from './ParagraphEditorTipTap';

function TopBarTool({
    onClick
}) {
    const titlesOptions =[
        {title : "Titulo 1", className : "text-4xl", isSelected : true},
        {title : "Titulo 2", className : "text-3xl", isSelected : false},
        {title : "Titulo 3", className : "text-2xl", isSelected : false},
    ]
    const [titleOpt, setTitleOpt] = useState(titlesOptions);
    const handleChangeTitle=(idx)=>{
        const newOptionTitle=titleOpt?.map((item, index)=>{
            if (index === idx) {
                return {
                    ...item,
                    isSelected : true
                }
            }
            return {
                ...item,
                isSelected : false
            }
        });
        setTitleOpt(newOptionTitle);
        onClick('className', newOptionTitle?.filter(item=>item.isSelected)[0]?.className)
    }
    return(
        <section className="z-50 absolute -top-14 left-0 w-max p-2 flex items-center gap-2 bg-white shadow-md border rounded-md"> 
            <div className='flex flex-row   items-center justify-center gap-2'>
                <Button
                    variant={"outline"}
                    onClick={()=>onClick('style','font-bold')}
                >
                    <b>B</b>
                </Button>
                <Button
                    variant={"outline"}
                    onClick={()=>onClick('style','italic')}
                >
                    <i>I</i>
                </Button>
                <Button
                    variant={"outline"}
                    onClick={()=>onClick('style', 'font-normal')}
                >
                   <span>T</span> 
                </Button>
            </div>
        </section>
    )
}


function TitleOneEditor({ data, onUpdate }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [optionsText, setOptionsText] = useState({
      className: "text-4xl",
      style: "font-bold",
    });
  
    const editorRef = useRef(null);
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (editorRef.current && !editorRef.current.contains(event.target)) {
          setIsClicked(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
  
    return (
      <div
        ref={editorRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsClicked(true)}
        className={cn(
          "relative border-transparent transition-all",
          isHovered && "border border-[#0C1019] rounded-md"
        )}
      >
        {isClicked && (
          <TopBarTool
            onClick={(label, value) =>
              setOptionsText({ ...optionsText, [label]: value })
            }
          />
        )}
        {isClicked ? (
          <input
            className={cn(
              "border-none p-2 outline-none w-full font-oxford bg-white rounded-sm",
              optionsText.className,
              optionsText.style
            )}
            value={data}
            onChange={(e) => onUpdate(e.target.value)}
            autoFocus
          />
        ) : (
          <Title1
            className={cn(
              "cursor-text font-oxford p-2",
              optionsText.className,
              optionsText.style
            )}
          >
            {data}
          </Title1>
        )}
      </div>
    );
}


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
                return <TitleOneEditor 
                        data={block?.content} 
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
