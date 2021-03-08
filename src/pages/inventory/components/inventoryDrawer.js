import React from 'react'
import { Button, Col, Drawer, Row } from 'antd'
import InventoryFields from './inventoryFields'
import InventoryHistory from './invetoryHistory'

function InventoryDrawer(props) {
  const onSaveBtn = (method, data, id) => {
    console.log('Edit Item')
    console.log('method', method)
    console.log('data', data)
    console.log('id', id)
  }

  const dataDummy = [
    {
      id: 1,
      date: '2021-03-09',
      description: 'Ejemplo de descripcion historial..',
    },
    {
      id: 2,
      date: '2021-03-09',
      description: 'Ejemplo de descripcion historial..2',
    },
  ]

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
      <InventoryHistory dataDetail={dataDummy} />
    </Drawer>
  )
}

export default InventoryDrawer
