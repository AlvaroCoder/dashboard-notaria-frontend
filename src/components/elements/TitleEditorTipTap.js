'use client'
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect, useRef, useState } from 'react'


export default function TitleEditorTipTap({
    data,
    onUpdate
}) {
    
    const [isEditing, seTisEditing] = useState(false);
    const editorRef = useRef(null);
    const [isClicked, setIsClicked] = useState(false);

    const editor = useEditor({
        extensions : [
            StarterKit.configure({
                heading : {
                    HTMLAttributes : {
                        class : 'font-bold text-center text-2xl'
                    }
                }
            }),
        
        ],
        content : `<h1>${data?.content}</h1>`,
        editable : isEditing,
        onUpdate: ({editor})=>{
            const updated = editor?.getText();
            onUpdate(updated);
        }
    })

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (editorRef.current && !editorRef.current.contains(event.target)) {
            
            setIsClicked(false);
            seTisEditing(false);
          }
        }
      
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
          document.removeEventListener('mousedown', handleClickOutside)
        }
      }, []);

  useEffect(() => {
    if (editor) editor.setEditable(isEditing)
  }, [isEditing, editor]);

  return (
    <div
        ref={editorRef}
        className="relative border border-white p-4 rounded-sm hover:border-[#0C1019]"
        onClick={()=>{
            setIsClicked(true);
            seTisEditing(true);  
        }}
    >
        {
            isClicked ?
            <section>
                <EditorContent editor={editor} className='outline-none border-none' />
            </section> :
            <section>
                <h1 className='font-oxford font-bold text-center text-2xl'>{data?.content}</h1>
            </section>
        }
    </div>
  )
};

