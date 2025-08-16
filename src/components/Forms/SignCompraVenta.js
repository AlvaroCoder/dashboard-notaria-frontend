"use client";
import React, { useState } from "react";
import { TextField, Card, CardContent,  } from "@mui/material";
import Title1 from "../elements/Title1";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

export default function SignCompraVenta({ 
  data: initialData, 
  onGenerateParteNotarial=()=>{}, 
  loading= false
}) {
  const [data, setData] = useState(initialData);

  const handleDateChange = (role, index, isSpouse, newDate) => {
    setData((prev) => {
      const updated = { ...prev };
      if (isSpouse) {
        updated[role].people[index].maritalStatus.spouse.signedDate.date = newDate;
      } else {
        updated[role].people[index].signedDate.date = newDate;
      }
      return updated;
    });
  };

  const renderPerson = (person, idx, role) => (
    <Card key={`${role}-${idx}`} className="shadow-md">
      <CardContent>
        <div className="my-2">
          <Title1>{role === 'buyers' ? 'Comprador ' :'Vendedor'}</Title1>
          <p>Nombre : {person?.firstName}</p>
          <p>Apellido : {person?.lastName}</p>
          <p>DNI : {person?.dni}</p>
        </div>
        <TextField
          label="Fecha de firma"
          type="date"
          value={person.signedDate.date}
          onChange={(e) => handleDateChange(role, idx, false, e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />

        {/* Cónyuge */}
        {person.maritalStatus.spouse && (
          <>
            <div className="my-2">
              <Title1>Conyugue : </Title1>
              <p>Nombre : {person.maritalStatus.spouse.firstName}{" "}</p>
              <p>Apellido : {person.maritalStatus.spouse.lastName}</p>
              <p>DNI : {person.maritalStatus.spouse.dni}</p>
            </div>

            <TextField
              label="Fecha de firma del cónyuge"
              type="date"
              value={person.maritalStatus.spouse.signedDate.date}
              onChange={(e) => handleDateChange(role, idx, true, e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Vendedores */}
      <section>
        <Title1 className="my-2">Vendedores</Title1>
        <div className="grid gap-4 md:grid-cols-2">
          {data.sellers.people.map((person, idx) =>
            renderPerson(person, idx, "sellers")
          )}
        </div>
      </section>

      {/* Compradores */}
      <section>
          <Title1 className="my-2">Compradores</Title1>
        <div className="grid gap-4 md:grid-cols-2">
          {data.buyers.people.map((person, idx) =>
            renderPerson(person, idx, "buyers")
          )}
        </div>
      </section>

      {/* Botón de acción */}
      <div className="flex justify-end mt-6">
        <Button
          className={"w-full"}
          onClick={() => onGenerateParteNotarial(data)}
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" /> : <p>Generar Parte Notarial</p>}
        </Button>
      </div>


    </div>
  );
}