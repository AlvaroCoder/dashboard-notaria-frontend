import React, { useState } from 'react'
import Blocks from '../elements/Blocks';
import Title1 from '../elements/Title1';
import { Button } from '../ui/button';
import NotesIcon from '@mui/icons-material/Notes';
import TitleIcon from '@mui/icons-material/Title';
import { cn } from '@/lib/utils';

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
  return (
    <div className=' w-full min-h-screen grid grid-cols-5 bg-gray-100'>
        <div className='col-span-4 w-full p-10'>
            <section className='bg-white p-4 flex flex-col gap-0'>
                {
                    dataEditor?.map((block, idx)=>{
                        const [hoverLine, setHoverLine] = useState(false);
                        return(
                            <>
                            <Blocks 
                            key={idx} 
                            blockData={block} 
                            onUpdateBlock={(data)=>handleChange(idx, data, block?.type)}
                            />
                            <div 
                            onMouseEnter={()=>setHoverLine(true)}
                            onMouseLeave={()=>setHoverLine(false)}
                            className='h-4 flex justify-center items-center'>
                             <section className={cn('relative w-full my-0 border-b border-b-white ', hoverLine && 'border-b-[#0C1019]')}>
                                {
                                    hoverLine && (
                                    <div className='absolute -bottom-4 w-full flex flex-row items-center justify-center gap-2'>
                                        <Button
                                            variant={"outline"}
                                        >
                                            Agregar Parrafo
                                        </Button>
                                        <Button
                                            variant={"outline"}
                                        >
                                            Agregar Titulo
                                        </Button>
                                    </div>
                                    )
                                }
                             </section>
                            </div>
                        </>
                        )
                    })
                }
            </section>
           
        </div>
        <div className="col-span-1 border-l pl-4 space-y-4 bg-white">
        <div className="mb-2 border-b border-b-gray-200">
            <Title1>Bloques</Title1>
        </div>
        <section className="grid grid-cols-2 gap-2">
            <Button onClick={()=>console.log(data)} variant="outline" className="w-full flex flex-col h-[100px] items-center gap-2">
            <TitleIcon className="w-4 h-4" /> <span>Título</span>
            </Button>
            <Button variant="outline" className="w-full flex flex-col items-center gap-2 h-[100px]">
            <NotesIcon className="w-4 h-4" /> <span>Párrafo</span>
            </Button>
        </section>
      </div>
    </div>
  )
};