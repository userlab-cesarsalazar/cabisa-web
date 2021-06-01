import React from 'react'
import { Card } from 'antd'
import HeaderPage from '../../../../components/HeaderPage'
import InventoryMovementFields from './inventoryMovementFields'

function InventoryMovementView() {
  return (
    <>
      <HeaderPage title={'Crear Movimiento de inventario'} permissions={5} />
      <Card className={'card-border-radius margin-top-15'}>
        <InventoryMovementFields forbidEdition={false} />
      </Card>
    </>
  )
}
export default InventoryMovementView
