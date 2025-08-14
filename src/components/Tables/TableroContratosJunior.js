import React, { useState, useMemo } from 'react'
import Title1 from '../elements/Title1'
import { Button } from '../ui/button'
import { LayoutGrid, List } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import Link from 'next/link';
import TableCellClient from './TableCells/TableCellClient';
import ButtonDownloadPdf from '../elements/ButtonDownloadPdf';
import TableCellStatus from './TableCells/TableCellStatus';
import { camelCaseToTitle, cn } from '@/lib/utils';
import { statusContracts } from '@/lib/commonJSON';
import { formatearFecha } from '@/lib/fechas';

export default function TableroContratosJunior({
    dataContracts = []
}) {
    const [vista, setVista] = useState("tabla");
    const [filterType, setFilterType] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterDate, setFilterDate] = useState("");

    // Extraer tipos únicos de contratos
    const contractTypes = useMemo(() => {
        const types = [...new Set(dataContracts.map(c => c.contractType).filter(Boolean))];
        return types;
    }, [dataContracts]);

    // Filtrar datos
    const filteredContracts = useMemo(() => {
        return dataContracts.filter(contract => {
            const matchType = filterType ? contract.contractType === filterType : true;
            const matchStatus = filterStatus ? String(contract.status) === String(filterStatus) : true;
            const matchDate = filterDate ? contract?.datesDocument?.processInitiate === filterDate : true;
            return matchType && matchStatus && matchDate;
        });
    }, [dataContracts, filterType, filterStatus, filterDate]);

    return (
        <div className='w-full rounded-sm shadow-sm bg-white p-4'>
            <section className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                <div>
                    <Title1 className='text-2xl'>
                        Gestion de Contratos Junior
                    </Title1>
                    <p className='text-sm text-gray-500'>Tablero de gestion de los contratos para el junior</p>
                </div>
                <div className='flex gap-2'>
                    <Button
                        className='text-[#0C1019] text-center'
                        variant={vista === "tabla" ? "outline" : 'ghost'}
                        onClick={() => setVista("tabla")}
                    >
                        <List className='w-4 h-8 text-lg' />
                    </Button>
                    <Button
                        className='text-[#0C1019]'
                        variant={vista === "canvas" ? "outline" : "ghost"}
                        onClick={() => setVista("canvas")}
                    >
                        <LayoutGrid className='w-4 h-8 text-lg'/>
                    </Button>
                </div>
            </section>

            {/* Filtros */}
            <section className='mt-4 flex flex-col sm:flex-row gap-3'>
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="border p-2 rounded-sm"
                >
                    <option value="">Todos los tipos</option>
                    {contractTypes.map(type => (
                        <option key={type} value={type}>{camelCaseToTitle(type)}</option>
                    ))}
                </select>

                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border p-2 rounded-sm"
                >
                    <option value="">Todos los estados</option>
                    {statusContracts.map(status => (
                        <option key={status.id} value={status.id}>{status.title}</option>
                    ))}
                </select>

                <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="border p-2 rounded-sm"
                />
            </section>

            {/* Vista tabla */}
            {vista === "tabla" && (
                <div className='mt-8 overflow-auto rounded-lg border'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tipo de Contrato</TableHead>
                                <TableHead>Usuario</TableHead>
                                <TableHead>Minuta</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Fecha Creacion</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredContracts.length > 0 ? (
                                filteredContracts.map((contrato, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>
                                            <Link 
                                                href={`/dashboard/contracts/${
                                                    contrato?.contractType?.toLowerCase() === 'compraventapropiedad'
                                                    ? 'inmueble'
                                                    : contrato?.contractType?.toLowerCase() === 'compraventavehiculo'
                                                    ? 'vehiculo'
                                                    : contrato?.contractType?.toLowerCase()
                                                }/${contrato?.id}`}
                                                className="text-blue-600 underline"
                                            >
                                                {camelCaseToTitle(contrato?.contractType)}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <TableCellClient clientId={contrato?.clientId} />
                                        </TableCell>
                                        <TableCell>
                                            {contrato?.contractType !== 'compraVentaVehiculo' && <ButtonDownloadPdf minutaDirectory={contrato?.minutaDirectory} />}
                                        </TableCell>
                                        <TableCell>
                                            <TableCellStatus idStatus={contrato?.status} />
                                        </TableCell>
                                        <TableCell>
                                            {formatearFecha(contrato?.datesDocument?.processInitiate)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className='text-center h-48'>
                                        <Title1>No hay documentos disponibles</Title1>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Vista canvas */}
            {vista === "canvas" && (
                <section className='grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-8'>
                    {filteredContracts.length > 0 ? (
                        filteredContracts.map((documento, idx) => (
                            <div key={idx} className='p-4 border rounded-md shadow-sm'>
                                <Title1>{camelCaseToTitle(documento?.contractType)}</Title1>
                                {statusContracts
                                    .filter(({ id }) => id === documento?.status)
                                    .map((item, key) => (
                                        <p key={key} className={cn('px-2 py-1 w-fit rounded-sm text-sm', item?.bgColor)}>
                                            {item?.title}
                                        </p>
                                    ))
                                }
                                <section className='mt-2 py-2'>
                                    <p>Pago : {documento?.processPayment}</p>
                                    <p>Tipo : <b>{documento?.contractType}</b></p>
                                    <p>Fecha <b>{formatearFecha(documento?.datesDocument?.processInitiate)}</b></p>
                                </section>
                            </div>
                        ))
                    ) : (
                        <div className='col-span-4 flex flex-col items-center justify-center h-48 border-3 border-gray-400 border-dotted rounded-sm'>
                            <Title1>No hay documentos disponibles</Title1>
                            <p className='text-sm text-gray-600'>No se han subido documentos</p>
                        </div>
                    )}
                </section>
            )}
        </div>
    )
}