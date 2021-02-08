import React from 'react'
import HeaderPage from '../../../components/HeaderPage'
import ReportClientTable from './components/reportClientTable'

const dataDummy = [
  {
    code: '12341-asdf-213412',
    name: 'Nombre cliente ejemplo',
    Type: 'Persona Individual',
    reference: 'INV00123',
    charges: '100.00',
    payments: '1200.00',
    balance: '5000.00',
    status: 'Activo',
    id: 1,
  },
  {
    code: '12341-asdf-213412',
    name: 'Nombre cliente ejemplo',
    Type: 'Persona Individual',
    reference: 'INV00123',
    charges: '100.00',
    payments: '1200.00',
    balance: '5000.00',
    status: 'Activo',
    id: 2,
  },
  {
    code: '12341-asdf-213412',
    name: 'Nombre cliente ejemplo',
    Type: 'Persona Individual',
    reference: 'INV00123',
    charges: '100.00',
    payments: '1200.00',
    balance: '5000.00',
    status: 'InActivo',
    id: 3,
  },
]
function ReportClient(props) {
  return (
    <>
      <HeaderPage titleButton={''} title={'Reporte - Clientes'} />
      <ReportClientTable dataSource={dataDummy} />
    </>
  )
}

export default ReportClient
