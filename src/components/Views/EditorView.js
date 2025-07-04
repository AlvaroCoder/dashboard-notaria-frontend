import React, { useEffect, useRef, useState } from 'react'
import Blocks from '../elements/Blocks';
import { Button } from '../ui/button';
import NotesIcon from '@mui/icons-material/Notes';
import TitleIcon from '@mui/icons-material/Title';
import { cn, generarIdRandom } from '@/lib/utils';
import { useEditorContext } from '@/context/ConextEditor';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import DeleteIcon from '@mui/icons-material/Delete';

function BlockEditorRenderer({
    block, 
    idx, 
    handleChange, 
    handleaddBlock,
    handleSubirBloque,
    handleBajarBloque,
    handleEliminarBloque
}) {
    const [hoverLine, setHoverLine] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    
    const editorRef = useRef(null);
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
    useEffect(()=>{
      const handleClickOutside =(evt)=>{
        if (editorRef.current && !editorRef.current.contains(evt.target)) {
          setIsClicked(false);
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return ()=>{
        document.removeEventListener('mousedown', handleClickOutside);
      }
    },[]);
    return(
        <div
          ref={editorRef}
          onClick={()=>{
            setIsClicked(true);
          }}
          onDoubleClick={()=>{
            setIsClicked(false)
          }}
          className='relative'
        >
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
            {
              isClicked && 
              <BlockToolsOneclick
                handleUpBlock={()=>handleSubirBloque()}
                handleDownBlock={()=>handleBajarBloque()}
                handleDeleteBlock={()=>handleEliminarBloque()}
              />
            }
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

export default function EditorView() {
    const {
      dataBloques, 
      blockEditing,
      insertarBloque, 
      subirBloque, 
      bajarBloque, 
      eliminarBloque,
      handleChangeBloque
    } = useEditorContext();

    const handleAdd = (idx, type) => {
        let newBlock = null;
      
        switch (type) {
          case "heading-one":
            newBlock = {
              id: generarIdRandom(),
              type,
              content: "Título",
              html: "<h1 style='text-align:center;'>Título</h1>",
            };
            break;
      
          case "heading-two":
            newBlock = {
              id: generarIdRandom(),
              type,
              content: "Subtítulo",
              html: "<h1 style='text-align:left;'>Subtítulo</h1>",
            };
            break;
      
          case "paragraph":
            newBlock = {
              id: generarIdRandom(),
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
    <div className='relative w-full min-h-screen grid grid-cols-1 bg-gray-100 pb-24'>
      {
        blockEditing && 
        <section className='fixed w-full h-12 shadow-sm bg-gray-300 z-50 flex flex-row items-center gap-2 justify-center'>
          <div className='flex flex-row items-center justify-center gap-2'>
            <Button
              variant={"outline"}
            >
              <b>B</b>
            </Button>
            <Button
              variant={"outline"}
            >
              <i>I</i>
            </Button>
            <Button
              variant={"outline"}
            >
              <p>T</p>
            </Button>
          </div>
        </section>
      }
        <section className=''>
          <p className='text-white'>{ blockEditing && blockEditing?.id}</p>
        </section>
        <div className='col-span-4 w-full p-10'>
            <section className='bg-white p-4 flex flex-col gap-0'>
                {
                    dataBloques?.map((block, idx)=> (
                        <BlockEditorRenderer
                          key={block?.id}
                          block={block}
                          idx={idx}
                          handleChange={(idx, newContent, type)=>handleChangeBloque(idx, newContent, type)}
                          handleaddBlock={handleAdd}
                          handleSubirBloque={()=>subirBloque(idx)}
                          handleBajarBloque={()=>bajarBloque(idx)}
                          handleEliminarBloque={()=>eliminarBloque(idx)}
                        />
                    ))
                }
            </section>
        </div>
    </div>
  )
};