import React from 'react'
import HeaderPage from '../../../components/HeaderPage'
import InventoryMovementComponent from './components/inventoryMovement'
import { permissions } from '../../../commons/types'

function InventoryMovementIndex() {
  return (
    <>
      <HeaderPage
        titleButton={''}
        title={'Movimientos de inventario'}
        permissions={permissions.INVENTARIO}
      />
      <InventoryMovementComponent />
    </>
  )
}

export default InventoryMovementIndex
