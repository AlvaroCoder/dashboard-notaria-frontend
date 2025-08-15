import React, { useState } from 'react'

export default function SignConstitucion({
    data : initialData,
    onGnerateParteNotarial=()=>{}
}) {
    const [data, setData] = useState(initialData);

    const handleChange=(index, isSpouse, newDate)=>{
        setData((prev)=>{
        const updated = {...prev};
        
        })
    }
  return (
    <div>SignConstitucion</div>
  )
}
