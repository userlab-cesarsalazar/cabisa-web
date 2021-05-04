import React, { useState } from 'react'
import { Drawer, message, Spin } from 'antd'
import InventoryMovementFields from './inventoryMovementFields'

function InventoryMovementDrawer(props) {
  const [loadingDrawer, setLoadingDrawer] = useState(false)

  const onSaveBtn = (method, data, id) => {
    console.log('Edit Item from drawer movement', data)
    setLoadingDrawer(true)
    setTimeout(() => {
      message.success('Elemento actualizado.')
      props.closeAfterSave()
      setLoadingDrawer(false)
    }, 1000)
  }

  return (
    <Drawer
      placement='right'
      closable={false}
      onClose={props.closable}
      visible={props.visible}
      width={800}
    >
      <Spin spinning={loadingDrawer}>
        <InventoryMovementFields
          saveUserData={onSaveBtn}
          visible={props.visible}
          edit={props.edit}
          editData={props.editData}
          cancelButton={props.cancelButton}
        />
      </Spin>
    </Drawer>
  )
}

export default InventoryMovementDrawer
