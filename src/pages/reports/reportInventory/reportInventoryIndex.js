import React, { useState } from 'react'
import { Modal, Button, Row, Col, DatePicker, message } from 'antd'
import HeaderPage from '../../../components/HeaderPage'
import ReportInventoryTable from './components/reportInventoryTable'

const { RangePicker } = DatePicker

function ReportInventory() {
  const [isModalVisible, setIsModalVisible] = useState(true)
  const [modalDateRange, setModalDateRange] = useState(null)

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
        footer={
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button type='primary' size='large' onClick={handleGenerateReport}>
              Generar reporte
            </Button>
          </div>
        }
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

      <HeaderPage titleButton={''} title={'Reporte - Inventario'} />
      <ReportInventoryTable
        modalDateRange={modalDateRange}
        isModalVisible={isModalVisible}
      />
    </>
  )
}

export default ReportInventory
