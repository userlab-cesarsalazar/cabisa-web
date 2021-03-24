import React, { useState } from 'react'
import {
  Col,
  Divider,
  Drawer,
  Input,
  Row,
  Typography,
  DatePicker,
  Table,
  Select,
  Button,
  Popconfirm,
} from 'antd'
import FooterButtons from '../../../../components/FooterButtons'
import DynamicTable from '../../../../components/DynamicTable'
const { Title } = Typography
const { TextArea } = Input
const { Option } = Select
const productDummy = [
  { id: 0, name: 'Cabina secilla' },
  { id: 1, name: 'Cabina de lujo' },
  { id: 2, name: 'Cabina con ducha' },
  { id: 3, name: 'Modulo lavamanos' },
  { id: 4, name: 'Compresor de aire' },
  { id: 5, name: 'Martillo' },
  { id: 6, name: 'Manguera' },
  { id: 7, name: 'Producto' },
  { id: 8, name: 'Accesorios' },
  { id: 9, name: 'Otros' },
]

const SalesDetailColumns = [
  {
    width: 180,
    title: 'Cantidad',
    dataIndex: 'quantity', // Field that is goint to be rendered
    key: 'quantity',
    render: text => <span>{text}</span>,
  },
  {
    title: 'Servicio',
    dataIndex: 'service', // Field that is goint to be rendered
    key: 'service',
    render: (text, record, indexRow) => (
      <Select
        disabled={true}
        showSearch
        value={record.service}
        className={'single-select'}
        placeholder={'Servicio'}
        size={'large'}
        style={{ width: '100%', height: '40px' }}
      >
        {productDummy.map((data, i) => {
          return (
            <Option key={i} value={data.id}>
              {data.name}
            </Option>
          )
        })}
      </Select>
    ),
  },
  {
    title: 'Detalle',
    dataIndex: 'detail', // Field that is goint to be rendered
    key: '_quantity',
    render: text => <span>{text}</span>,
  },
]

function SalesDetail(props) {
  const [dataSourceTable, setDataSourceTable] = useState([])

  const saveData = () => {
    props.saveButtonEdit()
  }
  const columnsDynamicTable = [
    {
      width: 180,
      title: 'Codigo de repuesto',
      dataIndex: 'code', // Field that is goint to be rendered
      key: 'code',
      render: (text, record, indexRow) => (
        <Input
          value={record.code}
          size={'large'}
          placeholder={'Codigo repuesto'}
          onChange={event =>
            handleChangeValues(event.target.value, indexRow, record._id, 'code')
          }
        />
      ),
    },
    {
      title: 'Servicio',
      dataIndex: 'service', // Field that is goint to be rendered
      key: 'service',
      render: (text, record, indexRow) => (
        <Select
          showSearch
          value={record.service}
          className={'single-select'}
          placeholder={'Servicio'}
          size={'large'}
          style={{ width: '100%', height: '40px' }}
          optionFilterProp='children'
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          onSelect={event =>
            handleChangeValues(event, indexRow, record, 'service')
          }
        >
          {productDummy.map((data, i) => {
            return (
              <Option key={i} value={data.id}>
                {data.name}
              </Option>
            )
          })}
        </Select>
      ),
    },
    {
      title: 'Observacion',
      dataIndex: 'observation', // Field that is goint to be rendered
      key: 'observation',
      render: (text, record, indexRow) => (
        <TextArea
          rows={2}
          value={record.observation}
          size={'large'}
          placeholder={'Detalle'}
          onChange={event =>
            handleChangeValues(
              event.target.value,
              indexRow,
              record._id,
              'observation'
            )
          }
        />
      ),
    },
    {
      title: '',
      render: (text, record, index) => (
        <>
          <Popconfirm
            disabled={props.edit}
            title={'Seguro de eliminar?'}
            onConfirm={() => deleteItem(index)}
          >
            <span style={{ color: 'red' }}>Eliminar</span>
          </Popconfirm>
        </>
      ),
    },
  ]

  // DINAMIC TABLE HANDLERS
  const handlerAddItem = () => {
    setDataSourceTable(
      dataSourceTable.concat([
        {
          observation: '',
          service: null,
          code: '',
        },
      ])
    )
  }

  const deleteItem = index => {
    let tmpDatasource = dataSourceTable.filter((item, ind) => ind !== index)
    setDataSourceTable(tmpDatasource)
  }

  const handleChangeValues = (value, indexRow, key, type) => {
    let tmpState = [...dataSourceTable]
    switch (type) {
      case 'observation':
        tmpState[indexRow].observation = value
        break
      case 'service':
        tmpState[indexRow].service = value
        break
      case 'code':
        tmpState[indexRow].code = value
        break
      default:
        break
    }
    setDataSourceTable(tmpState)
  }
  // END DINAMIC TABLE HANDLERS

  return (
    <>
      <Drawer
        placement='right'
        closable={false}
        onClose={props.closable}
        visible={props.visible}
        width={850}
      >
        <div>
          <Title> {'Detalle Nota de servicio'} </Title>
          <Divider className={'divider-custom-margins-users'} />
          <Row gutter={16} className={'section-space-field'}>
            <Col xs={8} sm={8} md={8} lg={8}>
              <div className={'title-space-field'}>Empresa</div>
              <Input placeholder={'Empresa'} size={'large'} />
            </Col>
            <Col xs={8} sm={8} md={8} lg={8}>
              <div className={'title-space-field'}>Direccion</div>
              <Input placeholder={'Direccion'} size={'large'} />
            </Col>
            <Col xs={8} sm={8} md={8} lg={8}>
              <div className={'title-space-field'}>Telefono</div>
              <Input placeholder={'Telefono'} size={'large'} type={'number'} />
            </Col>
          </Row>
          <Row gutter={16} className={'section-space-field'}>
            <Col xs={8} sm={8} md={8} lg={8}>
              <div className={'title-space-field'}>Proyecto</div>
              <Input placeholder={'Proyecto'} size={'large'} type={'number'} />
            </Col>
            <Col xs={8} sm={8} md={8} lg={8}>
              <div className={'title-space-field'}>Encargado</div>
              <Input placeholder={'Encargado'} size={'large'} />
            </Col>
            <Col xs={8} sm={8} md={8} lg={8}>
              <div className={'title-space-field'}>Fecha</div>
              <DatePicker
                style={{ width: '100%', height: '37px', borderRadius: '8px' }}
              />
            </Col>
          </Row>
          <Divider className={'divider-custom-margins-users'} />
          <h2>Detalle Entrega:</h2>
          <Row gutter={16} className={'section-space-field'}>
            <Col xs={24} sm={24} md={24} lg={24}>
              <Table
                scroll={{ y: 250 }}
                loading={props.loading}
                className={'CustomTableClass'}
                dataSource={props.dataSource}
                columns={SalesDetailColumns}
                pagination={false}
                rowKey='id'
              />
            </Col>
          </Row>
          <Row gutter={16} className={'section-space-field'}>
            <Col xs={24} sm={24} md={24} lg={24}>
              <div className={'title-space-field'}>Observaciones</div>
              <TextArea rows={4} />
            </Col>
          </Row>
          <Row gutter={16} className={'section-space-field'}>
            <Col xs={12} sm={12} md={12} lg={12}>
              <h3>Entrega</h3>
              <Input placeholder={'Entrega'} size={'large'} />
            </Col>
            <Col xs={12} sm={12} md={12} lg={12}>
              <h3>Recibe</h3>
              <Input placeholder={'Recibe'} size={'large'} />
            </Col>
          </Row>
          <Divider className={'divider-custom-margins-users'} />
          <h2>Detalle Retiro:</h2>
          <Row gutter={16} className={'section-space-field'}>
            <Col xs={24} sm={24} md={24} lg={24}>
              <DynamicTable
                columns={columnsDynamicTable}
                data={dataSourceTable}
              />
            </Col>
            <Col xs={24} sm={24} md={24} lg={24}>
              <Button
                disabled={props.edit}
                type='dashed'
                className={'shop-add-turn'}
                onClick={handlerAddItem}
              >
                Agregar Detalle
              </Button>
            </Col>
            <Divider className={'divider-custom-margins-users'} />
          </Row>
        </div>
        <FooterButtons
          saveData={saveData}
          cancelButton={props.cancelButton}
          edit={true}
          cancelLink=''
        />
      </Drawer>
    </>
  )
}
export default SalesDetail
