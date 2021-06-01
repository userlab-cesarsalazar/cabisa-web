import React from 'react'
import HeaderPage from '../../../components/HeaderPage'
import InventoryMovementComponent from './components/inventoryMovement'

function InventoryMovementIndex() {
  return (
    <>
      <HeaderPage
        titleButton={''}
        title={'Movimientos de inventario'}
        permissions={5}
      />
      <InventoryMovementComponent />
    </>
  )
}

export default InventoryMovementIndex
