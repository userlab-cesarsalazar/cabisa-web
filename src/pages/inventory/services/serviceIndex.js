import React, { useEffect, useState, useCallback } from 'react'
import HeaderPage from '../../../components/HeaderPage'
import InventoryService from './components/inventoryService'
import InventorySrc from '../inventorySrc'
import { message } from 'antd'
import { showErrors } from '../../../utils'

function ServiceIndex() {
  const [inventoryServices, setInventoryServices] = useState([])
  const [serviceStatusList, setServiceStatusList] = useState([])
  const [searchText, setSearchText] = useState('')
  const [loading, setLoading] = useState(false)

  const getServices = useCallback(() => {
    setLoading(true)

    InventorySrc.getServices({ description: { $like: `${searchText}%` } })
      .then(result => setInventoryServices(result))
      .catch(err => {
        console.log('ERROR ON GET INVENTORY SERVICES', err)
        message.warning('No se ha podido obtener informacion del inventario.')
      })
      .finally(setLoading(false))
  }, [searchText])

  useEffect(() => {
    getServices()
  }, [getServices])

  useEffect(() => {
    setLoading(true)

    InventorySrc.getServicesStatus()
      .then(result => setServiceStatusList(result))
      .catch(err => {
        console.log('ERROR ON GET INVENTORY SERVICES', err)
        message.warning('No se ha podido obtener informacion del inventario.')
      })
      .finally(setLoading(false))
  }, [])

  const searchByTxt = description => setSearchText(description)

  const clearSearch = () => {
    if (searchText === '') getServices()
    else setSearchText('')
  }

  const deleteService = data => {
    setLoading(true)

    InventorySrc.deleteService(data)
      .then(_ => {
        message.success('Elemento eliminado')
        clearSearch()
      })
      .catch(err => showErrors(err))
      .finally(setLoading(false))
  }

  return (
    <>
      <HeaderPage titleButton={''} title={'Servicios'} permissions={5} />
      <InventoryService
        title={'Servicios'}
        searchByTxt={searchByTxt}
        clearSearch={clearSearch}
        dataSource={inventoryServices}
        deleteItemModule={deleteService}
        serviceStatusList={serviceStatusList}
        loading={loading}
      />
    </>
  )
}

export default ServiceIndex
