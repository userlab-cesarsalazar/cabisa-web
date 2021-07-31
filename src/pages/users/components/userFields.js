import React, { useEffect, useState, useCallback } from 'react'
import {
  Col,
  Input,
  Row,
  Select,
  Popover,
  message,
  Divider,
  Typography,
  Switch,
} from 'antd'
import EyeTwoTone from '@ant-design/icons/lib/icons/EyeTwoTone'
import EyeInvisibleOutlined from '@ant-design/icons/lib/icons/EyeInvisibleOutlined'
import FooterButtons from '../../../components/FooterButtons'
import Tag from '../../../components/Tag'
import { validateEmail } from '../../../utils'
import usersSrc from '../usersSrc'
import { roles } from '../../../commons/types'

const { Option } = Select
const { Title } = Typography
const validateMessageFields = 'Por favor, verifique los campos obligatorios'

function UserFields({ edit, data, visible, ...props }) {
  const [loading, setLoading] = useState(false)
  const [rolesOptionsList, setRolesOptionsList] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changePass, setChangePass] = useState(false)
  const [salesCommission, setSalesCommission] = useState(0)

  const loadUserInformation = useCallback(() => {
    setName(edit ? data.full_name : '')
    setEmail(edit ? data.email : '')
    setRole(edit ? data.rol_id : null)
    setChangePass(!edit)
    setPassword('')
    setConfirmPassword('')
    setSalesCommission(edit ? data.sales_commission : 0)
  }, [edit, data])

  const getRoles = useCallback(() => {
    setLoading(true)

    usersSrc
      .getRoles()
      .then(data => setRolesOptionsList(data))
      .catch(() => message.error('Error al consultar listado de roles'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (visible) {
      loadUserInformation()
      getRoles()
    }
  }, [loadUserInformation, visible, getRoles])

  const saveData = () => {
    if (name === '' || email === '') {
      return message.warning(validateMessageFields)
    } else if (role === null) {
      return message.warning(validateMessageFields)
    } else if (password !== confirmPassword) {
      return message.warning('Contraseñas no coinciden')
    } else if (password.replace(/\s/g, '').length < 8 && changePass) {
      return message.warning('La contraseña debe tener al menos 8 caracteres')
    } else if (
      role === roles.SELLS &&
      !salesCommission &&
      salesCommission !== 0
    ) {
      return message.warning('Debe incluir un porcentaje de comision')
    }

    //validations
    if (!validateEmail(email)) return message.warning('Ingresa un email valido')

    //create request
    const requestData = {
      id: data?.id,
      fullName: name,
      email: email,
      sales_commission: salesCommission || null,
      rolId: role,
      password: confirmPassword,
    }

    props.saveUserData(requestData)
  }

  const contentPopHover = () => {
    return (
      <div>
        <p>La contraseña debe tener al menos 8 caracteres</p>
      </div>
    )
  }
  return (
    <>
      <div>
        {edit && (
          <>
            <Title> {edit ? 'Editar Usuario' : 'Nuevo Usuario'} </Title>
            <span>Cambiar contraseña?</span>
            <br />
            <Switch checked={changePass} onChange={val => setChangePass(val)} />
            <Divider className={'divider-custom-margins-users'} />
          </>
        )}
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Nombre</div>
            <Input
              disabled={edit}
              value={name}
              placeholder={'Nombre'}
              size={'large'}
              onChange={value => setName(value.target.value)}
            />
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Email</div>
            <Input
              disabled={edit}
              value={email}
              placeholder={'Email'}
              size={'large'}
              onChange={value => setEmail(value.target.value)}
              type={'email'}
            />
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Rol del usuario*</div>
            <Select
              disabled={loading}
              loading={loading}
              className={'single-select'}
              placeholder={'Rol de usuario'}
              style={{ width: '100%' }}
              value={role}
              onChange={value => setRole(value)}
              getPopupContainer={trigger => trigger.parentNode}
            >
              {rolesOptionsList?.map(role => (
                <Option key={role.id} value={role.id}>
                  <Tag type='roles' value={role.name} />
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Row gutter={16} className={'section-space-field'}>
          {role === roles.SELLS && (
            <Col xs={8} sm={8} md={8} lg={8}>
              <div className={'title-space-field'}>Porcentaje de Comisión</div>
              <Input
                value={salesCommission}
                placeholder={'Porcentaje de Comisión'}
                size={'large'}
                style={{ width: '100%' }}
                onChange={e => {
                  const value = Number(e.target.value)
                  if (isNaN(value) || value < 0 || value > 100) return
                  setSalesCommission(value)
                }}
              />
            </Col>
          )}
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Username*</div>
            <Input
              disabled
              value={name.replace(/\s+/g, '')}
              placeholder={'Username'}
              size={'large'}
            />
          </Col>
        </Row>
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Password*</div>
            <Popover content={contentPopHover} trigger='hover'>
              <Input.Password
                disabled={!changePass}
                iconRender={visible =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                type={'password'}
                placeholder={'Password'}
                size={'large'}
                value={password}
                onChange={value => setPassword(value.target.value)}
              />
            </Popover>
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Confirmar Password*</div>
            <Input.Password
              disabled={!changePass}
              iconRender={visible =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              type={'password'}
              placeholder={'Confirmar Password'}
              size={'large'}
              value={confirmPassword}
              onChange={value => setConfirmPassword(value.target.value)}
            />
          </Col>
        </Row>
      </div>
      <FooterButtons
        saveData={saveData}
        cancelButton={props.cancelButton}
        edit={edit}
        cancelLink='/users'
      />
    </>
  )
}
export default UserFields
