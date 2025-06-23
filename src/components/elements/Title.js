import React, { useState } from 'react'

export default function Title({
    text, 
    handleChange
}) {
    const [queryTitle, setQueryTitle] = useState(text);
    
  return (
    <h1 className='font-oxford font-bold text-lg text-[#0C1019]'>
        {queryTitle}
    </h1>
  )
}
