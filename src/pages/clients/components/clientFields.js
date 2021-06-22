import React, { useEffect, useState } from 'react'
import { Cache } from 'aws-amplify'
import moment from 'moment'
import {
  Col,
  Divider,
  Input,
  Row,
  Select,
  Tag,
  Typography,
  Button,
  Popconfirm,
  DatePicker,
} from 'antd'
import FooterButtons from '../../../components/FooterButtons'
import DynamicTable from '../../../components/DynamicTable'
import { useEditableList } from '../../../hooks'
import { validateEmail, showErrors, validateRole } from '../../../utils'
const { Title } = Typography
const { Option } = Select

const RemoveProjectPopConfirmMessage = () => {
  return (
    <>
      <div>
        Tambien eliminara todos los documentos asociados a este proyecto
      </div>
      <div>¿Esta seguro de eliminar?</div>
    </>
  )
}

const getColumnsProjects = ({
  handleRemoveProject,
  handleChangeProject,
  isAdmin,
}) => {
  const columns = [
    {
      width: 180,
      title: 'Fecha de registro',
      dataIndex: 'created_at', // Field that is goint to be rendered
      key: 'created_at',
      render: text => (
        <div>{text ? moment(text).format('DD-MM-YYYY') : null}</div>
      ),
    },
    {
      width: 180,
      title: 'Fecha inicial',
      dataIndex: 'start_date', // Field that is goint to be rendered
      key: 'start_date',
      render: (_, record, rowIndex) => (
        <DatePicker
          style={{ width: '100%', height: '40px', borderRadius: '8px' }}
          placeholder='Fecha inicial'
          format='DD-MM-YYYY'
          value={record.start_date ? moment(record.start_date) : ''}
          onChange={value => handleChangeProject('start_date', value, rowIndex)}
          disabled={!isAdmin}
        />
      ),
    },
    {
      width: 180,
      title: 'Fecha final',
      dataIndex: 'end_date', // Field that is goint to be rendered
      key: 'end_date',
      render: (_, record, rowIndex) => (
        <DatePicker
          style={{ width: '100%', height: '40px', borderRadius: '8px' }}
          placeholder='Fecha final'
          format='DD-MM-YYYY'
          value={record.end_date ? moment(record.end_date) : ''}
          onChange={value => handleChangeProject('end_date', value, rowIndex)}
          disabled={!isAdmin}
        />
      ),
    },
    {
      title: 'Proyecto',
      dataIndex: 'name', // Field that is goint to be rendered
      key: 'name',
      render: (_, record, rowIndex) => (
        <Input
          value={record.name}
          size={'large'}
          placeholder={'Nombre del Proyecto'}
          style={{ minWidth: '120px' }}
          onChange={e => handleChangeProject('name', e.target.value, rowIndex)}
          disabled={!isAdmin}
        />
      ),
    },
  ]

  const deleteColumn = {
    title: '',
    dataIndex: 'id',
    render: (_, __, rowIndex) => (
      <Popconfirm
        title={<RemoveProjectPopConfirmMessage />}
        onConfirm={() => handleRemoveProject(rowIndex)}
      >
        <span style={{ color: 'red' }}>Eliminar</span>
      </Popconfirm>
    ),
  }

  return isAdmin ? [...columns, deleteColumn] : columns
}

function ClientFields(props) {
  const [name, setName] = useState('')
  const [clientTypeID, setClientTypeID] = useState(null)
  const [nit, setNit] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState(null)
  const [address, setAddress] = useState('')
  const [payments_man, setPayments_man] = useState('')
  const [business_man, setBusiness_man] = useState('')
  const [projectsData, setProjectsData] = useState([])

  const isAdmin = validateRole(Cache.getItem('currentSession').rol_id, 1)

  useEffect(() => {
    setName(props.edit ? props.editData.name : '')
    setClientTypeID(props.edit ? props.editData.stakeholder_type : null)
    setNit(props.edit ? props.editData.nit : '')
    setEmail(props.edit ? props.editData.email : '')
    setPhone(props.edit ? props.editData.phone : '')
    setAddress(props.edit ? props.editData.address : '')
    setBusiness_man(props.edit ? props.editData.business_man : '')
    setPayments_man(props.edit ? props.editData.payments_man : '')
    setProjectsData(props.edit ? props.editData.projects : [])

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible])

  const {
    handleAdd: handleAddProject,
    handleRemove: handleRemoveProject,
    handleChange: handleChangeProject,
  } = useEditableList({
    state: projectsData,
    setState: setProjectsData,
    initRow: {
      id: '',
      created_at: new Date().toISOString(),
      start_date: '',
      end_date: '',
      name: '',
    },
    minimumLength: 0,
  })

  const getSaveData = () => ({
    id: props?.editData?.id,
    name,
    stakeholder_type: clientTypeID,
    nit,
    email,
    phone,
    address,
    business_man,
    payments_man,
    projects: projectsData.map(p => ({
      id: p.id,
      created_at: p.created_at ? new Date(p.created_at).toISOString() : null,
      start_date: p.start_date ? new Date(p.start_date).toISOString() : null,
      end_date: p.end_date ? new Date(p.end_date).toISOString() : null,
      name: p.name,
    })),
  })

  const validateSaveData = data => {
    const errors = []
    const requiredFields = [
      { key: 'name', value: 'Nombre o Razon Social' },
      { key: 'stakeholder_type', value: 'Tipo de Cliente' },
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
    const projectsRequiredFields = ['start_date', 'name']

    const projectRequiredPositions = data.projects.flatMap((p, i) =>
      projectsRequiredFields.some(k => !p[k]) ? i + 1 : []
    )
    if (projectRequiredPositions.length > 0) {
      projectRequiredPositions.forEach(p => {
        errors.push(
          `Los campos Proyecto y Fecha inicial del proyecto ${p} son obligatorios`
        )
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

  const columnsProjects = getColumnsProjects({
    handleRemoveProject,
    handleChangeProject,
    isAdmin,
  })

  return (
    <>
      <div>
        {props.edit && (
          <>
            <Title>{props.edit ? 'Editar Cliente' : 'Nuevo Cliente'}</Title>
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
            <div className={'title-space-field'}>Tipo de cliente</div>
            <Select
              value={clientTypeID}
              className={'single-select'}
              placeholder={'Elegir tipo'}
              size={'large'}
              style={{ width: '100%' }}
              onChange={value => setClientTypeID(value)}
              getPopupContainer={trigger => trigger.parentNode}
              disabled={!isAdmin}
            >
              <Option value={'CLIENT_INDIVIDUAL'}>
                <Tag color='geekblue'>Persona individual</Tag>
              </Option>
              <Option value={'CLIENT_COMPANY'}>
                <Tag color='cyan'>Empresa</Tag>
              </Option>
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
          <Col xs={6} sm={6} md={6} lg={6}>
            <div className={'title-space-field'}>Telefono</div>
            <Input
              value={phone}
              placeholder={'Escribir telefono'}
              size={'large'}
              onChange={value => setPhone(value.target.value)}
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
        {props.edit && (
          <>
            <Row gutter={16} className={'section-space-field'}>
              <Col xs={24} sm={24} md={24} lg={24}>
                <DynamicTable columns={columnsProjects} data={projectsData} />
              </Col>
            </Row>

            {isAdmin && (
              <Row gutter={16} className={'section-space-list'}>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <Button
                    type='dashed'
                    className={'shop-add-turn'}
                    onClick={handleAddProject}
                  >
                    Agregar Detalle
                  </Button>
                </Col>
              </Row>
            )}
          </>
        )}
      </div>
      {isAdmin && (
        <FooterButtons
          saveData={saveData}
          cancelButton={props.cancelButton}
          edit={props.edit}
          cancelLink='/clients'
        />
      )}
    </>
  )
}
export default ClientFields
