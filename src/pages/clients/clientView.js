import React, { useState } from 'react'
import HeaderPage from '../../components/HeaderPage'
import { Card, message, Spin } from 'antd'
import ClientFields from './components/clientFields'
import ClientsSrc from './clientsSrc'
import { showErrors } from '../../utils'
import { permissions } from '../../commons/types'

function ClientView(props) {
  const [viewLoading, setViewLoading] = useState(false)

  const saveData = data => {
    setViewLoading(true)

    ClientsSrc.createClient(data)
      .then(() => {
        message.success('Usuario creado.')
        props.history.push('/clients')
      })
      .catch(error => {
        console.log('CREATE CLIENT ERROR ', error)
        showErrors(error)
      })
      .finally(() => setViewLoading(false))
  }

  return (
    <Spin spinning={viewLoading}>
      <HeaderPage title={'Crear Cliente'} permissions={permissions.CLIENTES} />
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
