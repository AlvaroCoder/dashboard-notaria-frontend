'use client'
import { CloudUploadIcon } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from '../ui/button';
import { sendDataMinuta, uploadDirMinuta } from '@/lib/apiConnections';
import { toast } from 'react-toastify';

export default function ViewButtonUploadMinuta({
    directory = null,
    contractId = null
}) {
      const [file, setFile] = useState(null);
      const [previewUrl, setPreviewUrl] = useState(null);
    
      const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
    
        if (selectedFile && selectedFile.type === 'application/pdf') {
          setFile(selectedFile);
          const url = URL.createObjectURL(selectedFile);
          setPreviewUrl(url);
        } else {
          alert('Por favor, selecciona un archivo PDF.');
          setFile(null);
          setPreviewUrl(null);
        }
      };
    const handleSubmitMinuta=async(evt)=>{
        evt.preventDefault();
        const newFormData = new FormData();
        newFormData.append('minutaFile', file);
    
        const response = await sendDataMinuta(newFormData, directory);
        const responseJSON = await response.json();
        if (responseJSON.error) {
            toast("Error al subir la minuta",{
                type : 'error',
                position : 'bottom-center'
            });
            return;
        }
        toast("Minuta subida correctamente",{
            type : 'success',
            position : 'bottom-right'
        });
        
        const fileLocation = responseJSON?.fileLocation;
        const dirFileLocation = fileLocation?.directory || null;
        const fileName = fileLocation?.fileName || null;    
        
        const responseUploadDir = await uploadDirMinuta(contractId, dirFileLocation, fileName);
        if (!responseUploadDir.ok) {
            toast("Error al asociar la minuta al contrato",{
                type : 'error',
                position : 'bottom-center'
            });
            return;
        }
        toast("Minuta asociada al contrato correctamente",{
            type : 'success',
            position : 'bottom-right'
        });
        window.location.reload();

    }   
  return (
    <div className="w-full mt-4">
      <label
        htmlFor="minuta-upload"
        className="cursor-pointer flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-400 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
      >
        <CloudUploadIcon className="text-gray-600 mb-2" style={{ fontSize: 48 }} />
        <p className="text-gray-700 font-medium text-center px-4">
          {file ? file.name : 'Haz clic para subir la minuta (solo PDF)'}
        </p>
        <input
          id="minuta-upload"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {(previewUrl) && (
        <div className="mt-6">
          <h3 className="text-md font-semibold text-negro mb-2">Vista previa del PDF:</h3>
          <iframe
            src={previewUrl}
            className="w-full h-96 border rounded"
            title="Vista previa del PDF"
          />
          <Button
            onClick={handleSubmitMinuta}
            className={'w-full mt-6'}
          >
            Subir Minuta
          </Button>
        </div>
      )}
    </div>
  )
}
