import React, { useState, useContext } from 'react'
import { Form, Input, Button, Row, message } from 'antd'
import { Context } from '../../context'

function Login() {
  const [_, dispatch] = useContext(Context) // eslint-disable-line
  const [loading, setLoading] = useState(false)
  const userDummy = {
    id: '01',
    email: 'luis.deleon@userlab.co',
    first_name: 'Luis',
    last_name: 'De leon',
    avatar: '',
  }

  const handleSubmit = async value => {
    try {
      setLoading(true)
      let usernameE = value.username
      let passwordE = value.password

      if (!usernameE || !passwordE) {
        throw 'Debes ingresar usuario y contraseña'
      } else {
        setLoading(false)
        dispatch({
          type: 'USERS FETCHED',
          payload: userDummy,
        })
        setLoading(false)
        console.log('Ingresar')
      }
    } catch (err) {
      setLoading(false)
      message.error(err)
    }
  }

  const onFinishFailed = errorInfo => {
    errorInfo.errorFields.map(error => message.error(error.errors))
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
    </Row>
  )
}
export default Login
