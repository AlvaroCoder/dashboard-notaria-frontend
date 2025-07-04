'use client'
import React, { useEffect, useRef, useState } from 'react'
export default function TitleEditorTipTap({
    data,
    onUpdate
}) {
    const [isEditing, seTisEditing] = useState(false);
    const editorRef = useRef(null);
    const [isClicked, setIsClicked] = useState(false);

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


  return (
    <div
        ref={editorRef}
        className="relative border border-white p-4 rounded-sm hover:border-[#0C1019]"
        onDoubleClick={()=>{
            setIsClicked(true);
            seTisEditing(true)
        }}
    >
        {
            isClicked ?
            <section>
                <input
                    disabled={!isEditing}
                    className={"w-full h-full outline-none shadow-none py-1 border border-gray-100 text-2xl text-center font-bold font-oxford rounded-sm"}
                    value={data?.content}
                    name="heading-one"
                    onChange={onUpdate}
                />
            </section> :
            <section>
                <h1 className='font-oxford font-bold text-center text-2xl'>{data?.content}</h1>
            </section>
        }
    </div>
  )
};

