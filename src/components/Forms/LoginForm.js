"use client";

import React, { useState } from "react";
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const router = useRouter();
  const [dataSend, setDataSend] = useState({
    username : "",
    password : ""
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChangeShowPassword=()=>{
    setShowPassword(!showPassword);
  }

  const handleChangeInput=(evt)=>{
    const target = evt.target;
    setDataSend({
      ...dataSend,
      [target.name] : target.value
    });
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes manejar el envío de datos (ej. API)
    console.log("Email:", email, "Password:", password);
  };

  return (
    <div 
      className="mmax-w-md w-full rounded-xl p-8 shadow-sm text-black">
        <h1 className="text-xl font-semibold text-center mb-6">Inicio de Sesión</h1>
        <div className="bg-white ">
          <label htmlFor="username" className="block mb-1 font-medium text-sm">Nombre de usuario <span className="text-red-400">*</span></label>
          <div className="flex flex-row items-center border border-black rounded-lg px-3 py-2 mb-4">
            <PersonIcon className="mr-2 text-lg"/>
            <input
              className="w-full outline-none bg-transparent"
              type="text"
              name="username"
              value={dataSend.username}
              onChange={handleChangeInput}
              required
            />
          </div>
        </div>
        <div className="bg-white ">
          <label htmlFor="password" className="block mb-1 font-medium text-sm">Contraseña <span className="text-red-400">*</span></label>
          <div className="flex flex-row items-center border border-black rounded-lg px-3 py-2 mb-6">
            <LockIcon className="mr-2 text-lg"/>
            <input
              className="w-full outline-none bg-transparent"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={dataSend.password}
              onChange={handleChangeInput}
              required
            />
            {
              showPassword ? <p onClick={handleChangeShowPassword}><VisibilityOffIcon/></p> : <p onClick={handleChangeShowPassword}><RemoveRedEyeIcon/></p>
            }
          </div>
        </div>
       <button
          onClick={()=>router.push("/dashboard/")}
          className="w-full cursor-pointer bg-guinda-oscuro text-white font-semibold py-2 rounded-lg hover:bg-guinda-claro transition-colors"
       >
          Inicia Sesión
       </button>
      </div>
  );
};

export default LoginForm;