import React, { useEffect, useState } from 'react'
import {
  Button,
  Col,
  Divider,
  Input,
  Popconfirm,
  Row,
  Select,
  Statistic,
  Tag,
  Typography,
} from 'antd'

import DynamicTable from '../../../components/DynamicTable'

const { Title } = Typography
const { Option } = Select

function BillingFields(props) {
  const productDummy = [
    { id: 0, name: 'ITEM PRUEBA 1', price: 100 },
    { id: 1, name: 'ITEM PRUEBA 2', price: 200 },
    { id: 2, name: 'ITEM PRUEBA 3', price: 300 },
  ]

  const [name, setName] = useState('')
  const [nit, setNit] = useState('')
  const [clientTypeID, setClientTypeID] = useState(null)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState(null)
  const [address, setAddress] = useState('')
  const [serviceType, setServiceType] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  // const [serie, setSerie] = useState('')
  const [dataSource, setDataSource] = useState([...props.dataDetail])
  const [items, setItems] = useState(0)
  const [totalBilling, setTotalBilling] = useState(0)
  const [totalBillingOg, setTotalBillingOg] = useState(0)

  useEffect(() => {
    // setName(props.edit ? props.editData.name : '')
    // setClientTypeID(props.edit ? props.editData.type : null)
    // setNit(props.edit ? props.editData.nit : '')
    // setEmail(props.edit ? props.editData.email : '')
    // setPhone(props.edit ? props.editData.phone : '')
    // setAddress(props.edit ? props.editData.address : '')
    // setSerie(props.edit ? props.editData.serie : '')

    if (dataSource.length > 0 && props.edit) {
      let totalBilling = dataSource.reduce(function (accumulator, nextValue) {
        return {
          sub_total: accumulator.sub_total + nextValue.sub_total,
        }
      })
      setItems(dataSource.length)
      setTotalBilling(totalBilling.sub_total)
      setTotalBillingOg(totalBilling.sub_total)
      onSelectUser(1)
      setServiceType(1)
      setPaymentMethod(1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible])

  //dummy method
  const onSelectUser = value => {
    setClientTypeID(value)
    setName(value === 0 ? 'Luis de leon' : 'Userlab')
    setClientTypeID(value)
    setNit(value === 0 ? '92547382' : '6671230')
    setEmail(value === 0 ? 'luisdeleon@userlab.co' : 'userlab@mail.com')
    setPhone(value === 0 ? '45454545' : '22233333')
    setAddress(
      value === 0
        ? 'CAES km 26 Guatemala, guatemala'
        : 'Zona 10 Ciudad guatemala'
    )
  }

  // DINAMIC TABLE HANDLERS
  const handlerAdd = () => {
    setDataSource(
      dataSource.concat([
        {
          quantity: '',
          type_service: null,
          description: '',
          unit_price: '',
          sub_total: '',
        },
      ])
    )
    setItems(dataSource.length + 1)
  }

  const deleteItem = index => {
    let tmpDatasource = dataSource.filter((item, ind) => ind !== index)
    setDataSource(tmpDatasource)
    setItems(tmpDatasource.length)
    let totalBilling =
      tmpDatasource.length > 0
        ? tmpDatasource.reduce(function (accumulator, nextValue) {
            return {
              sub_total: accumulator.sub_total + nextValue.sub_total,
            }
          })
        : 0
    setTotalBilling(totalBilling.sub_total)
    setTotalBillingOg(totalBilling.sub_total)
  }

  const handleChangeValues = (value, indexRow, key, type) => {
    let tmpState = [...dataSource]
    switch (type) {
      case 'quantity':
        tmpState[indexRow].quantity = value
        tmpState[indexRow].sub_total =
          (tmpState[indexRow].unit_price
            ? parseInt(tmpState[indexRow].unit_price)
            : 0) * (value ? parseInt(value) : 0)
        break
      case 'type_service':
        tmpState[indexRow].type_service = value
        tmpState[indexRow].unit_price = productDummy.filter(
          dat => dat.id === value
        )[0].price
        tmpState[indexRow].sub_total =
          tmpState[indexRow].quantity *
          productDummy.filter(dat => dat.id === value)[0].price
        break
      case 'description':
        tmpState[indexRow].description = value

        break
      case 'unit_price':
        tmpState[indexRow].unit_price = value
        tmpState[indexRow].sub_total =
          (value ? parseInt(value) : 0) *
          (tmpState[indexRow].quantity
            ? parseInt(tmpState[indexRow].quantity)
            : 0)
        break
      case 'sub_total':
        tmpState[indexRow].sub_total =
          parseInt(tmpState[indexRow].unit_price) *
          parseInt(tmpState[indexRow].quantity)
        break
      default:
        break
    }
    setDataSource(tmpState)

    let totalBilling = tmpState.reduce(function (accumulator, nextValue) {
      return {
        sub_total: accumulator.sub_total + nextValue.sub_total,
      }
    })
    setTotalBilling(totalBilling.sub_total)
    setTotalBillingOg(totalBilling.sub_total)
  }
  // END DINAMIC TABLE HANDLERS

  const calculateDiscount = value => {
    let totalWithDiscount =
      value && totalBillingOg > 0 && totalBillingOg > value
        ? totalBillingOg - value
        : totalBillingOg
    setTotalBilling(totalWithDiscount)
  }

  const columnsDynamicTable = [
    {
      title: 'Cantidad*',
      dataIndex: 'quantity', // Field that is goint to be rendered
      key: 'quantity',
      render: (text, record, indexRow) => (
        <Input
          disabled={props.edit}
          type={'number'}
          value={record.quantity}
          size={'large'}
          placeholder={'Cantidad'}
          onChange={event =>
            handleChangeValues(
              event.target.value,
              indexRow,
              record._id,
              'quantity'
            )
          }
        />
      ),
    },
    {
      title: 'Precion Unitario',
      dataIndex: 'unit_price', // Field that is goint to be rendered
      key: 'unit_price',
      render: (text, record, indexRow) => (
        <Input
          disabled={props.edit}
          type={'number'}
          value={record.unit_price}
          size={'large'}
          placeholder={'Precio unitario'}
          onChange={event =>
            handleChangeValues(
              event.target.value,
              indexRow,
              record._id,
              'unit_price'
            )
          }
        />
      ),
    },
    {
      title: 'Producto',
      dataIndex: 'type_service', // Field that is goint to be rendered
      key: 'type_service',
      render: (text, record, indexRow) => (
        <Select
          disabled={props.edit}
          value={record.type_service}
          className={'single-select'}
          placeholder={'Producto'}
          size={'large'}
          style={{ width: '100%', height: '40px' }}
          getPopupContainer={trigger => trigger.parentNode}
          onSelect={event =>
            handleChangeValues(event, indexRow, record, 'type_service')
          }
        >
          {productDummy.map((data, i) => {
            return (
              <Option key={i} value={data.id}>
                {data.name}
              </Option>
            )
          })}
          {/*<Option value={0}>ITEM DE PRUEBA 1</Option>*/}
          {/*<Option value={1}>ITEM DE PRUEBA 2</Option>*/}
          {/*<Option value={2}>ITEM DE PRUEBA 3</Option>*/}
        </Select>
      ),
    },
    {
      title: 'Descripcion',
      dataIndex: 'description', // Field that is goint to be rendered
      key: 'description',
      render: (text, record, indexRow) => (
        <Input
          disabled={props.edit}
          value={record.description}
          size={'large'}
          placeholder={'Descripcion'}
          onChange={event =>
            handleChangeValues(
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
      title: 'Subtotal',
      dataIndex: 'sub_total', // Field that is goint to be rendered
      key: 'sub_total',
      render: (text, record, indexRow) => (
        <Input
          disabled
          type={'number'}
          value={record.sub_total}
          size={'large'}
          placeholder={'Subtotal'}
          onChange={event =>
            handleChangeValues(
              event.target.value,
              indexRow,
              record._id,
              'sub_total'
            )
          }
        />
      ),
    },
    {
      title: '',
      dataIndex: '_name',
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

  return (
    <>
      <div>
        {props.edit && (
          <>
            <Row>
              <Col xs={24} sm={24} md={12} lg={12}>
                <Title>{props.edit ? 'Factura' : 'Nueva Factura'}</Title>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={12}
                lg={12}
                style={{ textAlign: 'right' }}
              >
                <Button className='title-cabisa new-button'>
                  Serie No. A-12312
                </Button>
              </Col>
            </Row>
            <Divider className={'divider-custom-margins-users'} />
          </>
        )}
        {/*Fields section*/}
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Selecciona Cliente</div>
            <Select
              disabled={props.edit}
              showSearch
              value={clientTypeID}
              className={'single-select'}
              placeholder={'Buscar cliente'}
              size={'large'}
              style={{ width: '100%' }}
              getPopupContainer={trigger => trigger.parentNode}
              onChange={onSelectUser}
            >
              <Option value={0}>Luis De leon</Option>
              <Option value={1}>Userlab</Option>
            </Select>
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Nombre o Razón social</div>
            <Input
              disabled
              value={name}
              placeholder={'Nombre'}
              size={'large'}
              onChange={value => setName(value.target.value)}
              style={{ height: '40px' }}
            />
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Tipo de cliente</div>
            <Select
              disabled
              value={clientTypeID}
              className={'single-select'}
              placeholder={'Elegir tipo'}
              size={'large'}
              style={{ width: '100%' }}
              onChange={value => setClientTypeID(value)}
              getPopupContainer={trigger => trigger.parentNode}
            >
              <Option value={0}>Persona individual</Option>
              <Option value={1}>Empresa</Option>
            </Select>
          </Col>
        </Row>
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={6} sm={6} md={6} lg={6}>
            <div className={'title-space-field'}>NIT</div>
            <Input
              disabled
              value={nit}
              placeholder={'Escribir NIT'}
              size={'large'}
              style={{ height: '40px' }}
              onChange={value => setNit(value.target.value)}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <div className={'title-space-field'}>Email</div>
            <Input
              disabled
              value={email}
              placeholder={'Escribir email'}
              size={'large'}
              type={'email'}
              style={{ height: '40px' }}
              onChange={value => setEmail(value.target.value)}
            />
          </Col>
          <Col xs={6} sm={6} md={6} lg={6}>
            <div className={'title-space-field'}>Telefono</div>
            <Input
              disabled
              value={phone}
              placeholder={'Escribir telefono'}
              size={'large'}
              style={{ height: '40px' }}
              onChange={value => setPhone(value.target.value)}
            />
          </Col>
        </Row>
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Direccion</div>
            <Input
              disabled={props.edit}
              value={address}
              placeholder={'Escribir direccion'}
              size={'large'}
              style={{ height: '40px' }}
              onChange={value => setAddress(value.target.value)}
            />
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Tipo de servicio</div>
            <Select
              disabled={props.edit}
              value={serviceType}
              className={'single-select'}
              placeholder={'Elegir tipo servicio'}
              size={'large'}
              style={{ width: '100%', height: '40px' }}
              getPopupContainer={trigger => trigger.parentNode}
              onSelect={value => setServiceType(value)}
            >
              <Option value={0}>Maquinaria</Option>
              <Option value={1}>Equipo</Option>
              <Option value={2}>Servicio</Option>
            </Select>
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Metodo de pago</div>
            <Select
              disabled={props.edit}
              value={paymentMethod}
              className={'single-select'}
              placeholder={'Metodo de pago'}
              size={'large'}
              style={{ width: '100%', height: '40px' }}
              getPopupContainer={trigger => trigger.parentNode}
              onSelect={value => setPaymentMethod(value)}
            >
              <Option value={0}>
                <Tag color='geekblue'>Tarjeta debito/credito</Tag>
              </Option>
              <Option value={1}>
                <Tag color='cyan'>Transferencia</Tag>
              </Option>
              <Option value={2}>
                <Tag color='green'>Efectivo</Tag>
              </Option>
            </Select>
          </Col>
        </Row>
        {/*End Fields section*/}
        <Divider className={'divider-custom-margins-users'} />
        <Row
          gutter={16}
          className={'section-space-list'}
          justify='space-between'
          align='middle'
        >
          <Col xs={12} sm={12} md={12} lg={18}>
            <h1>Detalle Factura</h1>
          </Col>
          <Col
            xs={12}
            sm={12}
            md={12}
            lg={6}
            style={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            <div
              style={{ marginRight: '15px', marginTop: '10px' }}
              className={'title-space-field'}
            >
              <b>Descuento:</b>
            </div>
            <Input
              type={'number'}
              placeholder={'Aplicar Descuento'}
              size={'large'}
              onChange={value => calculateDiscount(value.target.value)}
              style={{ height: '40px', width: '75%' }}
            />
          </Col>
        </Row>
        <Divider className={'divider-custom-margins-users'} />
        <DynamicTable columns={columnsDynamicTable} data={dataSource} />
        <Row gutter={16} className={'section-space-list'}>
          <Col xs={24} sm={24} md={24} lg={24}>
            <Button
              disabled={props.edit}
              type='dashed'
              className={'shop-add-turn'}
              onClick={handlerAdd}
            >
              Agregar Detalle
            </Button>
          </Col>
        </Row>
        <Divider className={'divider-custom-margins-users'} />
        <Row gutter={16} style={{ textAlign: 'right' }} justify='end'>
          <Col span={8} offset={8} style={{ textAlign: 'right' }}>
            <div className={'title-space-field'}>
              <Statistic title='Total Items :' value={items} />
            </div>
          </Col>
          <Col span={4} style={{ textAlign: 'right' }}>
            <div className={'title-space-field'}>
              <Statistic title='Total Factura :' value={totalBilling} />
            </div>
          </Col>
        </Row>
        <Divider className={'divider-custom-margins-users'} />
      </div>
    </>
  )
}
export default BillingFields
