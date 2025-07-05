import React from 'react'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../ui/table'
import { Skeleton } from '@mui/material'

export default function TableroCarga({
    headers=[],
    row=6
}) {
  return (
    <Table>
        <TableHeader>
            <TableRow>
                {
                    headers?.map((item, idx)=>
                    <TableCell
                        key={idx}
                    >   
                        {item?.value}
                    </TableCell>)
                }
            </TableRow>
        </TableHeader>
        <TableBody>
            {
                Array.from({length : row},(_, i)=>
                <TableRow key={i}>
                    {
                        headers?.map((_,idx)=>
                        <TableCell key={idx}>
                            <Skeleton variant='rounded' />
                        </TableCell>
                        )
                    }
                </TableRow>
                )
            }
        </TableBody>
    </Table>
  )
};
