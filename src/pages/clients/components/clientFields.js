import React, { useEffect, useState } from 'react'
import FooterButtons from '../../../components/FooterButtons'
import { Col, Divider, Input, message, Row, Select, Typography } from 'antd'
import Utils from '../../../utils/Utils'
const { Title } = Typography
const { Option } = Select

function ClientFields(props) {
  const [name, setName] = useState('')
  const [clientTypeID, setClientTypeID] = useState(null)
  const [nit, setNit] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState(null)
  const [address, setAddress] = useState('')
  const [sales, setSales] = useState('')
  const [shops, setShops] = useState('')

  useEffect(() => {
    setName(props.edit ? props.editData.name : '')
    setClientTypeID(props.edit ? props.editData.type : null)
    setNit(props.edit ? props.editData.nit : '')
    setEmail(props.edit ? props.editData.email : '')
    setPhone(props.edit ? props.editData.phone : '')
    setAddress(props.edit ? props.editData.address : '')
    setSales(props.edit ? props.editData.sales : '')
    setShops(props.edit ? props.editData.shops : '')

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible])

  const saveData = () => {
    let validate = false
    if (
      [name, clientTypeID, nit, address, email, phone, shops, sales].includes(
        ''
      ) ||
      [name, clientTypeID, nit, address, email, phone, sales, shops].includes(
        null
      ) ||
      [name, clientTypeID, nit, address, email, phone, sales, shops].includes(
        undefined
      )
    ) {
      message.warning('Todos los campos son obligatorios')
    } else if (
      !Number(nit) ||
      nit.includes('.') ||
      nit.includes('-') ||
      nit.includes('+')
    ) {
      message.warning('El campo NIT solo acepta valores numéricos')
    } else if (!Utils.validateEmail(email)) {
      message.warning('Ingresa un email valido')
    } else if (
      !Number(phone) ||
      phone.includes('.') ||
      phone.includes('-') ||
      phone.includes('+')
    ) {
      message.warning('El campo Telefono solo acepta valores numéricos')
    } else {
      validate = true
    }

    const data = {
      name: name,
      type: clientTypeID,
      address: address,
      nit: nit,
      email,
      phone,
      sales,
      shops,
    }
    if (validate)
      props.saveUserData(
        props.edit,
        data,
        props.edit ? props.editData.id : null
      )
  }

  return (
    <>
      <div>
        {props.edit && (
          <>
            <Title>{props.edit ? 'Editar Cliente' : 'Nuevo Cliente'}</Title>
            <Divider className={'divider-custom-margins-users'} />
          </>
        )}
        {/*Fields section*/}
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={12} sm={12} md={12} lg={12}>
            <div className={'title-space-field'}>Nombre o Razón social</div>
            <Input
              value={name}
              placeholder={'Nombre'}
              size={'large'}
              onChange={value => setName(value.target.value)}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <div className={'title-space-field'}>Tipo de cliente</div>
            <Select
              value={clientTypeID}
              className={'single-select'}
              placeholder={'Elegir tipo'}
              size={'large'}
              style={{ width: '100%' }}
              onChange={value => setClientTypeID(value)}
              getPopupContainer={trigger => trigger.parentNode}
            >
              <Option value={'INDIVIDUAL'}>Persona individual</Option>
              <Option value={'CORPORATION'}>Empresa</Option>
            </Select>
          </Col>
        </Row>
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={6} sm={6} md={6} lg={6}>
            <div className={'title-space-field'}>NIT</div>
            <Input
              value={nit}
              placeholder={'Escribir NIT'}
              size={'large'}
              onChange={value => setNit(value.target.value)}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <div className={'title-space-field'}>Email</div>
            <Input
              value={email}
              placeholder={'Escribir email'}
              size={'large'}
              type={'email'}
              onChange={value => setEmail(value.target.value)}
            />
          </Col>
          <Col xs={6} sm={6} md={6} lg={6}>
            <div className={'title-space-field'}>Telefono</div>
            <Input
              value={phone}
              placeholder={'Escribir telefono'}
              size={'large'}
              onChange={value => setPhone(value.target.value)}
            />
          </Col>
        </Row>
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={24} sm={24} md={24} lg={24}>
            <div className={'title-space-field'}>Direccion</div>
            <Input
              value={address}
              placeholder={'Escribir direccion'}
              size={'large'}
              onChange={value => setAddress(value.target.value)}
            />
          </Col>
        </Row>
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={12} sm={8} md={12} lg={12}>
            <div className={'title-space-field'}>Encargado Compras</div>
            <Input
              value={sales}
              size={'large'}
              placeholder={'Encargado Compras'}
              onChange={val => setSales(val.target.value)}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <div className={'title-space-field'}>Encargado Pagos</div>
            <Input
              value={shops}
              size={'large'}
              placeholder={'Encargado Pagos'}
              onChange={val => setShops(val.target.value)}
            />
          </Col>
        </Row>
        {/*End Fields section*/}
      </div>
      <FooterButtons
        saveData={saveData}
        cancelButton={props.cancelButton}
        edit={props.edit}
        cancelLink='/clients'
      />
    </>
  )
}
export default ClientFields
