import React, { useState } from 'react'
import HeaderPage from '../../components/HeaderPage'
import { Card, message, Spin } from 'antd'
import ClientFields from './components/clientFields'
import ClientsSrc from './clientsSrc'

function ClientView(props) {
  const [viewLoading, setViewLoading] = useState(false)

  const saveData = (method, data, user_id) => {
    if (!method) {
      setViewLoading(true)
      ClientsSrc.createClient(data)
        .then(_ => {
          message.success('Usuario creado.')
          props.history.push('/clients')
        })
        .catch(error => {
          setViewLoading(false)
          console.log('CREATE CLIENT ERROR ', error)
          return message.warning('No se ha podido guardar la informacion.')
        })
    }
  }

  return (
    <Spin spinning={viewLoading}>
      <HeaderPage title={'Crear Cliente'} permissions={7} />
      <Card className={'card-border-radius margin-top-15'}>
        <ClientFields
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
export default ClientView
