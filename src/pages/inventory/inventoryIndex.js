import React from 'react'
import { Tabs, Typography } from 'antd'
import InventoryModule from './components/inventoryModule'
import InventoryWarehouse from './components/inventoryWarehouse'
import HeaderPage from '../../components/HeaderPage'
const { TabPane } = Tabs
const { Title } = Typography

function Inventory() {
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
