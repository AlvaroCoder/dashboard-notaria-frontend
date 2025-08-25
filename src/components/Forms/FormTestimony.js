"use client";
import React, { useState } from "react";
import { TextField, Paper } from "@mui/material";
import { FileText, User, CalendarDays, Building2, Loader2 } from "lucide-react";
import Title1 from "../elements/Title1";
import { Button } from "../ui/button";
import { formatDateToYMD } from "@/lib/fechas";
import { toast } from "react-toastify";

export default function TestimonyForm({
    generateTestimony =()=>{},
    loading=false
}) {
  const [formData, setFormData] = useState({
    testimony: {
      partida: "",
      asiento: "",
      sunarpSection: {
        name: "REGISTRO DE PERSONAS JURIDICAS DE PIURA",
        province: "Piura",
      },
      registrarData: {
        registrar: "",
        registryOffice: "",
        gender: "M",
      },
      registrationDate: {
        date: formatDateToYMD(new Date()),
      },
    },
  });

  


  const handleChange = (e, section, field, subField) => {
    const value = e.target.value;
    setFormData((prev) => {
      const newData = { ...prev };
      if (subField) {
        newData.testimony[section][field][subField] = value;
      } else if (field) {
        newData.testimony[section][field] = value;
      } else {
        newData.testimony[section] = value;
      }
      return newData;
    });

    setErrors(prevErrors => prevErrors.filter(error => error !== fullKey));
  };

  const [errors, setErrors] = useState({});

  const validateFields = (data) => {
    const emptyFields = [];
  
    const checkFields = (obj, parentKey = '') => {
      for (const key in obj) {
        const value = obj[key];
        const fullKey = parentKey ? `${parentKey}.${key}` : key;
  
        if (typeof value === 'object' && value !== null) {
          checkFields(value, fullKey); // Recursión para objetos anidados
        } else {
          if (typeof value === 'string' && value.trim() === '') {
            emptyFields.push(fullKey); // Guardamos el nombre del campo vacío
          }
        }
      }
    };
  
    checkFields(data);
    return emptyFields;
  };
  
  const handleSubmit = ()=>{
    const emptyFields = validateFields(formData);
    if (emptyFields.length > 0) {
      toast("Complete los campos vacios",{
        type : 'error',
        position : 'bottom-center'
      });

      setErrors(emptyFields);

      setTimeout(() => {
        setErrors({});
      }, 4000);

      return;
    }
    
    generateTestimony(formData);

  }

  return (
    <Paper className="p-4 shadow-md rounded-2xl">
    <Title1 className="flex flex-row items-center gap-4 my-4">
      <FileText className="w-5 h-5" /> Testimonio
    </Title1>
    <section className="w-full grid grid-cols-2 gap-4">
      <TextField
        label="Partida"
        fullWidth
        value={formData.testimony.partida}
        onChange={(e) => handleChange(e, "partida")}
        error={!!errors["testimony.partida"]}
        helperText={errors["testimony.partida"]}
      />
      <TextField
        label="Asiento"
        fullWidth
        value={formData.testimony.asiento}
        onChange={(e) => handleChange(e, "asiento")}
        error={!!errors["testimony.asiento"]}
        helperText={errors["testimony.asiento"]}
      />
    </section>

    <Title1 className="flex flex-row items-center gap-4 my-4">
      <Building2 className="w-5 h-5" /> SUNARP
    </Title1>
    <section className="w-full grid grid-cols-2 gap-4">
      <TextField
        label="Nombre"
        fullWidth
        value={formData.testimony.sunarpSection.name}
        onChange={(e) => handleChange(e, "sunarpSection", "name")}
        error={!!errors["testimony.sunarpSection.name"]}
        helperText={errors["testimony.sunarpSection.name"]}
      />
      <TextField
        label="Provincia"
        fullWidth
        value={formData.testimony.sunarpSection.province}
        onChange={(e) => handleChange(e, "sunarpSection", "province")}
        error={!!errors["testimony.sunarpSection.province"]}
        helperText={errors["testimony.sunarpSection.province"]}
      />
    </section>

    <Title1 className="flex flex-row items-center gap-4 my-4">
      <User className="w-5 h-5" /> Registrador
    </Title1>
    <section className="w-full grid grid-cols-2 gap-4">
      <TextField
        label="Registrador"
        fullWidth
        value={formData.testimony.registrarData.registrar}
        onChange={(e) => handleChange(e, "registrarData", "registrar")}
        error={!!errors["testimony.registrarData.registrar"]}
        helperText={errors["testimony.registrarData.registrar"]}
      />
      <TextField
        label="Género"
        fullWidth
        value={formData.testimony.registrarData.gender}
        onChange={(e) => handleChange(e, "registrarData", "gender")}
        error={!!errors["testimony.registrarData.gender"]}
        helperText={errors["testimony.registrarData.gender"]}
      />
    </section>

    <Title1 className="flex flex-row items-center gap-4 my-4">
      <CalendarDays className="w-5 h-5" /> Fecha de Registro
    </Title1>
    <TextField
      type="date"
      fullWidth
      value={formData.testimony.registrationDate.date}
      onChange={(e) => handleChange(e, "registrationDate", "date")}
    />

    <Button
      onClick={handleSubmit}
      className={"w-full my-4"}
      disabled={loading}
    >
      {loading ? <Loader2 className="animate-spin" /> : <p>Generar Testimonio</p>}
    </Button>
  </Paper>
  );
}