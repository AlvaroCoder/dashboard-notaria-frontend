"use client";

import React, { useState } from "react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes manejar el envío de datos (ej. API)
    console.log("Email:", email, "Password:", password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000000] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1A1A1A] text-white w-full max-w-md p-8 rounded-2xl shadow-lg border border-[#6E0D24]"
      >
        <h2 className="text-3xl font-bold text-center text-[#DCAB6B] mb-6">
          Iniciar Sesión
        </h2>

        <div className="mb-4">
          <label className="block text-sm text-[#DCAB6B] mb-1">Correo electrónico</label>
          <input
            type="email"
            className="w-full px-4 py-2 rounded-md bg-[#000000] text-white border border-[#DCAB6B] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DCAB6B]"
            placeholder="ejemplo@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm text-[#DCAB6B] mb-1">Contraseña</label>
          <input
            type="password"
            className="w-full px-4 py-2 rounded-md bg-[#000000] text-white border border-[#DCAB6B] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DCAB6B]"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#6E0D24] hover:bg-[#8b142f] text-white font-semibold py-2 rounded-md transition duration-200"
        >
          Acceder
        </button>

        <p className="mt-4 text-center text-sm text-gray-400">
          ¿Olvidaste tu contraseña?
          <a href="#" className="text-[#DCAB6B] hover:underline ml-1">
            Recuperar acceso
          </a>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;