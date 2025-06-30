'use client'

import { useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function UploadMinuta({
    handleSetFile
}) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
        handleSetFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      alert('Por favor, selecciona un archivo PDF.');
      setFile(null);
      setPreviewUrl(null);
    }
  };

  return (
    <div className="w-full">
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

      {previewUrl && (
        <div className="mt-6">
          <h3 className="text-md font-semibold text-negro mb-2">Vista previa del PDF:</h3>
          <iframe
            src={previewUrl}
            className="w-full h-96 border rounded"
            title="Vista previa del PDF"
          />
        </div>
      )}
    </div>
  );
}