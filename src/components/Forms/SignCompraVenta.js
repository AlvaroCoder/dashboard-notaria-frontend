// components/SignCompraVenta.jsx
"use client";
import { useState } from "react";
import { TextField, Typography, Paper } from "@mui/material";

export default function SignCompraVenta({ initialData }) {
  const [data, setData] = useState(initialData);

  const handleDateChange = (buyerIndex, isSpouse = false, newDate) => {
    setData((prev) => {
      const updated = { ...prev };
      if (isSpouse) {
        updated.buyers.people[buyerIndex].maritalStatus.spouse.signedDate.date =
          newDate;
      } else {
        updated.buyers.people[buyerIndex].signedDate.date = newDate;
      }
      return updated;
    });
  };

  return (
    <div className="space-y-6 mt-6">
      

      {data.buyers.people.map((buyer, index) => (
        <Paper key={buyer.dni} className="p-4 space-y-4 shadow-md">
          <Typography variant="subtitle1" className="font-semibold">
            Comprador: {buyer.dni}
          </Typography>
          <TextField
            label="Fecha de firma"
            type="date"
            value={buyer.signedDate.date}
            onChange={(e) => handleDateChange(index, false, e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          {buyer.maritalStatus?.spouse && (
            <div className="pt-4 border-t border-gray-300">
              <Typography variant="subtitle2" className="font-semibold">
                Cónyuge: {buyer.maritalStatus.spouse.dni}
              </Typography>
              <TextField
                label="Fecha de firma (cónyuge)"
                type="date"
                value={buyer.maritalStatus.spouse.signedDate.date}
                onChange={(e) =>
                  handleDateChange(index, true, e.target.value)
                }
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </div>
          )}
        </Paper>
      ))}

    </div>
  );
}