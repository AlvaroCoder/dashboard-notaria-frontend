import React, { useEffect, useRef, useState } from 'react'

export default function Title2Editor({
    data,
    onUpdate
}) {
    const [isEditing, setIsEditing] = useState(false);
    const editorRef = useRef(null);
    const [isClicked, setIsClicked] = useState(false);
    useEffect(()=>{
        const handleClickOutside=(evt)=>{
            if (editorRef.current && !editorRef.current.contains(evt.target)) {
                setIsClicked(false);
                setIsEditing(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return ()=>{
            document.removeEventListener('mousedown', handleClickOutside);
        }
    },[]);
  return (
    <div
        ref={editorRef}
        className="relative border border-white p-4 rounded-sm hover:border-[#0C1019]"
        onDoubleClick={()=>{
            setIsClicked(true)
            setIsEditing(true)
        }}
    >
        {
            isClicked ?
            <section>
                <input
                    disabled={!isEditing}
                    className={"w-full h-full outline-none shadow-none py-1 border border-gray-100 text-lg text-center font-bold font-oxford rounded-sm"}
                    value={data?.content}
                    name='heading-two'
                    onChange={onUpdate}
                />
            </section> :
            <section>
                <h2 className='text-2xl font-bold font-oxford'>{data?.content}</h2>
            </section>
        }
    </div>
  )
};
