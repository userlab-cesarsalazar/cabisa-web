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
} from 'antd'

import EyeTwoTone from '@ant-design/icons/lib/icons/EyeTwoTone'
import EyeInvisibleOutlined from '@ant-design/icons/lib/icons/EyeInvisibleOutlined'
import FooterButtons from '../../../components/FooterButtons'
import { validateEmail } from '../../../utils/Utils'
const { Option } = Select
const validateMessageFields = 'Por favor, verifique los campos obligatorios'

const rolesDummy = [
  { id: 1, name: 'Gerencia' },
  { id: 2, name: 'Administrador' },
  { id: 3, name: 'Ventas' },
  { id: 4, name: 'Bodega' },
]
const { Title } = Typography

function UserFields(props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState(null)
  const [phone, setPhone] = useState(null)
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [rolesList, setRolesList] = useState(rolesDummy)
  const [loading, setLoading] = useState(true)

  const loadUserInformation = () => {
    setName(props.edit ? props.data._name : '')
    setEmail(props.edit ? props.data._email : '')
    setRole(props.edit ? props.data._rolId : null)
    setPhone(props.edit ? props.data._phone : null)
    setUserName(props.edit ? props.data.username : '')
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
  }

  const saveData = () => {
    if (name === '' || email === '' || username === '') {
      return message.warning(validateMessageFields)
    } else if (phone === null || role === null) {
      return message.warning(validateMessageFields)
    } else if (password !== confirmPassword) {
      return message.warning('Contraseñas no coinciden')
    } else if (password.length < 8 && (!props.edit || password.length > 0)) {
      return message.warning('La contraseña debe tener al menos 8 caracteres')
    }

    //validations
    if (!validateEmail(email)) {
      return message.warning('Ingresa un email valido')
    }

    //create request
    let requestData
    if (props.edit && password.length === 0) {
      requestData = {
        name: name,
        role_id: role,
        email: email,
        phone: phone,
        username: username,
      }
    } else {
      requestData = {
        name: name,
        role_id: role,
        email: email,
        phone: phone,
        username: username,
        password: password,
        password_confirmation: confirmPassword,
      }
    }
    let id = props.data ? props.data._id : null
    props.saveUserData(requestData, id, props.edit)
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
            <Divider className={'divider-custom-margins-users'} />
          </>
        )}
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={12} sm={12} md={12} lg={12}>
            <div className={'title-space-field'}>Nombre</div>
            <Input
              value={name}
              placeholder={'Nombre'}
              size={'large'}
              onChange={value => setName(value.target.value)}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <div className={'title-space-field'}>Email</div>
            <Input
              value={email}
              placeholder={'Email'}
              size={'large'}
              onChange={value => setEmail(value.target.value)}
              type={'email'}
            />
          </Col>
        </Row>
        <Row gutter={16} className={'section-space-field'}>
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
              onChange={value => setRole(value)}
              getPopupContainer={trigger => trigger.parentNode}
            >
              {rolesList &&
                rolesList.map(data => (
                  <Option key={data.id} value={data.id}>
                    {data.name}
                  </Option>
                ))}
            </Select>
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Telefono*</div>
            <Input
              placeholder={'Escribir telefono'}
              size={'large'}
              type={'number'}
              value={phone}
              onChange={value => setPhone(value.target.value)}
            />
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Username*</div>
            <Input
              value={username}
              placeholder={'Nombre'}
              size={'large'}
              onChange={value => setUserName(value.target.value)}
            />
          </Col>
        </Row>
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Password*</div>
            <Popover content={contentPopHover} trigger='hover'>
              <Input.Password
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
