import React, { useState } from 'react'
import { Button } from '../ui/button';
import Title1 from '../elements/Title1';
import { Card, CardContent, TextField } from '@mui/material';
import { Loader2 } from 'lucide-react';
import { formatDateToYMD } from '@/lib/fechas';

export default function SignConstitucion({
    data : initialData,
    onGenerateParteNotarial=()=>{},
    loading = false
}) {  
    const [data, setData] = useState(initialData);
    const [dateNotarioSigned, setDateNotarioSigned] = useState(formatDateToYMD(new Date()))
    const handleDateChange=(index, isSpouse, newDate)=>{
        setData((prev)=>{
        const updated = {...prev};
            if (isSpouse) {
                updated['founders'].people[index].maritalStatus.spouse.signedDate.date= newDate;
            }else {
                updated['founders'].people[index].signedDate.date = newDate;
            }
            return updated;
        })
    }
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
              onChange={(e) => handleDateChange( idx, false, e.target.value)}
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
                  onChange={(e) => handleDateChange( idx, true, e.target.value)}
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
        <section>
          <Title1 className="my-2">Fundadores</Title1>
          <div className="grid gap-4 md:grid-cols-2">
            {data.founders.people.map((person, idx) =>
              renderPerson(person, idx, "founders")
            )}
          </div>
        </section>
        <section>
          <Title1 className="my-2">Notario</Title1>
          <TextField
            label="Fecha de firma notario"
            type='date'
            value={dateNotarioSigned}
            onChange={(e)=>setDateNotarioSigned(e.target.value)}
            fullWidth
            margin='normal'
            InputLabelProps={{ shrink : true }}
          />
        </section>
        <div className="flex justify-end mt-6">
        <Button
          className={"w-full"}
          disabled={loading}
          onClick={() => onGenerateParteNotarial({
            ...data,
            signedDocumentDate : {
              date : dateNotarioSigned
            }
          })}
        >
         {loading? <Loader2 className='animate-spin' /> : <p> Generar Parte Notarial</p>}
        </Button>
      </div>
    </div>
  )
}
