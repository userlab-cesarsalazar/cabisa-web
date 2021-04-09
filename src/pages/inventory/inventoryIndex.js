import React, { useState, useEffect } from 'react'
import { message, Tabs } from 'antd'
import InventoryModule from './components/inventoryModule'
import InventoryWarehouse from './components/inventoryWarehouse'
import HeaderPage from '../../components/HeaderPage'
import InvetorySrc from './invetorySrc'

const { TabPane } = Tabs

function Inventory() {
  const [inventoryProducts, setInventoryProducts] = useState([])
  const [inventoryWarehouse, setInventoryWarehouse] = useState([])

  useEffect(() => {
    getProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getProducts = () => {
    //GET ALL PRODUCTOS
    InvetorySrc.getProducts()
      .then(result => {
        setInventoryProducts(
          result.message.filter(data => data.category_id === 1)
        )
        setInventoryWarehouse(
          result.message.filter(data => data.category_id === 2)
        )
      })
      .catch(err => {
        console.log('ERROR ON GET INVENTORY PRODUCTS', err)
        message.warning('No se ha podido obtener informacion del inventario.')
      })
  }

  const searchByTxt = (name, type) => {
    //GET FILTER PRODUCTOS BY NAME
    InvetorySrc.getProductsFilter(name)
      .then(result => {
        if (type === 'Module') {
          setInventoryProducts(
            result.message.filter(data => data.category_id === 1)
          )
        } else {
          setInventoryWarehouse(
            result.message.filter(data => data.category_id === 2)
          )
        }
      })
      .catch(err => {
        console.log('ERROR ON GET INVENTORY PRODUCTS', err)
        message.warning('No se ha podido obtener informacion del inventario.')
      })
  }

  const deleteProduct = data => {
    InvetorySrc.deleteProduct(data)
      .then(_ => {
        message.success('Elemento eliminado')
        getProducts()
      })
      .catch(err => {
        console.log('ERROR ON DELETE ELEMENT', err)
      })
  }

  return (
    <>
      <HeaderPage titleButton={''} title={'Inventario'} permissions={5} />
      <Tabs id={'generalInventory'} defaultActiveKey='1'>
        <TabPane tab='Servicio - Equipo' key='1'>
          <InventoryModule
            title={'Inventario'}
            searchModuleByTxt={searchByTxt}
            dataSource={inventoryProducts}
            closeAfterSave={getProducts}
            deleteItemModule={deleteProduct}
          />
        </TabPane>
        <TabPane tab='Repuestos/Bodega' key='2'>
          <InventoryWarehouse
            title={'Repuestos - Bodega'}
            searchWarehouseByTxt={searchByTxt}
            dataSource={inventoryWarehouse}
            closeAfterSaveWareHouse={getProducts}
            deleteItemWareHouse={deleteProduct}
          />
        </TabPane>
      </Tabs>
    </>
  )
}

export default Inventory
