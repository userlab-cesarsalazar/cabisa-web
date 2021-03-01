import React, { useState } from 'react'
import { Button, Col, Divider, Drawer, Input, Row, Typography } from 'antd'

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
  }

  const resetDrawer = () => {
    setOldPass('')
    setNewPass('')
    setConfirmNewPass('')
    props.closable()
  }

  const submitPassHandler = () => {
    console.log('Reset password')
  }

  return (
    <Drawer
      id='reset-pass-drawer'
      placement='right'
      closable={false}
      onClose={props.closable}
      visible={props.visible}
      width={500}
    >
      <div>
        <Title> {'Cambiar contraseña'} </Title>
        <Divider className={'divider-custom-margins-users'} />
        {/*Fields section*/}
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={24} sm={24} md={24} lg={24}>
            <div className={'title-space-field'}>Contraseña actual</div>
            <Input
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
            <Input
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
            <Input
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
