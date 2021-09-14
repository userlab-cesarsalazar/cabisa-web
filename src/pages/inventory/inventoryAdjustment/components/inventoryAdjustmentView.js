import React from 'react'
import { Card } from 'antd'
import HeaderPage from '../../../../components/HeaderPage'
import InventoryAdjustmentFields from './inventoryAdjustmentFields'
import { permissions } from '../../../../commons/types'
import inventorySrc from '../../inventorySrc'

function InventoryAdjustmentView() {
  const saveData = async data => inventorySrc.createAdjustment(data)

  return (
    <>
      <HeaderPage
        title={'Crear Ajuste de inventario'}
        permissions={permissions.INVENTARIO}
      />
      <Card className={'card-border-radius margin-top-15'}>
        <InventoryAdjustmentFields forbidEdition={false} saveData={saveData} />
      </Card>
    </>
  )
}
export default InventoryAdjustmentView
