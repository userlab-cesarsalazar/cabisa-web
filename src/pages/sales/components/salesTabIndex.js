import React from 'react'
import { Tabs } from 'antd'
//import ShippingNote from './shippingNote/shippingNoteView'
//import ReceiptNote from './receiptNote/receiptNoteIndex'
import ServiceNote from './serviceNote/serviceNoteIndex'
const { TabPane } = Tabs

function SalesTabIndex() {
  return (
    <>
      <Tabs id={'shippingNote'} defaultActiveKey='1'>
        <TabPane tab='Nota de servicio' key='1'>
          <ServiceNote />
        </TabPane>
      </Tabs>
    </>
  )
}
export default SalesTabIndex
