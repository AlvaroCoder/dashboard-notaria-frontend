"use client";

import React, { useState } from "react";
import { TextField, Paper } from "@mui/material";
import { FileText, User, CalendarDays, Building2, Loader2 } from "lucide-react";
import Title1 from "../elements/Title1";
import { Button } from "../ui/button";

export default function TestimonyForm({
    generateTestimony =()=>{},
    loading=false
}) {
  const [formData, setFormData] = useState({
    testimony: {
      partida: "11310592",
      asiento: "A0001",
      sunarpSection: {
        name: "REGISTRO DE PERSONAS JURIDICAS DE PIURA",
        province: "Piura",
      },
      registrarData: {
        registrar: "William Valencia Macalupu",
        registryOffice: "ZONA REGISTRAL Nº I – SEDEPIURA",
        gender: "M",
      },
      registrationDate: {
        date: "2025-07-12",
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
  };

  return (
    <Paper className=" p-4 shadow-md rounded-2xl">
       <Title1 className="flex flex-row items-center gap-4 my-4" ><FileText className="w-5 h-5" /> Testimonio</Title1>
        <section className="w-full grid grid-cols-2 gap-4">
            <TextField
            label="Partida"
            fullWidth
            value={formData.testimony.partida}
            onChange={(e) => handleChange(e, "partida")}
            />
            <TextField
            label="Asiento"
            fullWidth
            value={formData.testimony.asiento}
            onChange={(e) => handleChange(e, "asiento")}
            />
        </section>

        <Title1 className="flex flex-row items-center gap-4 my-4" ><Building2 className="w-5 h-5" /> SUNARP </Title1>
        <section className="w-full grid grid-cols-2 gap-4">
            <TextField
              label="Nombre"
              fullWidth
              value={formData.testimony.sunarpSection.name}
              onChange={(e) => handleChange(e, "sunarpSection", "name")}
            />
            <TextField
              label="Provincia"
              fullWidth
              value={formData.testimony.sunarpSection.province}
              onChange={(e) => handleChange(e, "sunarpSection", "province")}
            />
        </section>
        <Title1 className="flex flex-row items-center gap-4 my-4" > <User className="w-5 h-5" /> Registrador</Title1>
        <section className="w-full grid grid-cols-2 gap-4">
            <TextField
              label="Registrador"
              fullWidth
              value={formData.testimony.registrarData.registrar}
              onChange={(e) => handleChange(e, "registrarData", "registrar")}
            />
            <TextField
              label="Género"
              fullWidth
              value={formData.testimony.registrarData.gender}
              onChange={(e) => handleChange(e, "registrarData", "gender")}
            />
        </section>

        <Title1 className="flex flex-row items-center gap-4 my-4" ><CalendarDays className="w-5 h-5" /> Fecha de Registro</Title1>
        <TextField
            type="date"
            fullWidth
            value={formData.testimony.registrationDate.date}
            onChange={(e) =>
              handleChange(e, "registrationDate", "date")
            }
        />
        <Button
            onClick={()=>generateTestimony(formData)}
            className={"w-full my-4"}
            disabled={loading}
        >
           {loading ? <Loader2 className="animate-spin"/> : <p> Generar Testimonio</p>}
        </Button>
    </Paper>
  );
}