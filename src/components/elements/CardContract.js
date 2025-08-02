'use client'
import React, { useState } from 'react'
import { ChevronDown, ChevronUp, FileText } from "lucide-react";
import ButtonDownloadPdf from './ButtonDownloadPdf';

export default function CardContract({
    contract
}) {
    const [isOpen, setIsOpen] = useState(false);

    const {
      contractType,
      sellers,
      buyers,
      paymentMethod,
      case: caseType,
      minutaDirectory,
      datesDocument
    } = contract;
  
    const toggleOpen = () => setIsOpen(!isOpen);
  
    return (
      <div className="bg-white shadow-md rounded-xl border border-gray-200 w-full max-w-xl transition-all duration-300">
        {/* Header */}
        <div
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 rounded-t-xl"
          onClick={toggleOpen}
        >
          <div className="flex items-center gap-3">
            <FileText className="text-blue-600 w-5 h-5" />
            <div>
                <h3 className="font-semibold text-gray-800">
                Contrato de {caseType?.toLowerCase()} - {contractType}
                </h3>
            </div>
          </div>
          <div>{isOpen ? <ChevronUp /> : <ChevronDown />}</div>
        </div>
  
        {/* Body */}
        {isOpen && (
          <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-2 text-sm text-gray-700">
            <div>
              <strong>Vendedores:</strong> {sellers?.people?.length}
            </div>
            <div>
              <strong>Compradores:</strong> {buyers?.people?.length}
            </div>
            <div>
              <strong>Método de pago:</strong> {paymentMethod?.caption || "No especificado"}
            </div>
            <div className="flex items-center gap-2">
              <strong>Minuta:</strong>
              {minutaDirectory ? (
                <ButtonDownloadPdf
                  minutaDirectory={minutaDirectory}
                />
              ) : (
                "No disponible"
              )}
            </div>
          </div>
        )}
      </div>
    )
}
