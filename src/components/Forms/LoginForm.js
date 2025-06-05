"use client";

import React, { useState } from "react";
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useRouter } from "next/navigation";
import ErrorViewComp from "../Errors/ErrorViewComp";
import { Loader2 } from "lucide-react";
import { login } from "@/authentication/lib";

const LoginForm = () => {
  const router = useRouter();
  const [error, setError] = useState(null);

  const [dataSend, setDataSend] = useState({
    username : "",
    password : ""
  });
  
  const [loading, setLoading] = useState(false);
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
  const handleSubmit =async(e) => {
    e.preventDefault();
    // Aquí puedes manejar el envío de datos (ej. API)
    if (!dataSend.username.trim() || !dataSend.password.trim()) {
      alert("Por favor, completa todos los campos");
      setError("Completar los cambios")
      return;
    }
    try {
      setLoading(true);
      const username = dataSend.username;
      const password = dataSend.password;

      const response = await login({username, password},"admin");
      if (response.error) {
        setError(response.message);
        return;
      }      
      router.push("/dashboard");

    } catch (error) {
      alert('Ocurrió un error en el servidor. Inténtalo nuevamente.');
    } finally{
      setLoading(false);
    }
  };

  return (
    <div 
      className="mmax-w-md w-full rounded-xl p-8 shadow-sm text-black">
        <h1 className="text-xl font-semibold text-center mb-6">Inicio de Sesión</h1>
        <div>
          {
            error && <ErrorViewComp  description={error}/>
          }
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white ">
            <label htmlFor="username" className="block font-medium text-sm">Nombre de usuario <span className="text-red-400">*</span></label>
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
            <label htmlFor="password" className="block font-medium text-sm">Contraseña <span className="text-red-400">*</span></label>
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
            type="submit"
            className="w-full cursor-pointer bg-guinda-oscuro text-white font-semibold py-2 rounded-lg hover:bg-guinda-claro transition-colors flex justify-center items-center"
        >
            {
              loading ? <Loader2 className="animate-spin text-center" /> : <span>Inicia Sesión</span>
            }
        </button>
        </form>
      </div>
  );
};

export default LoginForm;