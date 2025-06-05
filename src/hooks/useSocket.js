import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export const useSocket = (onNewContract, baseURLApi="http://localhost:8000" ) => {
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(baseURLApi); // tu dominio aquí
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Conectado a Socket.IO");
    });

    socket.on("new_contract", (data) => {
      console.log("📨 Contrato recibido por socket:", data);
      onNewContract(data); // puedes mostrar una notificación, refrescar lista, etc.
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return socketRef.current;
};