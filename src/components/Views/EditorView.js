import React, { useRef, useState } from 'react'
import Blocks from '../elements/Blocks';
import { Button } from '../ui/button';
import NotesIcon from '@mui/icons-material/Notes';
import TitleIcon from '@mui/icons-material/Title';
import { cn } from '@/lib/utils';
import { useEditorContext } from '@/context/ConextEditor';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import DeleteIcon from '@mui/icons-material/Delete';

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
            <Blocks
                index={idx}
                blockData={block}
                onUpdateBlock={(data)=>handleChange(idx, data, block?.type)}
            />

        </div>
    )
}

function BlockToolsOneclick({
  handleUpBlock,
  handleDownBlock,
  handleDeleteBlock
}) {
    return(
      <div 
        className='z-50 absolute -top-7 left-0 w-max p-2 flex items-center gap-2 bg-white shadow-md border rounded-md grid-cols-3'
      >
        <section 
          className='px-4 border-r border-r-[#0C1019]'
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                Titulo
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuCheckboxItem>
                <Button>
                  Subtitulo
                </Button>
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>
                <Button>
                  Parrafo
                </Button>
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </section>
        <section className='flex flex-row gap-2'>
          <Button
            variant={"outline"}
            onClick={handleUpBlock}
          > 
            <NorthIcon/>
          </Button>
          <Button
            variant={"outline"} 
            onClick={handleDownBlock}
          >
            <SouthIcon/>
          </Button>
          <Button
            variant={"outline"}
            onClick={handleDeleteBlock}
          >
            <DeleteIcon/>
          </Button>
        </section>
      </div>
    )
}

export default function EditorView({
    data=[]
}) {
    const [dataEditor, setDataEditor] = useState(data);
    const {
      dataBloques, 
      insertarBloque, 
      subirBloque, 
      bajarBloque, 
      eliminarBloque
    } = useEditorContext();
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

    const handleAdd = (idx, type) => {
        let newBlock = null;
      
        switch (type) {
          case "heading-one":
            newBlock = {
              type,
              content: "Título",
              html: "<h1 style='text-align:center;'>Título</h1>",
            };
            break;
      
          case "heading-two":
            newBlock = {
              type,
              content: "Subtítulo",
              html: "<h1 style='text-align:left;'>Subtítulo</h1>",
            };
            break;
      
          case "paragraph":
            newBlock = {
              type,
              content: [
                {
                  type: "text",
                  content: "Texto",
                  html: "<p>Texto</p>",
                },
              ],
            };
            break;
      
          default:
            console.warn("Tipo no reconocido:", type);
            return;
        }
      
        insertarBloque(idx, newBlock);
    };
  return (
    <div className=' w-full min-h-screen grid grid-cols-1 bg-gray-100 pb-24'>
        <div className='col-span-4 w-full p-10'>
            <section className='bg-white p-4 flex flex-col gap-0'>
                {
                    dataBloques?.map((block, idx)=> (
                      <div 
                        key={idx}
                        className='relative'>
                          <BlockToolsOneclick
                            handleUpBlock={(e)=>{
                              e.preventDefault();
                              subirBloque(idx);
                            }}
                            handleDownBlock={(e)=>{
                              e.preventDefault();
                              bajarBloque(idx);
                            }}
                            handleDeleteBlock={(e)=>{
                              e.preventDefault();
                              eliminarBloque(idx);
                            }}
                          />
                          <BlockEditorRenderer
                            block={block}
                            idx={idx}
                            handleChange={handleChange}
                            handleaddBlock={handleAdd}
                          />

                        </div>
                      ))
                }
            </section>
           
        </div>
    </div>
  )
};