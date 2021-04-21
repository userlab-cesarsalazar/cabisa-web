import React, { useEffect, useState } from 'react'
import {
  Col,
  Input,
  Row,
  Select,
  Popover,
  message,
  Divider,
  Typography,
  Tag,
  Switch,
} from 'antd'

import EyeTwoTone from '@ant-design/icons/lib/icons/EyeTwoTone'
import EyeInvisibleOutlined from '@ant-design/icons/lib/icons/EyeInvisibleOutlined'
import FooterButtons from '../../../components/FooterButtons'
import { validateEmail } from '../../../utils/Utils'
import {
  admin_permission,
  sells_permission,
  warehouse_permission,
  operator_permission,
} from '../../../commons/roles_permissions'

const { Option } = Select
const validateMessageFields = 'Por favor, verifique los campos obligatorios'

const rolesData = [
  { id: 1, name: 'Administrador', color: '#187fce' },
  { id: 2, name: 'Vendedor', color: '#87d067' },
  { id: 3, name: 'Bodega', color: '#f50' },
  { id: 4, name: 'Operador', color: '#fec842' },
]
const { Title } = Typography

function UserFields(props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState(null)

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [rolesList, setRolesList] = useState([])
  const [loading, setLoading] = useState(true)
  const [changedRole, setChangedRole] = useState(false)
  const [changePass, setChangePass] = useState(false)

  const loadUserInformation = () => {
    setName(props.edit ? props.data.full_name : '')
    setEmail(props.edit ? props.data.email : '')
    setRole(props.edit ? props.data.rol_id : null)
    setChangePass(!props.edit)
    setPassword('')
    setConfirmPassword('')
  }

  useEffect(() => {
    loadUserInformation()
    if (props.visible) {
      getRoles()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible])

  const getRoles = () => {
    setLoading(false)
    setRolesList(rolesData)
  }

  const defineRoles = roleId => {
    switch (roleId) {
      case 1:
        return admin_permission
      case 2:
        return sells_permission
      case 3:
        return warehouse_permission
      case 4:
        return operator_permission
      default:
        return null
    }
  }
  const saveData = () => {
    if (name === '' || email === '') {
      return message.warning(validateMessageFields)
    } else if (role === null) {
      return message.warning(validateMessageFields)
    } else if (password !== confirmPassword) {
      return message.warning('Contraseñas no coinciden')
    } else if (password.replace(/\s/g, '').length < 8 && changePass) {
      return message.warning('La contraseña debe tener al menos 8 caracteres')
    }

    //validations
    if (!validateEmail(email)) {
      return message.warning('Ingresa un email valido')
    }

    //create request
    let requestData
    if (props.edit) {
      requestData = {
        id: props.data.id,
        fullName: name,
        is_active: 1,
        email: email,
        rolId: role,
        password: confirmPassword,
        permissions: changedRole ? defineRoles(role) : props.data.permissions,
      }
    } else {
      requestData = {
        fullName: name,
        password: confirmPassword,
        email: email,
        rolId: role,
        permissions: defineRoles(role),
      }
    }
    props.saveUserData(requestData)
  }

  const changeRole = value => {
    setRole(value)
    setChangedRole(true)
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
        {props.edit && (
          <>
            <Title> {props.edit ? 'Editar Usuario' : 'Nuevo Usuario'} </Title>
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
              disabled={props.edit}
              value={name}
              placeholder={'Nombre'}
              size={'large'}
              onChange={value => setName(value.target.value)}
            />
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Email</div>
            <Input
              disabled={props.edit}
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
              size={'large'}
              style={{ width: '100%' }}
              value={role}
              onChange={value => changeRole(value)}
              getPopupContainer={trigger => trigger.parentNode}
            >
              {rolesList &&
                rolesList.map(data => (
                  <Option key={data.id} value={data.id}>
                    <Tag color={data.color}>{data.name}</Tag>
                  </Option>
                ))}
            </Select>
          </Col>
        </Row>
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Username*</div>
            <Input
              disabled
              value={name.replace(/\s+/g, '')}
              placeholder={'Username'}
              size={'large'}
            />
          </Col>
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
        edit={props.edit}
        cancelLink='/users'
      />
    </>
  )
}
export default UserFields
