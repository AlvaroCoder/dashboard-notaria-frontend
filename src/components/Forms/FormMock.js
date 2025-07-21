'use client'
import { useContextCard } from '@/context/ContextCard';
import React, {  useState } from 'react'

export function RenderStepsForm() {
  
}

export function FormUsers() {
  
}

export default function FormMock({

}) {

    const {tipoProceso} = useContextCard();
    const stepsCompra = ['Comprador(es)','Vendedor(es)'];
    const stepsVenta = ['Vendedor(es)', 'Comprador(es)'];
    const [activeStepCompra, setActiveStepCompra] = useState(0);
    const [activeStepVenta, setActiveStepVenta] = useState(0);
    const [errorCompra, setErrorCompra] = useState([]);
    const [errorVenta, setErrorVenta] = useState([]);
    const [compradores, setCompradores] = useState([
        {
            firstName: '',
            lastName: '',
            dni: '',
            gender: '',
            nationality: '',
            age: '',
            job: '',
            maritalStatus: {
              civilStatus : ''
            },
            address: {
              district : "",
              province : "",
              department : "",
              name : ""
            },
            job :''
        }
    ]);

    const [vendedores, setVendedores] = useState([
        {
            firstName: '',
            lastName: '',
            dni: '',
            gender: '',
            nationality: '',
            age: '',
            job: '',
            maritalStatus: {
              civilStatus : ''
            },
            address: {
              district : "",
              province : "",
              department : "",
              name : ""
            },
            job :''
        }
    ]);

    const handleChange=(index, field, value, type='venta')=>{
        const list = type === 'venta' ? [...vendedores] : [...compradores];
        if (field === 'district' || field === 'province' || field === 'department' || field === 'address') {
            field === 'address' ? list[index]['address']['name'] = value : list[index]['address'][field] = value;;
        }
        else if (field === 'maritalStatus') {
            list[index]['maritalStatus']['civilStatus'] = value?.toLowerCase();
          }
          else{
            list[index][field] = value;
          }
        type === 'venta' ? setVendedores(list) : setCompradores(list);
    };
    const addPerson = (type = 'venta') => {
        const newPerson = {
          firstName: '',
          lastName: '',
          dni: '',
          gender: '',
          nationality: '',
          age: '',
          job: '',
          maritalStatus: {
            value : ""
          },
          address: {
            name : "",
            district : "",
            province : "",
            department : ""
        }
        };
        type === 'venta' ? setVendedores([...vendedores, newPerson]) : setCompradores([...compradores, newPerson]);
    };

    const deletePerson =(idx, type='vendedor')=>{
        const currentData = type === 'vendedor' ? [...vendedores] : [...compradores];
        const newData = currentData?.filter((_, index)=>idx !== index);        
        type === 'vendedor' ? setVendedores(newData) : setCompradores(newData);
    }

    switch (tipoProceso) {
        case 'compra':
            
            break;
    
        default:
            break;
    }
}
