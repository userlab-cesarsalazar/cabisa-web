import React from 'react'
import { withRouter } from 'react-router'
import { Card } from 'antd'

// UI components
import HeaderPage from '../../components/HeaderPage'
import UserFields from './components/userFields'

function UserView(props) {
  const saveData = (data, user_id, method) => {
    console.log('Save new Client')
    console.log('data', data)
    console.log('user_id', user_id)
    console.log('method', method)
  }

  return (
    <>
      <HeaderPage titleButton={'Nuevo usuario'} title={'Crear Usuario'} />
      <Card className={'card-border-radius margin-top-15'}>
        <UserFields
          saveUserData={saveData}
          visible={true}
          edit={false}
          data={props.editData}
          cancelButton={props.cancelButton}
        />
      </Card>
    </>
  )
}
export default withRouter(UserView)
