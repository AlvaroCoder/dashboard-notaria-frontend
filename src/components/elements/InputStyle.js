import React from 'react'

export default function InputStyle({
    label="",
    Icon=null,
    value,
    name="username",
    onChange
}) {
  return (
    <div className='bg-white'>
        <label className='font-medium font-oxford text-md'>
            {label}
        </label>
        <section className='flex flex-row items-center border border-[#0C1019] rounded-sm px-3 py-2 mb-4'>
            {
                Icon && 
                <Icon className="mr-2 text-lg" />
            }
            <input
                className="w-full outline-none bg-transparent"
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                required
            />
        </section>
    </div>
  )
}