import React from 'react'
import { Drawer } from 'antd'
import InventoryMovementFields from './inventoryMovementFields'

function InventoryMovementDrawer(props) {
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
        forbidEdition={true}
        visible={props.visible}
        editData={props.editData}
      />
    </Drawer>
  )
}

export default InventoryMovementDrawer
