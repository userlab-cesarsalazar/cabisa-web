import React, { useState } from 'react'
import { Modal, Row, Col, DatePicker, message } from 'antd'
import HeaderPage from '../../../components/HeaderPage'
import ReportInventoryTable from './components/reportInventoryTable'
import { permissions } from '../../../commons/types'

const { RangePicker } = DatePicker

function ReportInventory() {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalDateRange, setModalDateRange] = useState(null)
  const [exportReport, setExportReport] = useState(false)

  const handleGenerateReport = () => {
    if (!modalDateRange)
      return message.warning('Debe ingresar un rango de fechas')

    setIsModalVisible(false)
  }

  return (
    <>
      <Modal
        style={{ textAlign: 'center' }}
        title='Por favor seleccione un rango de fechas para el reporte'
        visible={isModalVisible}
        closable={false}
        destroyOnClose
        onOk={handleGenerateReport}
        onCancel={() => setIsModalVisible(false)}
        okText='Generar Reporte'
        cancelText='Cancelar'
      >
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={24}>
            <RangePicker
              style={{ width: '100%', height: '40px', borderRadius: '8px' }}
              format='DD-MM-YYYY'
              onChange={setModalDateRange}
            />
          </Col>
        </Row>
      </Modal>

      <HeaderPage
      titleButton={'Exportar'} 
      title={'Reporte - Inventario'}
      permissions={permissions.REPORTES}
      showDrawer={()=>setExportReport(!exportReport)}      
       />
      
      <ReportInventoryTable
        modalDateRange={modalDateRange}
        isModalVisible={isModalVisible}
        exportData={exportReport}
        exportDataResponse={()=>setExportReport(false)}        
      />
    </>
  )
}

export default ReportInventory
