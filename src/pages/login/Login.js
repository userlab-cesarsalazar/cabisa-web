import React, { useState } from 'react'
import {
  Modal,
  Form,
  Input,
  Button,
  Row,
  message,
  Col,
  notification,
  Spin,
} from 'antd'
import { Auth, Cache } from 'aws-amplify'
import '../../amplify_config'
import UserSrc from '../users/usersSrc'
import { catchingErrors } from '../../utils/Utils'
const mssError = 'Debes ingresar usuario y contraseña'

function Login() {
  const [cognitoUserInfo, setCognitoUserInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')

  const [confirmUsername, setConfirmUsername] = useState('')
  const [codeConfirm, setCodeConfirm] = useState('')
  const [isModalConfirmVisible, setIsModalConfirmVisible] = useState(false)

  const handleSubmit = async value => {
    try {
      setLoading(true)
      let usernameE = value.username
      let passwordE = value.password

      if (!usernameE || !passwordE) {
        throw mssError
      } else {
        Auth.signIn(usernameE, passwordE)
          .then(user => {
            if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
              setCognitoUserInfo(user)
              setIsModalVisible(true)
              return
            }

            UserSrc.getUsersPermissions(
              encodeURIComponent(user.attributes.email)
            )
              .then(userData => {
                let profileSettings = {
                  token: '',
                  userName: '',
                  userPermissions: null,
                  email: user.attributes.email,
                  rol_id: userData.message[0].rol_id,
                }

                profileSettings.userPermissions =
                  userData.message[0].permissions
                profileSettings.token =
                  user.signInUserSession.accessToken.jwtToken
                profileSettings.userName = user.attributes.name

                if (profileSettings.userPermissions === null) {
                  message.error('Usuario/Password incorrectos')
                  setLoading(false)
                } else {
                  Cache.setItem('currentSession', profileSettings)
                  message.success('Bienvenido!')
                  window.location.reload(false)
                }
              })
              .catch(err => {
                setLoading(false)
                console.log('ERROR ON GET USER PERMISSIONS', err)
                message.error('Usuario/Password incorrectos')
              })
          })
          .catch(e => {
            console.error('ERROR ON LOGIN', e)
            setLoading(false)
            if (e.message.indexOf('User is not confirmed.') > -1) {
              openNotification()
            } else {
              message.error(catchingErrors(e.message))
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

  const completeNewPassword = () => {
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

  const confirmUser = async () => {
    setLoading(true)
    try {
      if (confirmUsername === '' || codeConfirm === '') {
        setLoading(false)
        return message.error('Usuario y codigo son obligatorios')
      }
      await Auth.confirmSignUp(confirmUsername, codeConfirm)
      setLoading(false)
      message.success('Cuenta Confirmada!')
      setIsModalConfirmVisible(false)
    } catch (error) {
      setLoading(false)
      console.log('error confirming sign up', error)
      message.warning(
        'No se ha podido confirmar su cuenta, verifica el usuario o el codigo.'
      )
    }
  }

  const cancelModal = () => {
    setLoading(false)
    setIsModalVisible(false)
    setIsModalConfirmVisible(false)
    setConfirmUsername('')
    setCodeConfirm('')
  }

  const openNotification = () => {
    const key = `open${Date.now()}`
    const btn = (
      <Button
        type='primary'
        size='small'
        onClick={() => {
          setIsModalConfirmVisible(true)
          notification.close(key)
        }}
      >
        Confirmar cuenta
      </Button>
    )
    notification.open({
      message: 'Confirmar cuenta',
      description:
        'Se ha enviado el codigo de confirmacion a tu correo electronico.',
      btn,
      key,
    })
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
        onOk={completeNewPassword}
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

      <Modal
        title='Confirma tu cuenta'
        visible={isModalConfirmVisible}
        onOk={confirmUser}
        onCancel={cancelModal}
      >
        <Spin spinning={loading}>
          <Row gutter={16} className={'section-space-field'}>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Input
                placeholder={'Ingrese usuario'}
                value={confirmUsername}
                onChange={value => setConfirmUsername(value.target.value)}
              />
            </Col>
            <Col xs={12} sm={12} md={12} lg={12}>
              <Input
                placeholder={'Ingrese codigo'}
                value={codeConfirm}
                onChange={value => setCodeConfirm(value.target.value)}
              />
            </Col>
          </Row>
        </Spin>
      </Modal>
    </Row>
  )
}
export default Login
