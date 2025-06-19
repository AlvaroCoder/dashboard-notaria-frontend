import React, { useState } from 'react'
import LockIcon from '@mui/icons-material/Lock';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function InputPassword({
    value='',
    onChange
}) {
    const [showPassword, setShowPassword] = useState(false);

    const handleChangeShowPassword=()=>{
        setShowPassword(!showPassword);
    }
  return (
    <div className='bg-white'>
        <label className='font-oxford font-medium text-md'>
            Contraseña 
        </label>
        <div className="flex flex-row items-center border border-black rounded-sm px-3 py-2 mb-6">
            <LockIcon className='mr-2 text-lg'/>
            <input
                className='w-full outline-none bg-transparent'
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={value || ''} 
                onChange={onChange}
                required
            />
            {
                showPassword ? <p onClick={handleChangeShowPassword}><VisibilityOffIcon/></p>: <p onClick={handleChangeShowPassword}><RemoveRedEyeIcon/></p>
             }
        </div>
    </div>
  )
}
