import React from 'react'
import { Card } from 'antd'
import HeaderPage from '../../../../components/HeaderPage'
import InventoryMovementFields from './inventoryMovementFields'
import { permissions } from '../../../../commons/types'

function InventoryMovementView() {
  return (
    <>
      <HeaderPage
        title={'Crear Movimiento de inventario'}
        permissions={permissions.INVENTARIO}
      />
      <Card className={'card-border-radius margin-top-15'}>
        <InventoryMovementFields forbidEdition={false} />
      </Card>
    </>
  )
}
export default InventoryMovementView
