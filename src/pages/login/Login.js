import React, { useState } from 'react'
import { Modal, Form, Input, Button, Row, message, Col } from 'antd'
import { Auth, Cache } from 'aws-amplify'
import '../../amplify_config'
import UserSrc from '../users/usersSrc'

function Login() {
  const [cognitoUserInfo, setCognitoUserInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')

  const handleSubmit = async value => {
    try {
      setLoading(true)
      let usernameE = value.username
      let passwordE = value.password

      if (!usernameE || !passwordE) {
        throw 'Debes ingresar usuario y contraseña'
      } else {
        Auth.signIn(usernameE, passwordE)
          .then(user => {
            console.log('signIn response', user)

            if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
              setCognitoUserInfo(user)
              setIsModalVisible(true)
              return
            }

            UserSrc.getUsersPermissions(user.attributes.email)
              .then(userData => {
                let profileSettings = {
                  token: '',
                  userName: '',
                  userPermissions: null,
                }

                profileSettings.userPermissions =
                  userData.message[0].permissions
                profileSettings.token =
                  user.signInUserSession.accessToken.jwtToken
                profileSettings.userName = user.attributes.name

                if (profileSettings.userPermissions === null) {
                  message.error(
                    'El usuario no contiene permisos, consulte a su administrador'
                  )
                  setLoading(false)
                } else {
                  Cache.setItem('currentSession', profileSettings)
                  message.success('Bienvenido!')
                  window.location.reload(false)
                }
              })
              .catch(err => {
                console.log('ERROR ON GET USER PERMISSIONS', err)
                message.error('Error al obtener permisos del usuario')
              })
          })
          .catch(e => {
            if (
              e.message.indexOf('UserMigration failed') > -1 ||
              e.message.indexOf('Incorrect') > -1
            ) {
              message.error('Usuario/Password incorrectos')
              setLoading(false)
            }
          })
      }
    } catch (err) {
      setLoading(false)
      message.error(err)
    }
  }

  const onFinishFailed = errorInfo => {
    errorInfo.errorFields.map(error => message.error(error.errors))
  }

  const confirmUser = () => {
    if (newPass === '') {
      return message.error('Debes ingresar tu Nueva contraseña')
    }

    if (newPass !== confirmPass) {
      return message.error('Contraseñas no coinciden')
    }

    Auth.completeNewPassword(cognitoUserInfo, confirmPass, {
      name: cognitoUserInfo.username,
    })
      .then(_ => {
        setIsModalVisible(false)
        message.success('Bien.. Ahora puedes Iniciar session!')
      })
      .catch(err => {
        console.log(err)
        message.error('Ha ocurrido un error vuelve a intentarlo')
      })
  }

  const cancelModal = () => {
    setLoading(false)
    setIsModalVisible(false)
  }

  return (
    <Row
      type='flex'
      justify='center'
      align='middle'
      className={'login-row-container'}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <img
          src={process.env.PUBLIC_URL + '/cabisa-logo.png'}
          className={'login-logo-lg'}
          alt={'moocho'}
        />

        <div className={'login-container'}>
          <Form
            name='login-form'
            onFinish={handleSubmit}
            onFinishFailed={onFinishFailed}
            style={{ width: '400px' }}
            labelAlign={'left'}
            labelCol={{ xs: 24, sm: 24, md: 24, lg: 24 }}
            wrapperCol={{ xs: 24, sm: 24, md: 24, lg: 24 }}
            colon={false}
          >
            <Form.Item
              style={{ textAlign: 'left' }}
              label='Usuario'
              name='username'
              rules={[
                {
                  message: 'Ingresa un username valido',
                  type: 'string',
                },
              ]}
            >
              <Input placeholder={'Escribe tu usuario'} size={'large'} />
            </Form.Item>
            <Form.Item
              style={{ textAlign: 'left' }}
              label='Contraseña'
              name='password'
            >
              <Input.Password
                placeholder={'Escribe tu contraseña'}
                size={'large'}
              />
            </Form.Item>

            <div
              className={'login-button-container'}
              style={{ paddingBottom: '25px' }}
            >
              <Button type={'link'} className={'login-btn-link'}>
                ¿No recuerdas tu contraseña? Contacta con el administrador de tu
                cuenta
              </Button>
            </div>
            <div className={'login-button-container'}>
              <Form.Item>
                <Button
                  style={{ width: '200px' }}
                  className='bottom-login login-btn'
                  disabled={loading}
                  loading={loading}
                  type='primary'
                  htmlType='submit'
                >
                  Iniciar sesion
                </Button>
              </Form.Item>
              <span className={'login-btn-link title-space-top'}>
                V - {process.env.REACT_APP_VERSION}
              </span>
            </div>
          </Form>
        </div>
      </div>

      <Modal
        title='Ingresa tu nueva contraseña'
        visible={isModalVisible}
        onOk={confirmUser}
        onCancel={cancelModal}
      >
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Input.Password
              placeholder={'Ingrese Nueva contraseña'}
              value={newPass}
              onChange={value => setNewPass(value.target.value)}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Input.Password
              type={'password'}
              placeholder={'Confirmar contraseña'}
              value={confirmPass}
              onChange={value => setConfirmPass(value.target.value)}
            />
          </Col>
        </Row>
      </Modal>
    </Row>
  )
}
export default Login
