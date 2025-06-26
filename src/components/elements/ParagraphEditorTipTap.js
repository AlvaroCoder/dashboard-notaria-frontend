'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import { Button } from '../ui/button'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import DeleteIcon from '@mui/icons-material/Delete';

// 🔁 Convertimos el JSON personalizado a HTML para TipTap
function convertJSONToHTML(json) {
  return json.content.map((node) => {
    if (node.type === 'bold') return `<strong>${node.content}</strong>`
    if (node.type === 'italic') return `<em>${node.content}</em>`
    return node.content
  }).join('')
}

// 🔁 Convertimos el contenido de TipTap al JSON personalizado
function convertEditorToCustomJSON(editor) {
  const nodes = editor?.getJSON()?.content?.[0]?.content || []

  return {
    type: 'paragraph',
    content: nodes.map((node) => {
      const isBold = node?.marks?.some((m) => m.type === 'bold')
      const isItalic = node?.marks?.some((m) => m.type === 'italic')

      if (isBold) return { type: 'bold', content: node.text }
      if (isItalic) return { type: 'italic', content: node.text }
      return { type: 'text', content: node.text }
    })
  }
}

export default function ParagraphEditor({ data, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false)
    const editorRef = useRef(null);
    const [isClicked, setIsClicked] = useState(false);
    
    const editor = useEditor({
        extensions: [
        StarterKit.configure({
            paragraph: {
            HTMLAttributes: {
                class: 'text-base'
            }
            }
        }),
        Bold,
        Italic,
        ],
        content: `<p>${convertJSONToHTML(data)}</p>`,
        editable: isEditing,
        onUpdate: ({ editor }) => {
        const updated = convertEditorToCustomJSON(editor)
        onUpdate(updated)
        }
    })

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (editorRef.current && !editorRef.current.contains(event.target)) {
            
            setIsClicked(false);
            setIsEditing(false);
          }
        }
      
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
          document.removeEventListener('mousedown', handleClickOutside)
        }
      }, [])

  useEffect(() => {
    if (editor) editor.setEditable(isEditing)
  }, [isEditing, editor])

  return (
    <div
        ref={editorRef}

        className="relative border border-white  p-4 rounded-sm hover:border-[#0C1019]"
        onClick={() => {
            setIsEditing(true);
            setIsClicked(true);
        }}
    >
      {
        isClicked ? 
        <section>
            <div className="z-50 absolute -top-14 left-0 w-max p-2 flex items-center gap-2 bg-white shadow-md border rounded-md grid-cols-3">
              <section className='px-4 border-r border-r-[#0C1019]'>
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
              <section className='flex flex-row   items-center justify-center gap-2 px-2 border-r border-r-[#0C1019] '>
                  <Button
                  variant={"outline"}
                  onClick={(e) => {
                  e.stopPropagation()
                  editor?.chain().focus().toggleBold().run()
                  }}
                  >
                      <b>B</b>
                  </Button>
                  <Button
                      variant={"outline"}
                      onClick={(e) => {
                      e.stopPropagation()
                      editor?.chain().focus().toggleItalic().run();
                      }}
                      >
                      <i>I</i>
                  </Button>
                  <Button
                    variant={"outline"}
                    onClick={(e)=>{
                      // Boton para convertir el texto a parrafo simple
                      e.stopPropagation();
                      editor?.chain().focus().unsetBold().unsetItalic().run();
                    }}
                  >
                    <p>T</p>
                  </Button>
              </section>
              <section className='flex flex-row gap-2'>
                  <Button 
                    variant={"outline"}>
                      <NorthIcon/>
                  </Button>
                  <Button 
                  variant={"outline"}>
                      <SouthIcon/>
                  </Button>
                  <Button
                    variant={"outline"}
                  >
                    <DeleteIcon/>
                  </Button>
              </section>
        </div>
            <EditorContent className='outline-none border-none' editor={editor} />
        </section> :
        <p>
            {
                data?.content?.map((item, idx)=>{
                    if (item?.type === "bold") {
                        return <strong key={idx}>{item?.content}</strong>
                    }
                    if (item?.type === "italic") {
                        return <i key={idx}>{item?.content}</i>
                    }
                    return <span key={idx}>{item?.content}</span>
                })
            }
        </p>
      }
    </div>
  )
}