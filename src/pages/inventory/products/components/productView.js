import React, { useState } from 'react'
import HeaderPage from '../../../../components/HeaderPage'
import { Card, message, Spin } from 'antd'
import ProductFields from './productFields'
import InventoryHistory from '../../components/invetoryHistory'
import InventorySrc from '../../inventorySrc'

function ProductView(props) {
  const [viewLoading, setViewLoading] = useState(false)

  const saveData = (method, data, user_id) => {
    let newDataObj = {
      name: data.description,
      category_id: data.category,
      service_type_id: data.service,
      code: data.code,
      serial_number: data.serie,
      cost: data.price,
      engine_number: data.engine_number,
    }
    setViewLoading(true)
    InventorySrc.createProduct(newDataObj)
      .then(_ => {
        message.success('Elemento creado.')
        props.history.push('/inventoryProducts')
      })
      .catch(err => {
        setViewLoading(false)
        console.log('err', err)
        message.warning('No se ha podido guardar la informacion.')
      })
  }

  return (
    <Spin spinning={viewLoading}>
      <HeaderPage title={'Crear Producto'} permissions={5} />
      <Card className={'card-border-radius margin-top-15'}>
        <ProductFields
          warehouse={props.location.pathname.includes('warehouse')}
          saveUserData={saveData}
          visible={true}
          edit={false}
          data={props.editData}
          cancelButton={props.cancelButton}
        />
        <InventoryHistory dataDetail={[]} />
      </Card>
    </Spin>
  )
}
export default ProductView
