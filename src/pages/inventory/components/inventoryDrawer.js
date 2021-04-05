import React from 'react'
import { Drawer } from 'antd'
import InventoryFields from './inventoryFields'
import InventoryHistory from './invetoryHistory'
import InventorySrc from '../invetorySrc'

function InventoryDrawer(props) {
  const onSaveBtn = (method, data, id) => {
    console.log('Edit Item from drawer')
    console.log('id', id)

    let newDataObj = {
      "name": data.description,
      "category_id": data.category,
      "service_type_id": data.service,
      "code": data.code,
      "serial_number": data.serie,
      "cost": data.price
    }
    console.log('data',newDataObj)


  }

  // const dataDummy = [
  //   {
  //     id: 1,
  //     date: '2021-03-09',
  //     description: 'Ejemplo de descripcion historial..',
  //   },
  //   {
  //     id: 2,
  //     date: '2021-03-09',
  //     description: 'Ejemplo de descripcion historial..2',
  //   },
  // ]

  return (
    <Drawer
      placement='right'
      closable={false}
      onClose={props.closable}
      visible={props.visible}
      width={800}
    >
      <InventoryFields
        warehouse={props.warehouse}
        saveUserData={onSaveBtn}
        visible={props.visible}
        edit={props.edit}
        editData={props.editData}
        cancelButton={props.cancelButton}
      />
      <InventoryHistory dataDetail={[]} />
    </Drawer>
  )
}

export default InventoryDrawer
