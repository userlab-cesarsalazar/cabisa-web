import React, { useState, useEffect } from 'react'
import { message, Tabs, Typography } from 'antd'
import InventoryModule from './components/inventoryModule'
import InventoryWarehouse from './components/inventoryWarehouse'
import HeaderPage from '../../components/HeaderPage'
import InvetorySrc from './invetorySrc'

const { TabPane } = Tabs
const { Title } = Typography

function Inventory() {
  useEffect(() => {
    getProducts()
  }, [])

  const [inventoryProducts, setInventoryProducts] = useState([])
  const [inventoryWarehouse, setInventoryWarehouse] = useState([])

  const getProducts = () => {
    //GET ALL PRODUCTOS
    InvetorySrc.getProducts()
      .then(result => {
        console.log('PRODUCTOS', result)
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

  return (
    <>
      <HeaderPage titleButton={''} title={'Inventario'} />
      <Tabs id={'generalInventory'} defaultActiveKey='1'>
        <TabPane tab='Servicio - Equipo' key='1'>
          <InventoryModule title={'Inventario'} />
        </TabPane>
        <TabPane tab='Repuestos/Bodega' key='2'>
          <InventoryWarehouse title={'Repuestos - Bodega'} />
        </TabPane>
      </Tabs>
    </>
  )
}

export default Inventory
