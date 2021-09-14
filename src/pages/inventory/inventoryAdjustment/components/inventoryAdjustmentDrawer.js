import React from 'react'
import { Drawer } from 'antd'
import InventoryAdjustmentFields from './inventoryAdjustmentFields'

function InventoryAdjustmentDrawer(props) {
  return (
    <Drawer
      placement='right'
      closable={false}
      onClose={props.closable}
      visible={props.visible}
      width='80%'
      destroyOnClose
    >
      <InventoryAdjustmentFields
        forbidEdition={props.forbidEdition}
        visible={props.visible}
        editData={props.editData}
        onClose={props.closable}
        isEditing
      />
    </Drawer>
  )
}

export default InventoryAdjustmentDrawer
