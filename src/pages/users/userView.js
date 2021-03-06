import React, { useState } from 'react'
import { withRouter } from 'react-router'
import { Card, message, Spin } from 'antd'
import UsersSrc from './usersSrc'
import { Auth } from 'aws-amplify'
import '../../amplify_config'
import { showErrors } from '../../utils'
// UI components
import HeaderPage from '../../components/HeaderPage'
import UserFields from './components/userFields'
import { permissions } from '../../commons/types'

function UserView(props) {
  const [loading, setLoading] = useState(false)

  const saveData = async data => {
    setLoading(true)
    try {
      //verify is user existe on BD
      let existsUser = await UsersSrc.getUsersPermissions(
        encodeURIComponent(data.email)
      )

      if (existsUser.length === 0) {
        //Create user on cognito
        let awsUserCreate = await createUserCognito(
          data.fullName.replace(/\s/g, ''),
          data.password,
          data.email
        )
        if (!awsUserCreate) return
        //Create user on BD
        UsersSrc.createUser(data)
          .then(_ => {
            message.success('Usuario creado')
            props.history.push('/users')
          })
          .catch(err => {
            setLoading(false)
            console.log('ERROR ON CREATING USER BD', err)
            showErrors(err)
          })
      } else {
        setLoading(false)
        message.warning('The provided email is already registered')
      }
    } catch (err) {
      setLoading(false)
      console.log('Error on SING UP', err)
      showErrors(err)
    }
  }

  const createUserCognito = async (username, password, email) => {
    try {
      console.log('USERNAME', username)
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
      setLoading(false)
      console.log('error signing up:', error)
      showErrors(error)
      return false
    }
  }

  return (
    <Spin spinning={loading}>
      <HeaderPage title={'Crear Usuario'} permissions={permissions.USUARIOS} />
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
