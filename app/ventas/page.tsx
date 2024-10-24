'use client'

import React from 'react'
import { VentasTable } from '../components/ventasTable'
import { VentasForm } from '../components/ventasForm'

export default function VentasPage() {
  return (
    <div>
      <VentasTable/>
      <VentasForm/>

    </div>
  )
}

