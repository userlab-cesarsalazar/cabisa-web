import React, { useState } from 'react'
import HeaderPage from '../../../../components/HeaderPage'
import { Card, message, Spin } from 'antd'
import InventoryMovementFields from './inventoryMovementFields'

function InventoryMovementView(props) {
  const [viewLoading, setViewLoading] = useState(false)

  const saveData = (method, data, user_id) => {
    console.log('NEW INVENTORY MOVEMENT', data)
    setViewLoading(true)
    setTimeout(() => {
      message.success('Elemento creado.')
      props.history.push('/inventory')
    }, 1000)
  }

  return (
    <Spin spinning={viewLoading}>
      <HeaderPage title={'Crear Movimiento de inventario'} permissions={5} />
      <Card className={'card-border-radius margin-top-15'}>
        <InventoryMovementFields
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
export default InventoryMovementView
