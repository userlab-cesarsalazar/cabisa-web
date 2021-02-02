import React from 'react'
import HeaderPage from '../../components/HeaderPage'
import { Card } from 'antd'
import ClientFields from './components/clientFields'
function ClientView(props) {
  const saveData = (method, data, user_id) => {
    console.log('Save new user')
    console.log('data', data)
    console.log('method', method)
    console.log('user_id', user_id)
  }

  return (
    <>
      <HeaderPage titleButton={'Nuevo cliente'} title={'Crear Cliente'} />
      <Card className={'card-border-radius margin-top-15'}>
        <ClientFields
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
export default ClientView
