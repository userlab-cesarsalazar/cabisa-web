import React from 'react'
import HeaderPage from '../../../components/HeaderPage'
import ReportMachineTable from './components/reportMachineTable'

const dataDummy = [
  {
    code: '12341-asdf-213412',
    type: 'Maquina',
    status: 'Activo',
    id: 1,
  },
  {
    code: '12341-asdf-213412',
    type: 'Maquina',
    status: 'Activo',
    id: 2,
  },
  {
    code: '12341-asdf-213412',
    type: 'Equipo',
    status: 'InActivo',
    id: 3,
  },
]
function ReportMachine(props) {
  return (
    <>
      <HeaderPage
        titleButton={''}
        title={'Reporte - Historial Maquinas y Equipo'}
      />
      <ReportMachineTable dataSource={dataDummy} />
    </>
  )
}

export default ReportMachine
