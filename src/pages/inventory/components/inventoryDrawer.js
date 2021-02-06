import React from 'react'
import { Drawer } from 'antd'
import InventoryFields from './inventoryFields'

function InventoryDrawer(props) {
  const onSaveBtn = (method, data, id) => {
    console.log('Edit Item')
    console.log('method', method)
    console.log('data', data)
    console.log('id', id)
  }

  return (
    <Drawer
      placement='right'
      closable={false}
      onClose={props.closable}
      visible={props.visible}
      width={800}
    >
      <InventoryFields
        saveUserData={onSaveBtn}
        visible={props.visible}
        edit={props.edit}
        editData={props.editData}
        cancelButton={props.cancelButton}
      />
    </Drawer>
  )
}

export default InventoryDrawer
