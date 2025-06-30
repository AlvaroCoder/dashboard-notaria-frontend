import React, { useState } from 'react'
import Blocks from '../elements/Blocks';
import { Button } from '../ui/button';
import NotesIcon from '@mui/icons-material/Notes';
import TitleIcon from '@mui/icons-material/Title';
import { cn } from '@/lib/utils';

function BlockEditorRenderer({
    block, idx, handleChange, handleaddBlock
}) {
    const [hoverLine, setHoverLine] = useState(false);

    const renderHoverLine=(isHovered=false)=>{
        if (isHovered) {
            return(
                <div className='absolute -bottom-4 w-full flex flex-row items-center justify-center gap-2'>
                    <Button
                        variant={"outline"}
                        onClick={()=>handleaddBlock(idx, 'paragraph')}
                    >
                        <NotesIcon/> <span>Agregar Parrafo</span>
                    </Button>
                    <Button
                        variant={"outline"}
                        onClick={()=>handleaddBlock(idx, 'heading-one')}
                    >
                        <TitleIcon/> <span>Agregar Titulo</span>
                    </Button>
                    <Button
                        variant={"outline"}
                        onClick={()=>handleaddBlock(idx, 'heading-two')}
                    >
                        <span>Agregar Subtitulo</span>
                    </Button>
                </div>
            )
        }
        return null
    }
    return(
        <div>
            <Blocks
                blockData={block}
                onUpdateBlock={(data)=>handleChange(idx, data, block?.type)}
            />
            <div
                onMouseEnter={()=>setHoverLine(true)}
                onMouseLeave={()=>setHoverLine(false)}
                className='flex justify-center items-center'
            >   
                <section
                    className={cn('relative w-full my-0 border-b border-b-white', hoverLine && 'border-b-[#0C1019]')}
                >
                    {renderHoverLine(hoverLine)}
                </section>
            </div>
        </div>
    )
}

export default function EditorView({
    data=[]
}) {
    const [dataEditor, setDataEditor] = useState(data);

    const handleChange=(idx, newContent, type)=>{
      const newData = [...dataEditor];
      if (type === "heading-one") {
    
    newData[idx].content = newContent;
    newData[idx].html = "<h1>"+newContent+"</h1>";

      }
      if (type === "paragraph") {
    newData[idx] = newContent;
      }
      setDataEditor(newData);
    }

    const handleAdd=(idx, type)=>{
        const newData = [...dataEditor].slice(0,idx+1) 
        const restante = [...dataEditor].slice(idx+1);
        if (type === "heading-one") {
            newData.push({
                type,
                content : "Titulo",
                html : "<h1 style='center'>Titulo</h1>"
            })
        }
        if (type === "paragraph") {
            newData.push({
                type,
                content : [
                    {type : 'text', content : 'Texto',  html : '<p>Texto</p>'}
                ]
            })
        }
        if (type === "heading-two") {
            newData.push({
                type,
                content : "Subtitulo",
                html : "<h1>Subtitulo</h1>"
            })
        }
        setDataEditor([...newData, ...restante])
        
    }
  return (
    <div className=' w-full min-h-screen grid grid-cols-1 bg-gray-100 pb-24'>
        <div className='col-span-4 w-full p-10'>
            <section className='bg-white p-4 flex flex-col gap-0'>
                {
                    dataEditor?.map((block, idx)=> <BlockEditorRenderer 
                    idx={idx} 
                    block={block} 
                    handleChange={handleChange} 
                    handleaddBlock={handleAdd} />)
                }
            </section>
           
        </div>
    </div>
  )
};