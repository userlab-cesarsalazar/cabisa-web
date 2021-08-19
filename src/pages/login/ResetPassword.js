import React, { useState } from 'react'
import {
  Button,
  Col,
  Divider,
  Drawer,
  Input,
  message,
  Row,
  Typography,
} from 'antd'

import { Auth } from 'aws-amplify'

const { Title } = Typography

function ResetPassword(props) {
  const [oldPass, setOldPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmNewPass, setConfirmNewPass] = useState('')

  const validateMessages = {
    required: 'Todos los campos son obligatorios.',
    passLength: 'La nueva contraseña debe contener al menos 8 caracteres',
    oldPassDiff: 'La nueva contraseña debe ser distinta a la anterior',
    newPassEqual: 'La nueva contraseña debe ser igual en ambos campos',
    oldPassNotMatch: 'La contraseña anterior no es correcta',
    limitExceeded: 'Se superó el límite de intentos; inténtelo mas tarde.',
    successPass: 'La contraseña se cambio de manera correcta.',
  }

  const resetDrawer = () => {
    setOldPass('')
    setNewPass('')
    setConfirmNewPass('')
    props.closable()
  }

  const submitPassHandler = () => {
    if (oldPass === '' || newPass === '' || confirmNewPass === '') {
      return message.warning(validateMessages.required)
    }
    if (newPass !== confirmNewPass) {
      return message.warning(validateMessages.newPassEqual)
    }

    if (confirmNewPass.length < 8) {
      return message.warning(validateMessages.passLength)
    }

    Auth.currentAuthenticatedUser()
      .then(user => {
        return Auth.changePassword(user, oldPass, confirmNewPass)
      })
      .then(_ => {
        message.success(validateMessages.successPass)
        resetDrawer()
      })
      .catch(err => {
        console.log(err.message)
        if (err.message.indexOf('Attempt limit exceeded') > -1) {
          message.error(validateMessages.limitExceeded)
        }
        if (err.message.indexOf('Incorrect') > -1) {
          message.error(validateMessages.oldPassNotMatch)
        }
      })
  }

  return (
    <Drawer
      id='reset-pass-drawer'
      placement='right'
      closable={false}
      onClose={props.closable}
      visible={props.visible}
      width={500}
      destroyOnClose
    >
      <div>
        <Title> {'Cambiar contraseña'} </Title>
        <Divider className={'divider-custom-margins-users'} />
        {/*Fields section*/}
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={24} sm={24} md={24} lg={24}>
            <div className={'title-space-field'}>Contraseña actual</div>
            <Input.Password
              value={oldPass}
              onChange={e => setOldPass(e.target.value)}
              placeholder={'Escribe tu contraseña actual'}
              size={'large'}
            />
          </Col>
        </Row>
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={24} sm={24} md={24} lg={24}>
            <div className={'title-space-field'}>Nueva contraseña</div>
            <Input.Password
              value={newPass}
              onChange={e => setNewPass(e.target.value)}
              placeholder={'Escribe tu nueva contraseña'}
              size={'large'}
            />
          </Col>
        </Row>
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={24} sm={24} md={24} lg={24}>
            <div className={'title-space-field'}>
              Confirmar nueva contraseña
            </div>
            <Input.Password
              value={confirmNewPass}
              onChange={e => setConfirmNewPass(e.target.value)}
              placeholder={'Escribe otra vez tu nueva contraseña'}
              size={'large'}
            />
          </Col>
        </Row>
      </div>
      {/*End Fields section*/}
      <div>
        <Divider className={'divider-custom-margins-users'} />
        {/*Footer buttons section*/}
        <Row gutter={16}>
          <Col xs={24} sm={24} md={24} lg={24}>
            <div className='text-right'>
              <div>
                <Button
                  type={'link'}
                  className='cancel-button'
                  onClick={resetDrawer}
                >
                  Cancelar
                </Button>
                <Button
                  htmlType='submit'
                  className='title-cabisa new-button'
                  onClick={submitPassHandler}
                >
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

export default ResetPassword
