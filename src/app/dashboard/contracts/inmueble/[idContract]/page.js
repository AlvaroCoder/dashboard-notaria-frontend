'use client'
import { useParams } from 'next/navigation'
import React from 'react'

export default function Page() {
    const {idContract} = useParams();
  return (
    <div>Page</div>
  )
}
