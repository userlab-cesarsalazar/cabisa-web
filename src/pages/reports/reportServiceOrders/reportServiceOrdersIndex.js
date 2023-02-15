import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import HeaderPage from '../../../components/HeaderPage'
import ReportServiceOrderTable from './components/reportServiceOrderTable'
import SalesDetail from '../../sales/components/commons/salesDetail'
import { permissions } from '../../../commons/types'

function ReportServiceOrders() {

const [isDrawerVisible, setIsDrawerVisible] = useState(false)
const [exportExcelAction, setExportExcelAction] = useState(false)
  const history = useHistory()

  const showDrawer = () => setIsDrawerVisible(true)

  const hideDrawer = () => setIsDrawerVisible(false)

  const NewNoteShipping = () => history.push('/serviceNoteView')

  const exportDataAction = () => {        
    setExportExcelAction(!exportExcelAction)
  }

  return (
    <>
    <HeaderPage 
    title={'Reporte - Ordenes de servicio en desarrollo'} 
    titleButton={'Exportar'}
    permissions={permissions.REPORTES}
    showDrawer={exportDataAction}
    />
      <ReportServiceOrderTable        
        permissions={permissions.REPORTES}
        newNote={NewNoteShipping}
        isDrawerVisible={isDrawerVisible}
        showDrawer={showDrawer}        
        isAdmin={true}
        canEditAndCreate={true}
        history={history}
        exportExcel={exportExcelAction}
        endExcelCreation={()=>setExportExcelAction(false)}
      />
      <SalesDetail
        closable={hideDrawer}
        visible={isDrawerVisible}
        isAdmin={false}
        canEditAndCreate={false}
      />
    </>
  )
}
export default ReportServiceOrders
