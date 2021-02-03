import React from 'react'
import { Tabs } from 'antd'
const { TabPane } = Tabs

function SalesTabIndex() {
  return (
    <>
      <Tabs id={'shippingNote'} defaultActiveKey='1'>
        <TabPane tab='Nota de envio' key='1'>
          <h1>nota de Envio</h1>
        </TabPane>
        <TabPane tab='Nota de recibo' key='2'>
          <h1>nota de recibo</h1>
        </TabPane>
      </Tabs>
    </>
  )
}
export default SalesTabIndex
