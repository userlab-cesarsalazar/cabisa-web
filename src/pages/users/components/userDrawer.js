import React, { useState, useEffect } from 'react'
import { Button, Col, Divider, Drawer, Input, message, Row, Select, Transfer, Typography, Popover } from 'antd'
import EyeTwoTone from '@ant-design/icons/lib/icons/EyeTwoTone'
import EyeInvisibleOutlined from '@ant-design/icons/lib/icons/EyeInvisibleOutlined'
import {validateEmail} from '../../../utils/Utils'

const { Title } = Typography
const { Option } = Select
const validateMessageFields = 'Por favor, verifique los campos obligatorios'
const rolesDummy = [{id:1,name:"Gerencia"},
  {id:2,name:"Administrador"},{id:3,name:"Ventas"},{id:4,name:"Bodega"}]

function UserDrawer(props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState(null)
  const [phone, setPhone] = useState(null)
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [rolesList, setRolesList] = useState(rolesDummy)
  const [loading, setLoading] = useState(true)

  // _stores_ids
  const loadUserInformation = () => {
    setName(props.edit ? props.editData._name : '')
    setEmail(props.edit ? props.editData._email : '')
    setRole(props.edit ? props.editData._rolId : null)
    setPhone(props.edit ? props.editData._phone : null)
    setUserName(props.edit ? props.editData.username : '')
    setPassword('')
    setConfirmPassword('')
  }

  useEffect(() => {
    loadUserInformation()
    if (props.visible) {
      getRoles()
      onSearchEnterprise(props.edit ? props.editData._empresaNombre : '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible])


  const onSearchEnterprise = val => {
    val !== null ? (val = '') : (val = '')
  }

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
    console.log("validate email",validateEmail(email))
    console.log("validate email >> ",email)
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
    let id = props.editData ? props.editData._id : null
    props.saveButton(requestData, id, props.edit)
  }

  const contentPopHover = () => {
    return (
      <div>
        <p>La contraseña debe tener al menos 8 caracteres</p>
      </div>
    )
  }

  return (
    <Drawer placement="right" closable={false} onClose={props.closable} visible={props.visible} width={800}>
      <div>
        <Title> {props.edit ? 'Editar Usuario' : 'Nuevo Usuario'} </Title>
        <Divider className={'divider-custom-margins-users'} />
      {/*Fields section*/}
      <Row gutter={16} className={'section-space-field'}>
        <Col xs={12} sm={12} md={12} lg={12}>
          <div className={'title-space-field'}>Nombre</div>
          <Input value={name} placeholder={'Nombre'} size={'large'} onChange={value => setName(value.target.value)} />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <div className={'title-space-field'}>Email</div>
          <Input value={email} placeholder={'Email'} size={'large'} onChange={value => setEmail(value.target.value)} type={'email'} />
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
          <Input placeholder={'Escribir telefono'} size={'large'} type={'number'} value={phone} onChange={value => setPhone(value.target.value)} />
        </Col>
        <Col xs={8} sm={8} md={8} lg={8}>
          <div className={'title-space-field'}>Username*</div>
          <Input value={username} placeholder={'Nombre'} size={'large'} onChange={value => setUserName(value.target.value)} />
        </Col>
      </Row>
      <Row gutter={16} className={'section-space-field'}>
        <Col xs={8} sm={8} md={8} lg={8}>
          <div className={'title-space-field'}>Password*</div>
          <Popover content={contentPopHover} trigger="hover">
            <Input.Password
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
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
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              type={'password'}
              placeholder={'Confirmar Password'}
              size={'large'}
              value={confirmPassword}
              onChange={value => setConfirmPassword(value.target.value)}
          />
        </Col>
      </Row>
      {/*End Fields section*/}
      </div>
      <div>
      <Divider className={'divider-custom-margins-users'} />
      <Row gutter={16}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <div className="text-right">
            <div>
              <Button type={'link'} onClick={() => props.cancelButton()} className="cancel-button">
                Cancelar
              </Button>

              <Button className="title-cabisa new-button" onClick={() => saveData()}>
                Guardar
              </Button>
            </div>
          </div>
        </Col>
      </Row>
      </div>
      {/*End Footer buttons section*/}
    </Drawer>
  )
}

export default UserDrawer
