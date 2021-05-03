import React, { useEffect, useState } from 'react'
import HeaderPage from '../../../components/HeaderPage'
import InventoryModule from '../components/inventoryModule'
import InventorySrc from '../inventorySrc'
import { message } from 'antd'

function ServiceIndex() {
  const [inventoryServices, setInventoryServices] = useState([])

  useEffect(() => {
    getServices()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getServices = () => {
    //GET ALL PRODUCTOS
    InventorySrc.getProducts()
      .then(result => {
        setInventoryServices(
          result.message.filter(data => data.category_id === 1)
        )
      })
      .catch(err => {
        console.log('ERROR ON GET INVENTORY PRODUCTS', err)
        message.warning('No se ha podido obtener informacion del inventario.')
      })
  }

  const searchByText = (name, type) => {
    //GET FILTER PRODUCTOS BY NAME
    InventorySrc.getProductsFilter(name)
      .then(result => {
        if (type === 'Module') {
          setInventoryServices(
            result.message.filter(data => data.category_id === 1)
          )
        }
      })
      .catch(err => {
        console.log('ERROR ON GET INVENTORY PRODUCTS', err)
        message.warning('No se ha podido obtener informacion del inventario.')
      })
  }

  const deleteService = data => {
    InventorySrc.deleteProduct(data)
      .then(_ => {
        message.success('Elemento eliminado')
        getServices()
      })
      .catch(err => {
        console.log('ERROR ON DELETE ELEMENT', err)
      })
  }

  return (
    <>
      <HeaderPage titleButton={''} title={'Servicios'} permissions={5} />
      <InventoryModule
        title={'Servicios'}
        searchModuleByTxt={searchByText}
        dataSource={inventoryServices}
        closeAfterSave={getServices}
        deleteItemModule={deleteService}
      />
    </>
  )
}

export default ServiceIndex
