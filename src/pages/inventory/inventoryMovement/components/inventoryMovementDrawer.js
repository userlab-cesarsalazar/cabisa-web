import React from 'react'
import { Drawer } from 'antd'
import InventoryMovementFields from './inventoryMovementFields'
import inventorySrc from '../../inventorySrc'

function InventoryMovementDrawer(props) {
  const saveData = async data => {
    await inventorySrc.updatePurchase(data)
    return props.getPurchases()
  }

  return (
    <Drawer
      placement='right'
      closable={false}
      onClose={props.closable}
      visible={props.visible}
      width='80%'
      destroyOnClose
    >
      <InventoryMovementFields
        forbidEdition={props.forbidEdition}
        visible={props.visible}
        editData={props.editData}
        saveData={saveData}
        onClose={props.closable}
        isEditing
      />
    </Drawer>
  )
}

export default InventoryMovementDrawer
