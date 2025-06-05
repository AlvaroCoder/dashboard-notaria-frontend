import React from 'react'

export default function ErrorViewComp({
    description=""
}) {
  return (
    <div className='w-full rounded-lg bg-red-100 border border-guinda text-sm text-slate-800 text-center py-4'>
        <h1>Error : {description} </h1>
    </div>
  )
};
