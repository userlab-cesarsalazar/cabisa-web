import React, { useState } from 'react'
import DynamicTable from '../../../components/DynamicTable'
import {
  Row,
  Col,
  DatePicker,
  Divider,
  Input,
  Popconfirm,
  Typography,
  Button,
} from 'antd'
import moment from 'moment'
const { Title } = Typography

function InventoryHistory(props) {
  //states
  const [dataSource, setDataSource] = useState([...props.dataDetail])

  const columnsHistory = [
    {
      width: 180,
      title: 'Fecha',
      dataIndex: 'date', // Field that is goint to be rendered
      key: 'date',
      render: (text, record, indexRow) => (
        <DatePicker
          value={moment(record.date)}
          placeholder={'Ingresa fecha'}
          style={{ width: '100%', height: '40px', borderRadius: '8px' }}
          onChange={(data, StringDate) =>
            handleChangeItemValues(StringDate, indexRow, record._id, 'date')
          }
        />
      ),
    },
    {
      title: 'Descripcion',
      dataIndex: 'description', // Field that is goint to be rendered
      key: 'quantity',
      render: (text, record, indexRow) => (
        <Input
          value={record.description}
          size={'large'}
          placeholder={'Descripcion'}
          onChange={event =>
            handleChangeItemValues(
              event.target.value,
              indexRow,
              record._id,
              'description'
            )
          }
        />
      ),
    },
    {
      title: '',
      dataIndex: 'id',
      render: (text, record, index) => (
        <>
          <Popconfirm
            disabled={props.edit}
            title={'Seguro de eliminar?'}
            onConfirm={() => removeItem(index)}
          >
            <span style={{ color: 'red' }}>Eliminar</span>
          </Popconfirm>
        </>
      ),
    },
  ]

  // START: DINAMIC TABLE HANDLERS
  const handlerAddItem = () => {
    setDataSource(
      dataSource.concat([
        {
          date: moment(),
          description: '',
        },
      ])
    )
  }

  const removeItem = index => {
    let tmpDatasource = dataSource.filter((item, ind) => ind !== index)
    setDataSource(tmpDatasource)
  }

  const handleChangeItemValues = (value, indexRow, key, type) => {
    let tmpState = [...dataSource]
    switch (type) {
      case 'date':
        tmpState[indexRow].date = value.length === 0 ? moment() : moment(value)
        break
      case 'description':
        tmpState[indexRow].description = value
        break
      default:
        break
    }
    setDataSource(tmpState)
  }
  // END: DINAMIC TABLE HANDLERS

  return (
    <>
      <Row gutter={16} className={'section-space-field'}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Title level={3}>Bitacora</Title>
          <Divider className={'divider-custom-margins-users'} />
          <DynamicTable columns={columnsHistory} data={dataSource} />
        </Col>
      </Row>
      <Row gutter={16} className={'section-space-list'}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Button
            type='dashed'
            className={'shop-add-turn'}
            onClick={handlerAddItem}
          >
            Agregar Detalle
          </Button>
        </Col>
      </Row>
    </>
  )
}
export default InventoryHistory
