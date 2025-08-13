'use client'

import { useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function ButtonUploadWord({ 
  handleSetFile,
  dataPreview=null
}) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (
      selectedFile &&
      (selectedFile.type === 'application/msword' ||
        selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    ) {
      setFile(selectedFile);
      handleSetFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      alert('Por favor, selecciona un archivo Word (.doc o .docx).');
      setFile(null);
      setPreviewUrl(null);
    }
  };

  return (
    <div className="w-full">
      <label
        htmlFor="word-upload"
        className="cursor-pointer flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-400 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
      >
        <CloudUploadIcon className="text-gray-600 mb-2" style={{ fontSize: 48 }} />
        <p className="text-gray-700 font-medium text-center px-4">
          {(file ) ? (file?.name): dataPreview ? dataPreview?.name : 'Haz clic para subir el documento Word (.doc o .docx)'}
        </p>
        <input
          id="word-upload"
          type="file"
          accept=".doc,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

    </div>
  );
}