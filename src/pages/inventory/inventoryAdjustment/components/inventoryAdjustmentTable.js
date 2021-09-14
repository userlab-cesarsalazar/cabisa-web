import React from 'react'
import { Table, Col, Button, Row, Card, DatePicker } from 'antd'
import { validatePermissions } from '../../../../utils'
import { permissions, actions } from '../../../../commons/types'

function InventoryAdjustmentTable(props) {
  const can = validatePermissions(permissions.INVENTARIO)

  return (
    <>
      <Row gutter={16}>
        <Col xs={9} sm={9} md={9} lg={9}>
          <DatePicker
            style={{ width: '100%', height: '40px', borderRadius: '8px' }}
            placeholder='Buscar por fecha'
            format='DD-MM-YYYY'
            onChange={props.handleFiltersChange('created_at')}
          />
        </Col>
        <Col xs={9} sm={9} md={9} lg={9}></Col>
        <Col xs={6} sm={6} md={6} lg={6} style={{ textAlign: 'right' }}>
          {can(actions.CREATE) && (
            <Button
              className='title-cabisa new-button'
              onClick={props.goCreateNewItem}
            >
              Nuevo Item
            </Button>
          )}
        </Col>
      </Row>
      <Row>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Card className={'card-border-radius margin-top-15'}>
            <Row>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Table
                  scroll={{ y: 320 }}
                  className={'CustomTableClass'}
                  dataSource={props.dataSource}
                  columns={props.columns}
                  pagination={{ pageSize: 5 }}
                  loading={props.loading}
                  rowKey='id'
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default InventoryAdjustmentTable
