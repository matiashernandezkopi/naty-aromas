'use client'

import React from 'react'
import { VentasTable } from '../components/ventasTable'
import { VentasForm } from '../components/ventasForm'

export default function VentasPage() {
  return (
    <div className='flex w-screen justify-between gap-1 p-2'>
      <VentasTable/>
      <VentasForm/>

    </div>
  )
}

