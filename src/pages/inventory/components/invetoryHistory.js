import React from 'react'
import moment from 'moment'
import { Row, Col, Divider, Typography } from 'antd'
import DynamicTable from '../../../components/DynamicTable'
import Tag from '../../../components/Tag'

const { Title } = Typography

function InventoryHistory(props) {
  const columnsHistory = [
    {
      width: 180,
      title: 'Fecha',
      dataIndex: 'created_at', // Field that is goint to be rendered
      key: 'created_at',
      render: text => (
        <div>{text ? moment(text).format('DD-MM-YYYY') : null}</div>
      ),
    },
    {
      title: 'Tipo de Operacion',
      dataIndex: 'operation_type', // Field that is goint to be rendered
      key: 'operation_type',
      render: text => (
        <Tag
          type='operationsTypes'
          value={text}
          size={'large'}
          placeholder={'Tipo de Operacion'}
        />
      ),
    },
    {
      title: 'Cantidad',
      dataIndex: 'quantity', // Field that is goint to be rendered
      key: 'quantity',
      render: text => <div>{text}</div>,
    },
    {
      title: 'Tipo de Movimiento',
      dataIndex: 'movement_type', // Field that is goint to be rendered
      key: 'movement_type',
      render: text => (
        <Tag
          type='inventoryMovementsTypes'
          value={text}
          size={'large'}
          placeholder={'Tipo de Movimiento'}
        />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status', // Field that is goint to be rendered
      key: 'status',
      render: text => (
        <Tag
          type='inventoryMovementsStatus'
          value={text}
          size={'large'}
          placeholder={'Status'}
        />
      ),
    },
  ]

  return (
    <>
      <Row gutter={16} className={'section-space-field'}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Title level={3}>Bitacora</Title>
          <Divider className={'divider-custom-margins-users'} />
          <DynamicTable columns={columnsHistory} data={props.dataDetail} />
        </Col>
      </Row>
    </>
  )
}
export default InventoryHistory
