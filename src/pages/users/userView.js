import React, { useState } from 'react'
import { withRouter } from 'react-router'
import { Card, message, Spin } from 'antd'
import UsersSrc from './usersSrc'
import { Auth } from 'aws-amplify'
import '../../amplify_config'
// UI components
import HeaderPage from '../../components/HeaderPage'
import UserFields from './components/userFields'

function UserView(props) {
  const [loading, setLoading] = useState(false)

  const saveData = async data => {
    setLoading(true)
    try {
      console.log(data)
      let awsUserCreate = await createUserCognito(
        data.fullName.replace(' ', ''),
        data.password,
        data.email
      )
      if (!awsUserCreate) throw 'Error on aws cognito create user'

      UsersSrc.createUser(data)
        .then(_ => {
          message.success('Usuario creado')
          props.history.push('/users')
        })
        .catch(err => {
          setLoading(false)
          console.log('ERROR ON CREATING USER', err)
          message.warning('El usuario no se ha podido crear 1')
        })
    } catch (err) {
      setLoading(false)
      console.log(err)
      message.warning('El usuario no se ha podido crear 2')
    }
  }

  const createUserCognito = async (username, password, email) => {
    console.log(username)
    try {
      const { user } = await Auth.signUp({
        username: username,
        password: password,
        attributes: {
          email: email,
          name: username,
        },
      })
      console.log('Usuario creado en cognito', user)
      return true
    } catch (error) {
      console.log('error signing up:', error)
      return false
    }
  }

  return (
    <Spin spinning={loading}>
      <HeaderPage title={'Crear Usuario'} permissions={2} />
      <Card className={'card-border-radius margin-top-15'}>
        <UserFields
          saveUserData={saveData}
          visible={true}
          edit={false}
          data={props.editData}
          cancelButton={props.cancelButton}
        />
      </Card>
    </Spin>
  )
}
export default withRouter(UserView)
