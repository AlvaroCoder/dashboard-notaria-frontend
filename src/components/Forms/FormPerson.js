'use client';
import { cn } from '@/lib/utils';
import React from 'react';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import ErrorCard from '../elements/ErrorCard';
import Title1 from '../elements/Title1';
import { Checkbox, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, TextField } from '@mui/material';

const getMaritalOptions = (gender) => {
  if (gender === 'F') return ['soltera', 'casada', 'viuda', 'divorciada'];
  if (gender === 'M') return ['soltero', 'casado', 'viudo', 'divorciado'];
  return [];
};

const SpouseFields = ({ person, onChange, idx, personType }) => {
  // Mancomunados: datos del cónyuge
  if (person?.bienesMancomunados) {
    return (
      <div className="grid grid-cols-2 gap-4 mt-8">
        <TextField 
          disabled={!person.maritalStatus.moreInfo}
          label="Primer Nombre" 
          value={person?.maritalStatus?.spouse?.firstName || ''} 
          onChange={(e) => onChange(idx, 'spouse-firstName', e.target.value, personType, person?.bienesMancomunados)} required />
        <TextField 
          disabled={!person.maritalStatus.moreInfo}
          label="Apellido" 
          value={person?.maritalStatus?.spouse?.lastName || ''} 
          onChange={(e) => onChange(idx, 'spouse-lastName', e.target.value, personType, person?.bienesMancomunados)} required />
        <TextField 
          disabled={!person.maritalStatus.moreInfo}
          label="DNI" 
          type="number" 
          value={person?.maritalStatus?.spouse?.dni || ''} 
          onChange={(e) => onChange(idx, 'spouse-dni', e.target.value, personType, person?.bienesMancomunados)} required />
        <FormControl required>
          <InputLabel>Género</InputLabel>
          <Select 
            disabled={!person.maritalStatus.moreInfo}
            value={person?.maritalStatus?.spouse?.gender || ''} 
            onChange={(e) => onChange(idx, 'spouse-gender', e.target.value, personType, person?.bienesMancomunados)} required>
            <MenuItem value="M">Masculino</MenuItem>
            <MenuItem value="F">Femenino</MenuItem>
          </Select>
        
        </FormControl>
        <TextField 
          disabled={!person.maritalStatus.moreInfo}
          label="Nacionalidad" 
          value={person?.maritalStatus?.spouse?.nationality || ''} 
          onChange={(e) => onChange(idx, 'spouse-nationality', e.target.value, personType, person?.bienesMancomunados)} required />
        <TextField 
          disabled={!person.maritalStatus.moreInfo}
          label="Trabajo" 
          className="col-span-2" 
          value={person?.maritalStatus?.spouse?.job || ''} 
          onChange={(e) => onChange(idx, 'spouse-job', e.target.value, personType, person?.bienesMancomunados)} required />
        <div>
          <FormGroup>
            <FormControlLabel control={
              <Checkbox  
                checked={person.maritalStatus.moreInfo}
                onChange={(e)=>onChange(idx,'moreInfo', e.target.checked, personType, person?.bienesMancomunados)}
              />
            } label="Brindar información marital" />
          </FormGroup>
        </div>
      </div>
    );
  }
  // Separados: datos del marriageType
  return (
    <div className="grid grid-cols-1 gap-4 mt-8">
      <TextField
        disabled={!person.maritalStatus.moreInfo}
        label="Nro Partida Registral"
        type="number"
        value={person?.maritalStatus?.marriageType?.partidaRegistralNumber || ''}
        onChange={(e) => onChange(idx, 'marriageType-partidaRegistralNumber', e.target.value, personType, person?.bienesMancomunados)}
      />
      <TextField
        disabled={!person.maritalStatus.moreInfo}
        label="Provincia de la Boda"
        value={person?.maritalStatus?.marriageType?.province || ''}
        onChange={(e) => onChange(idx, 'marriageType-province', e.target.value, personType, person?.bienesMancomunados)}
      />
      <div>
      <FormGroup>
            <FormControlLabel control={
              <Checkbox  
                checked={person.maritalStatus.moreInfo}
                onChange={(e)=>onChange(idx,'moreInfo', e.target.checked, personType, person?.bienesMancomunados)}
              />
            } label="Brindar información marital" />
          </FormGroup>
      </div>
    </div>
  );
};

export default function FormPerson({
  data = [],
  handleChange = () => {},
  handleGiveSpouseData = ()=>{},
  type = 'venta',
  handleDelete = () => {},
  errores = [],
}) {
  const nombreProceso = type === 'venta' ? 'Vendedor' : 'Comprador';
  const personType = type === 'venta' ? 'vendedores' : 'compradores';

  return data?.map((person, idx) => (
    <section key={idx} className={cn('min-w-3xl relative h-fit mt-6', 'bg-white shadow rounded-lg')}>
      {idx > 0 && (
        <Button
          variant="outline"
          className="absolute top-0 px-8 py-5 right-0 bg-[#5F1926] cursor-pointer hover:bg-red-400 rounded-full text-white"
          onClick={() => handleDelete(idx, personType)}
        >
          <Trash2 />
        </Button>
      )}

      {(errores?.length > 0 && errores[idx]?.error) && (
        <div className="w-full p-4">
          <ErrorCard title="Campos incompleto" description={'Por favor completa el formulario'} />
        </div>
      )}

      <section className={cn((person?.maritalStatus?.civilStatus === 'casado' || person?.maritalStatus?.civilStatus === 'casada') ? 'flex flex-row' : '', 'flex-1')}>
        <div className="flex-1 p-8 mb-6">
          <div className="mb-4">
            <Title1 className="text-2xl">{nombreProceso} {idx + 1}</Title1>
            <p>Información del {nombreProceso}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TextField label="Primer Nombre" value={person.firstName} onChange={(e) => handleChange(idx, 'firstName', e.target.value, personType)} fullWidth required />
            <TextField label="Apellido" value={person.lastName} onChange={(e) => handleChange(idx, 'lastName', e.target.value, personType)} fullWidth required />
            <TextField label="DNI" type="number" value={person.dni} onChange={(e) => handleChange(idx, 'dni', e.target.value, personType)} fullWidth required />

            <FormControl fullWidth required error={!person?.gender}>
              <InputLabel>Género</InputLabel>
              <Select
                value={person?.gender || ""}
                label="Género"
                onChange={(e) =>
                  handleChange(idx, "gender", e.target.value, personType)
                }
              >
                <MenuItem value="M">Masculino</MenuItem>
                <MenuItem value="F">Femenino</MenuItem>
              </Select>
              {!person?.gender && (
                <p style={{ color: "red", fontSize: "0.8rem" }}>
                  Este campo es obligatorio
                </p>
              )}
            </FormControl>

            <TextField label="Nacionalidad" value={person.nationality} onChange={(e) => handleChange(idx, 'nationality', e.target.value, personType)} fullWidth required />
            <TextField label="Trabajo" value={person.job} onChange={(e) => handleChange(idx, 'job', e.target.value, personType)} fullWidth required />

            <section className="w-full flex flex-row gap-2">
              <FormControl fullWidth>
                <InputLabel>Estado Civil</InputLabel>
                <Select
                  value={person?.maritalStatus?.civilStatus || ''}
                  label="Estado Civil"
                  onChange={(e) => handleChange(idx, 'maritalStatus', e.target.value, personType, person?.bienesMancomunados)} 
                  required
                >
                  {getMaritalOptions(person?.gender)?.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option?.charAt(0).toUpperCase() + option?.slice(1).toLowerCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </section>

            {/* Dirección */}
            <div className="col-span-2">
              <TextField label="Distrito" value={person.address?.district || ''} onChange={(e) => handleChange(idx, 'address-district', e.target.value, personType)} fullWidth required />
            </div>
            <div className="col-span-2">
              <TextField label="Provincia" value={person.address?.province || ''} onChange={(e) => handleChange(idx, 'address-province', e.target.value, personType)} fullWidth required />
            </div>
            <div className="col-span-2">
              <TextField label="Departamento" value={person.address?.department || ''} onChange={(e) => handleChange(idx, 'address-department', e.target.value, personType)} fullWidth required />
            </div>
            <div className="col-span-2">
              <TextField label="Dirección de Domicilio" value={person.address?.name || ''} onChange={(e) => handleChange(idx, 'address-name', e.target.value, personType)} fullWidth required />
            </div>
          </div>
        </div>

        {(person?.maritalStatus?.civilStatus === 'casado' || person?.maritalStatus?.civilStatus === 'casada') && (
          <section className="flex-1 p-8 mb-6 border-l border-gray-200">
            <Title1 className="text-2xl">Información del Cónyuge</Title1>
            <p className="text-sm">Información del cónyuge del {nombreProceso}</p>

            <div className="grid grid-cols-2 gap-4 mt-2">
              <Button
                variant={person?.bienesMancomunados ? '' : 'outline'}
                onClick={() => handleChange(idx, 'bienesMancomunados', true, personType)}
              >
                Con bienes mancomunados
              </Button>
              <Button
                variant={!person?.bienesMancomunados ? '' : 'outline'}
                onClick={() => handleChange(idx, 'bienesMancomunados', false, personType)}
              >
                Con bienes separados
              </Button>
            </div>

            <SpouseFields person={person} onChange={handleChange} idx={idx} personType={personType} />
          </section>
        )}
      </section>
    </section>
  ));
}