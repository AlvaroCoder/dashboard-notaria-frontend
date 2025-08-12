import React from "react";
import FormPerson from "./FormPerson";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import Title1 from "../elements/Title1";
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";

const getMaritalOptions = (gender) => {
    if (gender === 'F') return ['soltera', 'casada', 'viuda', 'divorciada'];
    if (gender === 'M') return ['soltero', 'casado', 'viudo', 'divorciado'];
    return [];
};

export default function FormFounders({
    handleSendFounder=()=>{}
}) {
    const initialDataFounder = {
        firstName:"",
        lastName:"",
        dni:"",
        gender:"M",
        nationality:"Peruano",
        age:'',
        job:"",
        maritalStatus:{
            civilStatus:"soltero",
        },
        address:{
            name:"",
            district:"",
            province:"",
            department:""
        }
    };

    const [founders, setFounders] = React.useState([
        initialDataFounder
    ]);

    const handleChangeFounder=(index, field, value)=>{
        const list = [...founders]
        if (field === 'address') {
            list[index]['address']['name'] = value;
        }
        else if (field === 'district' || field === 'province' || field === 'department') {
            list[index]['address'][field] = value;
        } 
        else if (field === 'maritalStatus') {
            list[index]['maritalStatus']['civilStatus'] = value?.toLowerCase();
        }
        else{
            list[index][field] = value;
        }
        setFounders(list);
    }

    const handleAddFounder=(e)=>{
        e.preventDefault();
        setFounders([
            ...founders,
            initialDataFounder
        ]);
    }

    const handleDeleteFounder=(idx)=>{
        const newData = founders?.filter((_, index)=>idx!==index);
        setFounders(newData)
    }
    return(
        <section className="mt-8">

            <section>
                {
                    founders?.map((person, idx)=>
                    <div key={idx} className="min-w-3xl relative h-fit bg-white shadow rounded-lg">
                        {
                            idx > 0 &&
                            <Button
                                variant={"outline"}
                                className={"absolute top-0 px-8 py-5 right-0 bg-[#5F1926] cursor-pointer hover:bg-red-400 rounded-full text-white"}
                                onClick={()=>handleDeleteFounder(idx)}
                            >
                                <Trash2/>
                            </Button>
                        }
                        <div className="flex-1 p-8 mb-6">
                            <div className="mb-4">
                                <Title1 className="text-2xl">Fundador {idx+1}</Title1>
                                <p>Informacón del Fundador</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <TextField label="Primer Nombre" value={person?.firstName} onChange={(e)=>handleChangeFounder(idx, 'firstName', e.target.value)} fullWidth required />
                                <TextField label="Apellido" value={person?.lastName} onChange={(e)=>handleChangeFounder(idx, 'lastName', e.target.value)} fullWidth required />
                                <TextField label="DNI" value={person?.dni} onChange={(e)=>handleChangeFounder(idx, 'dni', e.target.value)} fullWidth required />
                                <FormControl>
                                    <InputLabel>Género</InputLabel>
                                    <Select
                                        value={person?.gender}
                                        label="Genero"
                                        onChange={(e)=>handleChangeFounder(idx, 'gender', e.target.value)}
                                    >
                                        <MenuItem value="M">Masculino</MenuItem>
                                        <MenuItem value="F">Femenino</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField label="Nacionalidad" value={person?.nationality} onChange={(e)=>handleChangeFounder(idx, 'nationality', e.target.value)} fullWidth required/>
                                <TextField label="Edad" name="age" type="number" value={person.age} onChange={(e)=>handleChangeFounder(idx, 'age', e.target.value)} fullWidth required />
                                <TextField label="Trabajo" value={person.job} onChange={(e)=>handleChangeFounder(idx, 'job', e.target.value)} />
                                <section className="w-full flex flex-row gap-2">
                                    <FormControl fullWidth>
                                        <InputLabel>Estado Civil</InputLabel>
                                        <Select
                                            value={person?.maritalStatus?.civilStatus || ''}
                                            label="Estado Civil"
                                            onChange={(e)=>handleChangeFounder(idx, 'maritalStatus', e.target.value)}
                                        >
                                            {
                                                getMaritalOptions(person?.gender)?.map((option, idx)=>(
                                                    <MenuItem key={idx} value={option}>{option?.charAt(0).toUpperCase() + option?.slice(1).toLowerCase()}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                </section>
                                <div className='col-span-2'>
                                    <TextField label="Distrito"  value={person.address?.district} onChange={(e) => handleChangeFounder(idx, 'district', e.target.value)} fullWidth required/>
                                </div>
                                <div className='col-span-2'> 
                                    <TextField label="Provincia" value={person.address?.province} onChange={(e) => handleChangeFounder(idx, 'province', e.target.value)} fullWidth required />
                                </div>   
                                <div className='col-span-2'>
                                    <TextField label="Departamento" value={person.address?.department} onChange={(e) => handleChangeFounder(idx, 'department', e.target.value)}  fullWidth required/>
                                </div>
                                <div className='col-span-2'>
                                    <TextField label="Direccion de Domicilio" value={person.address?.name} onChange={(e) => handleChangeFounder(idx, 'address', e.target.value)} fullWidth required/>
                                </div>
                            </div>
                        </div>

                    </div>)
                }
                <Button
                    onClick={handleAddFounder} 
                    className={"w-full py-4 cursor-pointer"}
                    variant={"outline"}
                    >
                    Agregar Persona
                </Button>
            </section>
            <Button
                className={'my-4 w-full'}
                onClick={()=>handleSendFounder(founders)}
            >
                Continuar
            </Button>
        </section>
    )
}