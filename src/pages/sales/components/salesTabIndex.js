import React from 'react'
import { Tabs } from 'antd'
import ShippingNote from './shippingNote/shippingNoteIndex'
import ReceiptNote from './receiptNote/receiptNoteIndex'
const { TabPane } = Tabs

function SalesTabIndex() {
  return (
    <>
      <Tabs id={'shippingNote'} defaultActiveKey='1'>
        <TabPane tab='Nota de envio' key='1'>
          <ShippingNote />
        </TabPane>
        <TabPane tab='Nota de recibo' key='2'>
          <ReceiptNote />
        </TabPane>
      </Tabs>
    </>
  )
}
export default SalesTabIndex
