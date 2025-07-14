'use client'
import React from 'react'
import { Dialog, DialogContent } from '../ui/dialog'
import { motion } from "framer-motion";
export default function Loading({
    isOpen
}) {
  const features = [
    "Atención personalizada",
    "Trámites rápidos y seguros",
    "Especialistas en derecho notarial",
    "Más de 20 años de experiencia",
    "Asesoría legal confiable",
  ];

  return (
    <Dialog
        open={isOpen}
    >
       <DialogContent>
       <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Cargando...</h1>

        <motion.div
          className="flex justify-center mb-10"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </motion.div>

        <div className="max-w-md mx-auto">
          {features.map((feature, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.3 }}
              className="text-lg text-gray-600 mb-3"
            >
              {feature}
            </motion.p>
          ))}
        </div>
      </motion.div>
       </DialogContent>
    </Dialog>
  )
}
