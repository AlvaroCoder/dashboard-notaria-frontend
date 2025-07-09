import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader } from '../ui/table'
import { Skeleton, TableRow } from '@mui/material'

export default function TableLoading({
    rows=5,
    headers=[],
}) {
  return (
    <Table>
        <TableHeader>
            <TableRow>
                {
                    headers?.map((header, idx) => (
                        <TableHead key={idx} className="px-4 py-2 text-left">
                            {header?.value}
                        </TableHead>
                    ))
                }
            </TableRow>
        </TableHeader>
        <TableBody>
            {
                Array.from({ length: rows }, (_, idx) => (
                    <TableRow key={idx} className="animate-pulse">
                        {
                            headers?.map((_, cellIdx) => (
                                <TableCell key={cellIdx} className="px-4 py-2">
                                    <Skeleton   height={20}/>
                                </TableCell>
                            ))
                        }
                    </TableRow>
                ))
            }
        </TableBody>
    </Table>
  )
}
