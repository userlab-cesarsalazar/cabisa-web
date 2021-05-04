import React, { useState } from 'react'
import { Drawer, message, Spin } from 'antd'
import ProductFields from './productFields'
import InventoryHistory from '../../components/invetoryHistory'
import InventorySrc from '../../inventorySrc'

function ProductDrawer(props) {
  const [loadingDrawer, setLoadingDrawer] = useState(false)

  const onSaveBtn = (method, data, id) => {
    console.log('Edit Item from drawer')

    let editDataObj = {
      id: id,
      name: data.description,
      description: data.description,
      category_id: data.category,
      service_type_id: data.service,
      code: data.code,
      serial_number: data.serie,
      cost: data.price,
      engine_number: null,
      is_active: data.is_active,
    }
    setLoadingDrawer(true)
    InventorySrc.updateProduct(editDataObj)
      .then(_ => {
        message.success('Elemento actualizado.')
        props.closeAfterSave()
        setLoadingDrawer(false)
      })
      .catch(err => {
        setLoadingDrawer(false)
        console.log('ERROR ON UPDATE PRODUCT', err)
        message.warning('No se ha podido actualizar el elemento.')
      })
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
      <Spin spinning={loadingDrawer}>
        <ProductFields
          saveUserData={onSaveBtn}
          visible={props.visible}
          edit={props.edit}
          editData={props.editData}
          cancelButton={props.cancelButton}
        />
        <InventoryHistory dataDetail={[]} />
      </Spin>
    </Drawer>
  )
}

export default ProductDrawer
