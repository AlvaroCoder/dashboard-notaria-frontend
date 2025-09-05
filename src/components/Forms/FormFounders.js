import React from "react";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import Title1 from "../elements/Title1";
import { Checkbox, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { cn } from "@/lib/utils";

const getMaritalOptions = (gender) => {
  if (gender === 'F') return ['soltera', 'casada', 'viuda', 'divorciada'];
  if (gender === 'M') return ['soltero', 'casado', 'viudo', 'divorciado'];
  return [];
};

export default function FormFounders({ 
  handleSendFounder = () => {} ,
  handleClickBack= ()=>{},
  initialFounder=null
}) {
  const initialDataFounder = {
    firstName: "",
    lastName: "",
    dni: "",
    gender: "M",
    nationality: "Peruano",
    age: '19',
    job: "",
    maritalStatus: {
      moreInfo : false,
      civilStatus: "soltero",
      spouse: null
    },
    bienesMancomunados: true, // 👈 aquí
    address: {
      name: "",
      district: "",
      province: "",
      department: ""
    }
  };

  const [founders, setFounders] = React.useState(initialFounder ? initialFounder : [initialDataFounder]);
  
  const handleChangeFounder = (index, field, value) => {
    const list = [...founders];
    const founder = list[index];
  
    if (field === 'moreInfo') {
      founder.maritalStatus.moreInfo = Boolean(value);
      founder.maritalStatus.spouse = null;
    }

    if (field === 'bienesMancomunados') {
      founder.bienesMancomunados = value;
  
      if (value) {
        founder.maritalStatus.spouse = {};
        founder.maritalStatus.marriageType = { type: 2 }; // bienes mancomunados
      } else {
        founder.maritalStatus.spouse = null;
        founder.maritalStatus.marriageType = {
          type: 1,
          partidaRegistralNumber: "",
          province: ""
        };
      }
    }
  
    else if (field?.startsWith("spouse-")) {
      const fieldForm = field.split("-")[1];
      if (!founder.maritalStatus.spouse) {
        founder.maritalStatus.spouse = {};
      }
      founder.maritalStatus.spouse[fieldForm] = value;
    }
  
    else if (field?.startsWith('marriageType-')) {
      const fieldForm = field.split("-")[1];
      if (!founder.maritalStatus.marriageType) {
        founder.maritalStatus.marriageType = { type: founder.bienesMancomunados ? 2 : 1};
      }
      founder.maritalStatus.marriageType[fieldForm] = value;
    }
  
    else if (field === 'address') {
      founder.address.name = value;
    }
  
    else if (["district", "province", "department"].includes(field)) {
      founder.address[field] = value;
    }
  
    else if (field === 'maritalStatus') {
      founder.maritalStatus.civilStatus = value?.toLowerCase();
      const isCasado = value?.toLowerCase() === 'casado' || value?.toLowerCase() === 'casada';
  
      if (isCasado) {
        founder.maritalStatus.moreInfo = true;
        founder.maritalStatus.marriageType = {
          type: founder.bienesMancomunados ? 2 : 1
        };
  
        if (founder.bienesMancomunados) {
          founder.maritalStatus.spouse = {};
        } else {
          founder.maritalStatus.spouse = null;
        }
      } else {
        founder.maritalStatus.spouse = null;
        founder.maritalStatus.marriageType = null;
      }
    }
  
    else {
      founder[field] = value;
    }
  
    list[index] = founder;
    setFounders(list);
  };

  const handleAddFounder = (e) => {
    e.preventDefault();
    setFounders([...founders, initialDataFounder]);
  };

  const handleDeleteFounder = (idx) => {
    const newData = founders.filter((_, index) => idx !== index);
    setFounders(newData);
  };

  return (
    <section className="mt-8">
      {founders.map((person, idx) => (
        <div key={idx} className="min-w-3xl mt-6 relative h-fit bg-white shadow rounded-lg space-y-6">
          {idx > 0 && (
            <Button
              variant="outline"
              className="absolute top-0 px-8 py-5 right-0 bg-[#5F1926] cursor-pointer hover:bg-red-400 rounded-full text-white"
              onClick={() => handleDeleteFounder(idx)}
            >
              <Trash2 />
            </Button>
          )}
            <section className={cn(person?.maritalStatus?.civilStatus === 'casado' || person?.maritalStatus?.civilStatus === 'casada'? 'flex flex-row' : '', 'flex-1')}>
                <div className="flex-1 p-8 mb-6">
                    <div className="mb-4">
                    <Title1 className="text-2xl">Fundador {idx + 1}</Title1>
                    <p>Información del Fundador</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                    <TextField label="Primer Nombre" value={person.firstName} onChange={(e) => handleChangeFounder(idx, 'firstName', e.target.value)} fullWidth required />
                    <TextField label="Apellido" value={person.lastName} onChange={(e) => handleChangeFounder(idx, 'lastName', e.target.value)} fullWidth required />
                    <TextField label="DNI" value={person.dni} onChange={(e) => handleChangeFounder(idx, 'dni', e.target.value)} fullWidth required />
                    <FormControl>
                        <InputLabel>Género</InputLabel>
                        <Select
                        value={person.gender}
                        onChange={(e) => handleChangeFounder(idx, 'gender', e.target.value)}
                        >
                        <MenuItem value="M">Masculino</MenuItem>
                        <MenuItem value="F">Femenino</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField label="Nacionalidad" value={person.nationality} onChange={(e) => handleChangeFounder(idx, 'nationality', e.target.value)} fullWidth required />
                    <TextField label="Trabajo" value={person.job} onChange={(e) => handleChangeFounder(idx, 'job', e.target.value)} />
                    <FormControl fullWidth>
                        <InputLabel>Estado Civil</InputLabel>
                        <Select
                        value={person.maritalStatus.civilStatus || ''}
                        onChange={(e) => handleChangeFounder(idx, 'maritalStatus', e.target.value)}
                        >
                        {getMaritalOptions(person.gender).map((option, i) => (
                            <MenuItem key={i} value={option}>
                            {option.charAt(0).toUpperCase() + option.slice(1).toLowerCase()}
                            </MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                    <div className="col-span-2">
                        <TextField label="Distrito" value={person.address.district} onChange={(e) => handleChangeFounder(idx, 'district', e.target.value)} fullWidth required />
                    </div>
                    <div className="col-span-2">
                        <TextField label="Provincia" value={person.address.province} onChange={(e) => handleChangeFounder(idx, 'province', e.target.value)} fullWidth required />
                    </div>
                    <div className="col-span-2">
                        <TextField label="Departamento" value={person.address.department} onChange={(e) => handleChangeFounder(idx, 'department', e.target.value)} fullWidth required />
                    </div>
                    <div className="col-span-2">
                        <TextField label="Dirección de Domicilio" value={person.address.name} onChange={(e) => handleChangeFounder(idx, 'address', e.target.value)} fullWidth required />
                    </div>
                    </div>
                </div>

                {(person.maritalStatus.civilStatus === 'casado' || person.maritalStatus.civilStatus === 'casada') && (
                    <section className="flex-1 p-8 mb-6 border-l border-gray-200">
                    <Title1 className="text-2xl">Información del Cónyuge</Title1>
                    <p className="text-sm">Información del cónyuge del Fundador</p>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <Button
                        variant={person.bienesMancomunados ? "" : "outline"}
                        onClick={() => handleChangeFounder(idx, 'bienesMancomunados', true)}
                      >
                        Con bienes mancomunados
                      </Button>
                      <Button
                        variant={!person.bienesMancomunados ? "" : "outline"}
                        onClick={() => handleChangeFounder(idx, 'bienesMancomunados', false)}
                      >
                        Con bienes separados
                      </Button>
                    </div>

                    {person.bienesMancomunados ? (
                        <div className="grid grid-cols-2 gap-4 mt-8">
                        <TextField 
                          disabled={!person.maritalStatus.moreInfo}
                          label="Primer Nombre" 
                          onChange={(e) => handleChangeFounder(idx, 'spouse-firstName', e.target.value, person.bienesMancomunados)} />
                        <TextField 
                          disabled={!person.maritalStatus.moreInfo}
                          label="Apellido" 
                          onChange={(e) => handleChangeFounder(idx, 'spouse-lastName', e.target.value, person.bienesMancomunados)} />
                        <TextField 
                          disabled={!person.maritalStatus.moreInfo}
                          label="DNI" 
                          type="number" 
                          onChange={(e) => handleChangeFounder(idx, 'spouse-dni', e.target.value, person.bienesMancomunados)} />
                        <FormControl>
                            <InputLabel>Género</InputLabel>
                            <Select
                            disabled={!person.maritalStatus.moreInfo}
                            value={person?.maritalStatus?.spouse?.gender || ''}
                            onChange={(e) => handleChangeFounder(idx, 'spouse-gender', e.target.value, person.bienesMancomunados)}
                            >
                            <MenuItem value="M">Masculino</MenuItem>
                            <MenuItem value="F">Femenino</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField 
                          disabled={!person.maritalStatus.moreInfo}
                          label="Nacionalidad" 
                          onChange={(e) => handleChangeFounder(idx, 'spouse-nationality', e.target.value, person.bienesMancomunados)} />
                        <TextField 
                          disabled={!person.maritalStatus.moreInfo}
                          label="Trabajo" 
                          className="col-span-2" 
                          onChange={(e) => handleChangeFounder(idx, 'spouse-job', e.target.value, person.bienesMancomunados)} />
                        <div>
                        <FormGroup>
                              <FormControlLabel control={
                                <Checkbox  
                                  checked={person.maritalStatus.moreInfo}
                                  onChange={(e)=>handleChangeFounder(idx,'moreInfo', e.target.checked)}
                                />
                              } label="Brindar información marital" />
                            </FormGroup>
                        </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 mt-8">
                        <TextField 
                          disabled={!person.maritalStatus.moreInfo}
                          label="Nro Partida Registral" 
                          type="number" 
                          onChange={(e) => handleChangeFounder(idx, 'marriageType-partidaRegistralNumber', e.target.value, person.bienesMancomunados)} />
                        <TextField 
                          disabled={!person.maritalStatus.moreInfo}
                          label="Oficina Registral (lugar)" 
                          placeholder="Provincia" onChange={(e) => handleChangeFounder(idx, 'marriageType-province', e.target.value, person.bienesMancomunados)} />
                        <div>
                        <FormGroup>
                              <FormControlLabel control={
                                <Checkbox  
                                  checked={person.maritalStatus.moreInfo}
                                  onChange={(e)=>handleChangeFounder(idx,'moreInfo', e.target.checked)}
                                />
                              } label="Brindar información marital" />
                            </FormGroup>
                        </div>
                        </div>
                    )}
                    </section>
                )}
            </section>
        </div>
      ))}

      <section className="my-4">
        <Button onClick={handleAddFounder} className="w-full py-4 cursor-pointer" variant="outline">
          Agregar Persona
        </Button>
        <div className="flex flex-row items-center gap-4">
          <Button
            className={'my-4 flex-1'}
            onClick={()=>handleClickBack()}
          >    
            Retroceder
          </Button>   
          <Button className="my-4 flex-1" onClick={() => handleSendFounder(founders)}>
            Continuar
          </Button>
        </div>
      </section>
    </section>
  );
}