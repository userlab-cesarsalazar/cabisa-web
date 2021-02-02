import React from 'react'
import { Drawer } from 'antd'
import ClientFields from './clientFields'

function ClientsDrawer(props) {
  const onSaveButton = (method, data, id) => {
    console.log('Edit Client')
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
      <ClientFields
        saveUserData={onSaveButton}
        visible={props.visible}
        edit={props.edit}
        editData={props.editData}
        cancelButton={props.cancelButton}
      />
    </Drawer>
  )
}

export default ClientsDrawer
