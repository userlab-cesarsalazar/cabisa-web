import React, { useEffect, useState } from 'react'
import { Cache } from 'aws-amplify'
import HeaderPage from '../../../components/HeaderPage'
import { Card, message, Spin } from 'antd'
import InventorySrc from '../inventorySrc'
import ServiceFields from './components/serviceFields'
import { showErrors, validateRole } from '../../../utils'

function ServiceView(props) {
  const [viewLoading, setViewLoading] = useState(false)
  const [serviceStatusList, setServiceStatusList] = useState([])

  const canViewPrice = validateRole(Cache.getItem('currentSession').rol_id, 1)

  useEffect(() => {
    setViewLoading(true)

    InventorySrc.getServicesStatus()
      .then(result => setServiceStatusList(result))
      .catch(err => {
        console.log('ERROR ON GET INVENTORY SERVICES', err)
        message.warning('No se ha podido obtener informacion del inventario.')
      })
      .finally(setViewLoading(false))
  }, [])

  const saveData = data => {
    setViewLoading(true)

    InventorySrc.createService(data)
      .then(_ => {
        message.success('Elemento creado.')
        props.history.push('/inventoryServices')
      })
      .catch(err => showErrors(err))
      .finally(setViewLoading(false))
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
          serviceStatusList={serviceStatusList}
          canViewPrice={canViewPrice}
        />
      </Card>
    </Spin>
  )
}
export default ServiceView
