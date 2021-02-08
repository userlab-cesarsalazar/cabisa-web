import React from 'react'
import HeaderPage from '../../../components/HeaderPage'
import ReportInventoryTable from './components/reportInventoryTable'

const dataDummy = [
  {
    code: '12341-asdf-213412',
    serie: 'A5',
    price: '10,000.00',
    status: 'Activo',
    id: 1,
  },
  {
    code: '12341-asdf-213412',
    serie: 'A5',
    price: '10,000.00',
    status: 'Activo',
    id: 2,
  },
  {
    code: '12341-asdf-213412',
    serie: 'A5',
    price: '10,000.00',
    status: 'InActivo',
    id: 3,
  },
]
function ReportInventory(props) {
  return (
    <>
      <HeaderPage titleButton={''} title={'Reporte - Inventario'} />
      <ReportInventoryTable dataSource={dataDummy} />
    </>
  )
}

export default ReportInventory
