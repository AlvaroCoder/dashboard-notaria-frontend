'use client';
import React, { useState, useCallback, useMemo } from 'react';
import FormPerson from './FormPerson';
import { Button } from '../ui/button';
import { checkEmptyFieldsFormCompra } from '@/common/checkInputsFormInmueble';
import { toast } from 'react-toastify';
import { RenderStepper } from './elements';
import { cn } from '@/lib/utils';

const mkPerson = () => ({
  firstName: '',
  lastName: '',
  dni: '',
  gender: 'M',
  nationality: 'Peruano',
  age: '19',
  job: '',
  bienesMancomunados: true,
  address: { name: '', district: '', province: '', department: '' },
  maritalStatus: { 
    moreInfo : false,
    civilStatus: 'soltero',
    spouse : null
  } // minúsculas para UI
});

export default function FormStepper({
  tipoProceso = 'compra',
  handleSaveData = () => {},
  backActiveStep=()=>{}
}) {
  const stepsCompra = useMemo(() => ['Comprador(es)', 'Vendedor(es)'], []);
  const stepsVenta = useMemo(() => ['Vendedor(es)', 'Comprador(es)'], []);
  const steps = tipoProceso === 'compra' ? stepsCompra : stepsVenta;

  const [activeStep, setActiveStep] = useState(0);
  const [errores, setErrores] = useState([]);

  const [compradores, setCompradores] = useState([mkPerson()]);
  
  const [vendedores, setVendedores] = useState([mkPerson()]);

  const setData = useCallback((personType, updater) => {
    if (personType === 'compradores') {
      setCompradores((prev) => (typeof updater === 'function' ? updater(prev) : updater));
    } else {
      setVendedores((prev) => (typeof updater === 'function' ? updater(prev) : updater));
    }
  }, []);
  console.log(compradores);
  
  /**
   * Maneja TODOS los cambios de campos (normales y anidados)
   * field puede ser:
   *  - 'firstName', 'dni', etc.
   *  - 'maritalStatus'
   *  - 'bienesMancomunados'
   *  - 'address-*' (name, district, province, department)
   *  - 'spouse-*'  (firstName, dni, gender, nationality, age, job)
   *  - 'marriageType-*' (partidaRegistralNumber, province)
   */
  
  const handleChange = useCallback((index, field, value, personType, bienesMancomunados = false) => {
    setData(personType, (prevData) => {
      const list = [...prevData];
      const person = { ...list[index] };

      // Asegurar contenedores
      if (!person.address) person.address = {};
      if (!person.maritalStatus) person.maritalStatus = {};

      if (field === 'moreInfo') {
        person.maritalStatus.moreInfo = Boolean(value);
        person.maritalStatus.spouse = null;
      }
      // Cambiar tipo de bienes
      if (field === 'bienesMancomunados') {
        person.bienesMancomunados = Boolean(value);
        const civil = (person.maritalStatus.civilStatus || '').toLowerCase();
        const isCasado = civil === 'casado' || civil === 'casada';
        if (isCasado) {
          if (person.bienesMancomunados) {
            // Mancomunados => type 2 + spouse presente
            person.maritalStatus.marriageType = { type: 2 };
            if (!person.maritalStatus.spouse) {
              person.maritalStatus.spouse = {  };
            }
          } else {
            // Separados => type 1 + sin spouse
            person.maritalStatus.marriageType = {
              type: 1,
              partidaRegistralNumber: person.maritalStatus.marriageType?.partidaRegistralNumber || '',
              province: person.maritalStatus.marriageType?.province || ''
            };
            delete person.maritalStatus.spouse;
          }
        }
        list[index] = person;
        return list;
      }

      // Cambio de estado civil
      if (field === 'maritalStatus') {
        const civil = String(value || '').toLowerCase();
        person.maritalStatus.civilStatus = civil;
        const isCasado = civil === 'casado' || civil === 'casada';

        if (isCasado) {
          person.maritalStatus.moreInfo = true;
          if (bienesMancomunados) {
            person.maritalStatus.marriageType = { type: 2 };
            if (!person.maritalStatus.spouse) {
              person.maritalStatus.spouse = {  };
            }
          } else {
            person.maritalStatus.marriageType = {
              type: 1,
              partidaRegistralNumber: person.maritalStatus.marriageType?.partidaRegistralNumber || '',
              province: person.maritalStatus.marriageType?.province || ''
            };
            delete person.maritalStatus.spouse;
          }
        } else {
          delete person.maritalStatus.spouse;
          delete person.maritalStatus.marriageType;
        }
        list[index] = person;
        return list;
      }

      // spouse-*
      if (field?.startsWith('spouse-')) {
        const key = field.split('-')[1];
        if (!person.maritalStatus.spouse) person.maritalStatus.spouse = {};
        person.maritalStatus.spouse[key] = value;
        list[index] = person;
        return list;
      }

      // marriageType-*
      if (field?.startsWith('marriageType-')) {
        const key = field.split('-')[1];
        if (!person.maritalStatus.marriageType) person.maritalStatus.marriageType = { type: 1 };
        person.maritalStatus.marriageType[key] = value;
        list[index] = person;
        return list;
      }

      // address-*
      if (field?.startsWith('address-')) {
        const key = field.split('-')[1];
        person.address[key] = value;
        list[index] = person;
        return list;
      }

      // Campos planos
      person[field] = value;
      list[index] = person;
      return list;
    });
  }, [setData]);



  const addPerson = useCallback((personType) => {
    setData(personType, (prev) => [...prev, mkPerson()]);
  }, [setData]);

  const deletePerson = useCallback((idx, personType) => {
    setData(personType, (prev) => prev.filter((_, i) => i !== idx));
  }, [setData]);

  const handleNext = useCallback((e) => {
    e.preventDefault();
    
    
    const dataToValidate =
      tipoProceso === 'compra'
        ? activeStep === 0 ? compradores : vendedores
        : activeStep === 0 ? vendedores : compradores;
        console.log(dataToValidate);
    const validationErrors = checkEmptyFieldsFormCompra(dataToValidate);
    if (validationErrors.length > 0) {
      setErrores(validationErrors);
      toast('Formulario incompleto', { type: 'error', position : 'bottom-right' });
      return;
    }
    setErrores([]);

    if (activeStep === steps.length - 1) {
      // Normaliza civilStatus capitalizado al enviar
      const normalize = (arr) =>
        arr.map((p) => {
          const cloned = JSON.parse(JSON.stringify(p));
          if (cloned.maritalStatus?.civilStatus) {
            const cs = cloned.maritalStatus.civilStatus;
            cloned.maritalStatus.civilStatus = cs.charAt(0).toUpperCase() + cs.slice(1);
          }
          return cloned;
        });
      handleSaveData(normalize(compradores), normalize(vendedores));
    } else {
      setActiveStep((prev) => prev + 1);
    }
  }, [activeStep, compradores, vendedores, steps.length, tipoProceso, handleSaveData]);

  const handleBack = useCallback(() => setActiveStep((p) => p - 1), []);

  const renderCurrentStepForm = () => {
    const commonProps = { handleChange, handleDelete: deletePerson, errores };
    if (tipoProceso === 'compra') {
      if (activeStep === 0) {
        return (
          <>
            <FormPerson data={compradores} type="compra" {...commonProps} />
            <div className="flex flex-row gap-2 mt-6">
              <Button variant="outline" onClick={() => addPerson('compradores')} className="flex-1 py-4">
                Agregar Comprador
              </Button>
            </div>
          </>
        );
      }
      if (activeStep === 1) {
        return (
          <>
            <FormPerson data={vendedores} type="venta" {...commonProps} />
            <div className="flex flex-row gap-2 mt-6">
              <Button variant="outline" onClick={() => addPerson('vendedores')} className="flex-1 py-4">
                Agregar Vendedor
              </Button>
            </div>
          </>
        );
      }
    } else {
      if (activeStep === 0) {
        return (
          <>
            <FormPerson data={vendedores} type="venta" {...commonProps} />
            <div className="flex flex-row gap-2 mt-6">
              <Button variant="outline" onClick={() => addPerson('vendedores')} className="flex-1 py-4">
                Agregar Vendedor
              </Button>
            </div>
          </>
        );
      }
      if (activeStep === 1) {
        return (
          <>
            <FormPerson data={compradores} type="compra" {...commonProps} />
            <div className="flex flex-row gap-2 mt-6">
              <Button variant="outline" onClick={() => addPerson('compradores')} className="flex-1 py-4">
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
      <section className="mt-8">{renderCurrentStepForm()}</section>

      <div className={cn('mt-6', (tipoProceso === 'compra' || tipoProceso == 'venta') ? 'flex flex-row gap-4' : 'w-full')}>
        {(tipoProceso === 'compra' || tipoProceso == 'venta')  && (
          <Button className="flex-1" disabled={activeStep === 0} onClick={handleBack}>
            Atrás
          </Button>
        )}
        <Button onClick={handleNext} className={cn(tipoProceso === 'venta' ? 'w-full' : '', 'flex-1')}>
          {activeStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
        </Button>
      </div>

      <section>
        <Button
          className={'w-full mt-6'}
          onClick={()=>backActiveStep()}
        >
          Retroceder a la pantalla anterior
        </Button>
      </section>
    </section>
  );
}