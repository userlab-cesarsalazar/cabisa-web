import React from 'react'
import HeaderPage from '../../../components/HeaderPage'
import InventoryAdjustmentComponent from './components/inventoryAdjustment'
import { permissions } from '../../../commons/types'

function inventoryAdjustmentIndex() {
  return (
    <>
      <HeaderPage
        titleButton={''}
        title={'Ajustes de inventario'}
        permissions={permissions.INVENTARIO}
      />
      <InventoryAdjustmentComponent />
    </>
  )
}

export default inventoryAdjustmentIndex
