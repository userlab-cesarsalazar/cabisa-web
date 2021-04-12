import React, { useState } from 'react'
import { withRouter } from 'react-router'
import { Card, message, Spin } from 'antd'
import UsersSrc from './usersSrc'
import { Auth } from 'aws-amplify'
import '../../amplify_config'
import { catchingErrors } from '../../utils/Utils'
// UI components
import HeaderPage from '../../components/HeaderPage'
import UserFields from './components/userFields'
import UserSrc from './usersSrc'

function UserView(props) {
  const [loading, setLoading] = useState(false)

  const saveData = async data => {
    setLoading(true)
    try {
      //verify is user existe on BD

      let existsUser = await UserSrc.getUsersPermissions(
        encodeURIComponent(data.email)
      )

      if (existsUser.message.length === 0) {
        //Create user on cognito
        let awsUserCreate = await createUserCognito(
          data.fullName.replace(' ', ''),
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
            message.error(catchingErrors(err))
          })
      } else {
        setLoading(false)
        message.warning(
          catchingErrors('The provided email is already registered')
        )
      }
    } catch (err) {
      setLoading(false)
      console.log('Error on SING UP', err)
      message.warning(catchingErrors(err.code))
    }
  }

  const createUserCognito = async (username, password, email) => {
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
      setLoading(false)
      console.log('error signing up:', error)
      message.warning(catchingErrors(error.code))
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
