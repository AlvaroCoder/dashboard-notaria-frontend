"use client";
import React, { useState } from "react";
import { TextField, Paper, FormControl, Select, InputLabel, MenuItem } from "@mui/material";
import { FileText, User, CalendarDays, Building2, Loader2 } from "lucide-react";
import Title1 from "../elements/Title1";
import { Button } from "../ui/button";
import { formatDateToYMD } from "@/lib/fechas";
import { toast } from "react-toastify";

export default function TestimonyForm({
  generateTestimony = () => {},
  loading = false,
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
        registryOffice: "ZONA REGISTRAL Nº I – SEDEPIURA",
        gender: "M",
      },
      registrationDate: {
        date: formatDateToYMD(new Date()),
      },
    },
  });

  const [errors, setErrors] = useState([]); // Guardamos array de keys con errores

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

    // Eliminamos el error si existía
    const fullKey = `testimony${section ? "." + section : ""}${
      field ? "." + field : ""
    }${subField ? "." + subField : ""}`;

    setErrors((prevErrors) => prevErrors.filter((error) => error !== fullKey));
  };

  const validateFields = (data) => {
    const emptyFields = [];

    const checkFields = (obj, parentKey = "") => {
      for (const key in obj) {
        const value = obj[key];
        const fullKey = parentKey ? `${parentKey}.${key}` : key;

        if (typeof value === "object" && value !== null) {
          checkFields(value, fullKey);
        } else {
          if (typeof value === "string" && value.trim() === "") {
            emptyFields.push(fullKey);
          }
        }
      }
    };

    checkFields(data);
    return emptyFields;
  };

  const handleSubmit = () => {
    const emptyFields = validateFields(formData);
  
    if (emptyFields.length > 0) {
      toast("Complete los campos vacíos", {
        type: "error",
        position: "bottom-center",
      });

      setErrors(emptyFields);

      return;
    }

    generateTestimony(formData);
  };

  const hasError = (fieldKey) => errors.includes(fieldKey);

  return (
    <Paper className="p-4 shadow-md rounded-2xl">
      <Title1 className="flex flex-row items-center gap-4 my-4">
        <FileText className="w-5 h-5" /> Testimonio
      </Title1>
      <section className="w-full grid grid-cols-2 gap-4">
        <TextField
          label="Nro Partida Regitral"
          fullWidth
          value={formData.testimony.partida}
          onChange={(e) => handleChange(e, "partida")}
          error={hasError("testimony.partida")}
          type="number"
          helperText={hasError("testimony.partida") ? "Este campo es obligatorio" : ""}
        />
        <TextField
          label="Nro Asiento"
          fullWidth
          value={formData.testimony.asiento}
          onChange={(e) => handleChange(e, "asiento")}
          error={hasError("testimony.asiento")}
          type="number"
          helperText={hasError("testimony.asiento") ? "Este campo es obligatorio" : ""}
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
          error={hasError("testimony.sunarpSection.name")}
          helperText={hasError("testimony.sunarpSection.name") ? "Este campo es obligatorio" : ""}
        />
        <TextField
          label="Provincia"
          fullWidth
          value={formData.testimony.sunarpSection.province}
          onChange={(e) => handleChange(e, "sunarpSection", "province")}
          error={hasError("testimony.sunarpSection.province")}
          helperText={hasError("testimony.sunarpSection.province") ? "Este campo es obligatorio" : ""}
        />
      </section>

      <Title1 className="flex flex-row items-center gap-4 my-4">
        <User className="w-5 h-5" /> Registrador
      </Title1>
      <section className="w-full grid grid-cols-2 gap-4">
        <TextField
          label="Nombre Registrador"
          fullWidth
          value={formData.testimony.registrarData.registrar}
          onChange={(e) => handleChange(e, "registrarData", "registrar")}
          error={hasError("testimony.registrarData.registrar")}
          helperText={hasError("testimony.registrarData.registrar") ? "Este campo es obligatorio" : ""}
        />
      <FormControl fullWidth error={hasError("testimony.registrarData.gender")}>
        <InputLabel>Género</InputLabel>
        <Select
          value={formData.testimony.registrarData.gender}
          onChange={(e) => handleChange(e, "registrarData", "gender")}
        >
          <MenuItem value="M">Masculino</MenuItem>
          <MenuItem value="F">Femenino</MenuItem>
        </Select>
        {hasError("testimony.registrarData.gender") && (
          <p style={{ color: "red", fontSize: "0.8rem" }}>Este campo es obligatorio</p>
        )}
      </FormControl>
        <TextField
          label="Oficina de registro"
          fullWidth
          value={formData.testimony.registrarData.registryOffice}
          onChange={(e) => handleChange(e, "registrarData", "registryOffice")}
          error={hasError("testimony.registrarData.registryOffice")}
          helperText={hasError("testimony.registrarData.registryOffice") ? "Este campo es obligatorio" : ""}
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
        className="w-full my-4"
        disabled={loading}
      >
        {loading ? <Loader2 className="animate-spin" /> : <p>Generar Testimonio</p>}
      </Button>
    </Paper>
  );
}