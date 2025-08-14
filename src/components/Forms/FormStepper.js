'use client';
import React, { useState, useCallback, useMemo } from 'react';
import FormPerson from './FormPerson';
import { Button } from '../ui/button';
import { checkEmptyFieldsFormCompra } from '@/common/checkInputsFormInmueble';
import { toast } from 'react-toastify';
import { RenderStepper } from './elements';
import { cn } from '@/lib/utils';

export default function FormStepper({
  tipoProceso = 'compra',
  handleSaveData = () => {},
}) {
  const stepsCompra = useMemo(() => ['Comprador(es)', 'Vendedor(es)'], []);
  const stepsVenta = useMemo(() => ['Vendedor(es)', 'Comprador(es)'], []);

  const [activeStep, setActiveStep] = useState(0);
  const [errores, setErrores] = useState([]);

  const [compradores, setCompradores] = useState([
    {
      firstName: "",
      lastName: "",
      dni: "",
      gender: "M",
      nationality: "Peruano",
      age: '19',
      job: "",
      maritalStatus: {
        civilStatus: "soltero",
        spouse: {}
      },
      bienesMancomunados: true, // 👈 aquí
      address: {
        name: "",
        district: "",
        province: "",
        department: ""
      }
    }
  ]);
  const [vendedores, setVendedores] = useState([{
    firstName: "",
    lastName: "",
    dni: "",
    gender: "M",
    nationality: "Peruano",
    age: '19',
    job: "",
    maritalStatus: {
      civilStatus: "soltero",
      spouse: {}
    },
    bienesMancomunados: true, // 👈 aquí
    address: {
      name: "",
      district: "",
      province: "",
      department: ""
    }
  }]);

  const steps = tipoProceso === 'compra' ? stepsCompra : stepsVenta;
  const data = useMemo(() => ({ compradores, vendedores }), [compradores, vendedores]);
  const setData = useCallback((personType, newData) => {
    if (personType === 'compradores') {
      setCompradores(newData);
    } else {
      setVendedores(newData);
    }
  }, []);

  const handleChange = useCallback((index, field, value, personType, bienesMancomunados = false) => {
    setData(personType, (prevData) => {
      const list = [...prevData];
      const person = { ...list[index] };
  
      // Lógica para el estado civil y campos relacionados.
      if (field === 'maritalStatus') {
        const civilStatus = value?.toLowerCase();
        person.maritalStatus.civilStatus = civilStatus;
  
        if (civilStatus === 'casado' || civilStatus === 'casada') {
          // Lógica para bienes separados (type: 1)
          if (!bienesMancomunados) {
            person.maritalStatus.marriageType = {
              type: 1,
              partidaRegistralNumber: person.maritalStatus.spouse?.partidaRegistralNumber || '',
              province: person.maritalStatus.spouse?.province || ''
            };
            person.maritalStatus.spouse = {}; // Se limpia el objeto del cónyuge
          }
          // Lógica para bienes mancomunados (type: 2)
          else {
            person.maritalStatus.marriageType = { type: 2 };
            if (!person.maritalStatus.spouse || Object.keys(person.maritalStatus.spouse).length === 0) {
              person.maritalStatus.spouse = {
                age: 19
              };
            }
          }
        } else {
          person.maritalStatus.spouse = {};
          if (person.maritalStatus.marriageType) {
            delete person.maritalStatus.marriageType;
          }
        }
      } 
      // Campos del cónyuge
      else if (field?.startsWith("spouse-")) {
        const fieldForm = field.split("-")[1];
        person.maritalStatus.spouse = {
          ...person.maritalStatus.spouse,
          [fieldForm]: value
        };
      } 
      // Campos de dirección
      else if (field === 'address' || ['district', 'province', 'department'].includes(field)) {
        person.address = {
          ...person.address,
          [field]: value,
          name: field === 'address' ? value : person.address.name,
        };
      } 
      // El resto de campos
      else {
        person[field] = value;
      }
      
      // Asigna la persona actualizada a la lista
      list[index] = person;
      return list;
    });
  }, [setData]);

  const addPerson = useCallback((personType) => {
    setData(personType, (prevData) => [...prevData, 
      {
        firstName: "",
        lastName: "",
        dni: "",
        gender: "M",
        nationality: "Peruano",
        age: '19',
        job: "",
        maritalStatus: {
          civilStatus: "soltero",
          spouse: {}
        },
        bienesMancomunados: true, // 👈 aquí
        address: {
          name: "",
          district: "",
          province: "",
          department: ""
        }
      }
    ]);
  }, [setData]);

  const deletePerson = useCallback((idx, personType) => {
    setData(personType, (prevData) => prevData.filter((_, index) => idx !== index));
  }, [setData]);

  const handleNext = useCallback(async (e) => {
    e.preventDefault();

    let dataToValidate = [];
    if (tipoProceso === 'compra') {
      if (activeStep === 0) dataToValidate = compradores;
      if (activeStep === 1) dataToValidate = vendedores;
    } else { // tipoProceso === 'venta'
      if (activeStep === 0) dataToValidate = vendedores;
      if (activeStep === 1) dataToValidate = compradores;
    }

    // Lógica de validación
    const validationErrors = checkEmptyFieldsFormCompra(dataToValidate);
    
    if (validationErrors.length > 0) {
      setErrores(validationErrors);
      toast('Formulario incompleto', { type: 'error' });
      return;
    }
    setErrores([]); // Limpiar errores si la validación es exitosa

    if (activeStep === steps.length - 1) {
      handleSaveData(compradores, vendedores);
    }

    setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
  }, [activeStep, compradores, vendedores, handleSaveData, steps.length, tipoProceso]);

  const handleBack = useCallback(() => {
    setActiveStep((prev) => prev - 1);
  }, []);

  const renderCurrentStepForm = () => {
    if (tipoProceso === 'compra') {
      if (activeStep === 0) {
        return (
          <>
            <FormPerson
              data={compradores}
              handleChange={(index, field, value) => handleChange(index, field, value, 'compradores')}
              type='compra'
              handleDelete={(idx) => deletePerson(idx, 'compradores')}
              errores={errores}
            />
            <div className='flex flex-row gap-2 mt-6'>
              <Button 
              variant={"outline"}
              onClick={() => addPerson('compradores')} className='flex-1 py-4'>
                Agregar Comprador
              </Button>
            </div>
          </>
        );
      }
      if (activeStep === 1) {
        return (
          <>
            <FormPerson
              data={vendedores}
              handleChange={(index, field, value) => handleChange(index, field, value, 'vendedores')}
              type='venta'
              handleDelete={(idx) => deletePerson(idx, 'vendedores')}
              errores={errores}
            />
            <div className='flex flex-row gap-2 mt-4'>
              <Button 
              variant={"outline"}
              onClick={() => addPerson('vendedores')} className='flex-1 py-4'>
                Agregar Vendedor
              </Button>
            </div>
          </>
        );
      }
      // Los casos 2 y 3 no tienen un FormPerson, por lo que no se muestran aquí.
    } else { // tipoProceso === 'venta'
      if (activeStep === 0) {
        return (
          <>
            <FormPerson
              data={vendedores}
              handleChange={(index, field, value) => handleChange(index, field, value, 'vendedores')}
              type='venta'
              handleDelete={(idx) => deletePerson(idx, 'vendedores')}
              errores={errores}
            />
            <div className='flex flex-row gap-2 mt-4'>
              <Button 
              variant={"outlined"}
              onClick={() => addPerson('vendedores')} className='flex-1 py-4'>
                Agregar Vendedor
              </Button>
            </div>
          </>
        );
      }
      if (activeStep === 1) {
        return (
          <>
            <FormPerson
              data={compradores}
              handleChange={(index, field, value) => handleChange(index, field, value, 'compradores')}
              type='compra'
              handleDelete={(idx) => deletePerson(idx, 'compradores')}
              errores={errores}
            />
            <div className='flex flex-row gap-2 mt-4'>
              <Button onClick={() => addPerson('compradores')} className='flex-1 py-4'>
                Agregar Comprador
              </Button>
            </div>
          </>
        );
      }
    }
    return null;
  };

  return (
    <section>
      <RenderStepper steps={steps} active={activeStep} />
      <section className='mt-8'>{renderCurrentStepForm()}</section>

      <div className={`mt-6 ${tipoProceso === 'compra' ? 'flex flex-row gap-4' : 'w-full'}`}>
        {tipoProceso === 'compra' && (
          <Button 
          className={"flex-1"}
          disabled={activeStep === 0} onClick={handleBack}>
            Atrás
          </Button>
        )}
        <Button
          onClick={handleNext}
          className={cn(tipoProceso === 'venta' ? 'w-full' : '','flex-1')}
        >
          {activeStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
        </Button>
      </div>
    </section>
  );
}