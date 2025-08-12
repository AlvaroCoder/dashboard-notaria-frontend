import React from "react";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import Title1 from "../elements/Title1";
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { cn } from "@/lib/utils";

const getMaritalOptions = (gender) => {
  if (gender === 'F') return ['soltera', 'casada', 'viuda', 'divorciada'];
  if (gender === 'M') return ['soltero', 'casado', 'viudo', 'divorciado'];
  return [];
};

export default function FormFounders({ handleSendFounder = () => {} }) {
  const initialDataFounder = {
    firstName: "",
    lastName: "",
    dni: "",
    gender: "M",
    nationality: "Peruano",
    age: '',
    job: "",
    maritalStatus: {
      civilStatus: "soltero",
      spouse: {}
    },
    address: {
      name: "",
      district: "",
      province: "",
      department: ""
    }
  };

  const [founders, setFounders] = React.useState([initialDataFounder]);
  const [bienesMancomunados, setBienesMancomunados] = React.useState(true);

  const handleChangeFounder = (index, field, value, bienes = bienesMancomunados) => {
    const list = [...founders];

    // Campos del cónyuge
    if (field?.startsWith("spouse-")) {
      const fieldForm = field.split("-")[1];
      if (!list[index].maritalStatus.spouse) {
        list[index].maritalStatus.spouse = {};
      }
      list[index].maritalStatus.spouse[fieldForm] = value;
    }
    else if (field === 'address') {
      list[index].address.name = value;
    }
    else if (["district", "province", "department"].includes(field)) {
      list[index].address[field] = value;
    }
    else if (field === 'maritalStatus') {
      list[index].maritalStatus.civilStatus = value?.toLowerCase();
      const isCasado = value?.toLowerCase() === 'casado' || value?.toLowerCase() === 'casada';
        if (isCasado) {
            list[index].maritalStatus.marriageType = { type : bienes ? 1 : 2}
        }
    }
    else {
      list[index][field] = value;
    }

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
                    <TextField label="Edad" type="number" value={person.age} onChange={(e) => handleChangeFounder(idx, 'age', e.target.value)} fullWidth required />
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
                        variant={bienesMancomunados ? "" : "outline"}
                        onClick={() => setBienesMancomunados(true)}
                        >
                        Con bienes mancomunados
                        </Button>
                        <Button
                        variant={!bienesMancomunados ? "" : "outline"}
                        onClick={() => setBienesMancomunados(false)}
                        >
                        Con bienes separados
                        </Button>
                    </div>

                    {bienesMancomunados ? (
                        <div className="grid grid-cols-2 gap-4 mt-8">
                        <TextField label="Primer Nombre" onChange={(e) => handleChangeFounder(idx, 'spouse-firstName', e.target.value, bienesMancomunados)} />
                        <TextField label="Apellido" onChange={(e) => handleChangeFounder(idx, 'spouse-lastName', e.target.value, bienesMancomunados)} />
                        <TextField label="DNI" type="number" onChange={(e) => handleChangeFounder(idx, 'spouse-dni', e.target.value, bienesMancomunados)} />
                        <FormControl>
                            <InputLabel>Género</InputLabel>
                            <Select
                            value={person?.maritalStatus?.spouse?.gender || ''}
                            onChange={(e) => handleChangeFounder(idx, 'spouse-gender', e.target.value, bienesMancomunados)}
                            >
                            <MenuItem value="M">Masculino</MenuItem>
                            <MenuItem value="F">Femenino</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField label="Nacionalidad" onChange={(e) => handleChangeFounder(idx, 'spouse-nationality', e.target.value, bienesMancomunados)} />
                        <TextField label="Trabajo" className="col-span-2" onChange={(e) => handleChangeFounder(idx, 'spouse-job', e.target.value, bienesMancomunados)} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 mt-8">
                        <TextField label="Nro Partida Registral" type="number" onChange={(e) => handleChangeFounder(idx, 'spouse-partidaRegistralNumber', e.target.value, bienesMancomunados)} />
                        <TextField label="Provincia de la Boda" onChange={(e) => handleChangeFounder(idx, 'spouse-province', e.target.value, bienesMancomunados)} />
                        </div>
                    )}
                    </section>
                )}
            </section>
        </div>
      ))}

      <Button onClick={handleAddFounder} className="w-full py-4 cursor-pointer" variant="outline">
        Agregar Persona
      </Button>
      <Button className="my-4 w-full" onClick={() => handleSendFounder(founders)}>
        Continuar
      </Button>
    </section>
  );
}