import React, { useState } from 'react'
import HeaderPage from '../../../components/HeaderPage'
import { Card, message, Spin } from 'antd'
import InventorySrc from '../inventorySrc'
import ServiceFields from './components/serviceFields'

function ServiceView(props) {
  const [viewLoading, setViewLoading] = useState(false)

  const saveData = (method, data, user_id) => {
    let newDataObj = {
      name: data.description,
      category_id: data.category,
      service_type_id: data.service,
      code: data.code,
      cost: data.price,
      engine_number: null,
      is_active: data.is_active,
    }
    setViewLoading(true)
    InventorySrc.createProduct(newDataObj)
      .then(_ => {
        message.success('Elemento creado.')
        props.history.push('/inventoryServices')
      })
      .catch(err => {
        setViewLoading(false)
        console.log('err', err)
        message.warning('No se ha podido guardar la informacion.')
      })
  }

  return (
    <Spin spinning={viewLoading}>
      <HeaderPage title={'Crear Nuevo Servicio'} permissions={5} />
      <Card className={'card-border-radius margin-top-15'}>
        <ServiceFields
          saveUserData={saveData}
          visible={true}
          edit={false}
          data={props.editData}
          cancelButton={props.cancelButton}
        />
      </Card>
    </Spin>
  )
}
export default ServiceView
