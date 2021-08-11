import React, { useEffect, useState } from 'react'
import { Col, Divider, Input, Row, Typography } from 'antd'
import FooterButtons from '../../../components/FooterButtons'
import {
  validateEmail,
  showErrors,
  validateRole,
  formatPhone,
  formatPhoneOnChange,
} from '../../../utils'
import { stakeholdersTypes, roles } from '../../../commons/types'

const { Title } = Typography

function SupplierFields({ edit, editData, ...props }) {
  const [name, setName] = useState('')
  const [nit, setNit] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState(null)
  const [address, setAddress] = useState('')
  const [payments_man, setPayments_man] = useState('')
  const [business_man, setBusiness_man] = useState('')
  const [projectsData, setProjectsData] = useState([])

  const isAdmin = validateRole(roles.ADMIN)

  useEffect(() => {
    setName(edit ? editData.name : '')
    setNit(edit ? editData.nit : '')
    setEmail(edit ? editData.email : '')
    setPhone(edit ? formatPhone(editData.phone) : '')
    setAddress(edit ? editData.address : '')
    setBusiness_man(edit ? editData.business_man : '')
    setPayments_man(edit ? editData.payments_man : '')
    setProjectsData(
      edit ? editData.projects : projectsData.length > 0 ? projectsData : []
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible])

  const getSaveData = () => ({
    id: editData?.id,
    name,
    stakeholder_type: stakeholdersTypes.PROVIDER,
    nit,
    email,
    phone: phone
      .split('')
      .flatMap(c => (c === '-' ? '' : c))
      .join(''),
    address,
    business_man,
    payments_man,
  })

  const validateSaveData = data => {
    const errors = []
    const requiredFields = [
      { key: 'name', value: 'Nombre o Razon Social' },
      { key: 'nit', value: 'NIT' },
      { key: 'phone', value: 'Telefono' },
      { key: 'address', value: 'Direccion' },
    ]
    const requiredErrors = requiredFields.flatMap(field =>
      !data[field.key] ? field.value : []
    )
    if (requiredErrors.length > 0) {
      requiredErrors.forEach(k => {
        errors.push(`El campo ${k} es obligatorio`)
      })
    }

    if (!validateEmail(email)) errors.push('Ingrese un email valido')

    return {
      isInvalid: errors.length > 0,
      error: {
        message: errors,
      },
    }
  }

  const saveData = () => {
    const saveData = getSaveData()

    const { isInvalid, error } = validateSaveData(saveData)

    if (isInvalid) return showErrors(error)

    props.saveUserData(saveData)
  }

  const handleChangePhone = e => {
    const rawValue = e?.target?.value !== undefined ? e.target.value : e
    const value = formatPhoneOnChange(phone, rawValue)
    setPhone(value)
  }

  return (
    <>
      <div>
        {edit && (
          <>
            <Title>{edit ? 'Editar Proveedor' : 'Nuevo Proveedor'}</Title>
            <Divider className={'divider-custom-margins-users'} />
          </>
        )}

        <Row gutter={16} className={'section-space-field'}>
          <Col xs={12} sm={12} md={12} lg={12}>
            <div className={'title-space-field'}>Nombre o Razón social</div>
            <Input
              value={name}
              placeholder={'Nombre'}
              size={'large'}
              onChange={value => setName(value.target.value)}
              disabled={!isAdmin}
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
              disabled={!isAdmin}
            />
          </Col>
        </Row>

        <Row gutter={16} className={'section-space-field'}>
          <Col xs={12} sm={12} md={12} lg={12}>
            <div className={'title-space-field'}>NIT</div>
            <Input
              value={nit}
              placeholder={'Escribir NIT'}
              size={'large'}
              onChange={value => setNit(value.target.value)}
              disabled={!isAdmin}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <div className={'title-space-field'}>Telefono</div>
            <Input
              value={phone}
              placeholder={'Escribir telefono'}
              size={'large'}
              onChange={handleChangePhone}
              disabled={!isAdmin}
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
              disabled={!isAdmin}
            />
          </Col>
        </Row>

        <Row gutter={16} className={'section-space-field'}>
          <Col xs={12} sm={8} md={12} lg={12}>
            <div className={'title-space-field'}>Encargado Compras</div>
            <Input
              value={business_man}
              size={'large'}
              placeholder={'Encargado Compras'}
              onChange={val => setBusiness_man(val.target.value)}
              disabled={!isAdmin}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <div className={'title-space-field'}>Encargado Pagos</div>
            <Input
              value={payments_man}
              size={'large'}
              placeholder={'Encargado Pagos'}
              onChange={val => setPayments_man(val.target.value)}
              disabled={!isAdmin}
            />
          </Col>
        </Row>
      </div>

      {isAdmin && (
        <FooterButtons
          saveData={saveData}
          cancelButton={props.cancelButton}
          edit={edit}
          cancelLink='/suppliers'
        />
      )}
    </>
  )
}

export default SupplierFields
