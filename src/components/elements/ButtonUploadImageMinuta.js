'use state'
import { useState } from "react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ClearIcon from '@mui/icons-material/Clear';

export default function ButtonUploadImageMinuta({ 
    handleChangeImage,
    handleDeleteImageMinuta
  }) {
  const [imagesPreview, setImagesPreview] = useState([]);
  
  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const newPreviews = fileArray.map((file) => URL.createObjectURL(file));

    setImagesPreview((prev) => [...prev, ...newPreviews]);
    handleChangeImage(fileArray);
  };
  const handleDeleteImage =(index)=>{
    const newArrImage = imagesPreview.filter((_,idx)=>index!==idx);
    setImagesPreview(newArrImage);
    handleDeleteImageMinuta(index);
  }
  return (
    <div className="p-4 ">
      <div className="flex flex-wrap gap-4 items-center">
        {imagesPreview.map((src, idx) => (
          <section key={idx} className="relative">
            <div 
            onClick={()=>handleDeleteImage(idx)}  
            className="absolute cursor-pointer  bg-[#5F1926] hover:bg-red-700 rounded-full text-sm p-2 -top-3 -right-3 text-white ">
              <ClearIcon/></div>
            <img
              key={idx}
              src={src}
              alt={`Preview ${idx}`}
              className="w-32 h-32 object-cover rounded-lg border"
            />
          </section>
        ))}

        <label
          htmlFor="uploadImage"
          className={`flex items-center justify-center border border-dashed border-gray-300 rounded-lg cursor-pointer transition hover:bg-gray-50 ${
            imagesPreview.length === 0
              ? "w-full h-72 text-gray-500 text-center text-sm"
              : "w-32 h-32"
          }`}
        >
          {imagesPreview.length === 0 ? (
            <span className="text-gray-500 flex flex-col justify-center items-center">
                <CloudUploadIcon className="w-96 h-40"/>
                <span>Haz clic para subir el comprobante</span>
            </span>
          ) : (
            <span className="text-3xl text-gray-400 font-bold">+</span>
          )}
          <input
            id="uploadImage"
            type="file"
            accept=".jpeg, .jpg, .png, image/jpeg, image/png"
            multiple
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>
      </div>
    </div>
  );
}