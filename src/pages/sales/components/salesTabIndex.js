import React from 'react'
import { Tabs } from 'antd'
import ServiceNote from './serviceNote/serviceNoteIndex'
const { TabPane } = Tabs

function SalesTabIndex(props) {
  return (
    <>
      <Tabs id={'shippingNote'} defaultActiveKey='1'>
        <TabPane tab='Nota de servicio' key='1'>
          <ServiceNote
            canEditAndCreate={props.canEditAndCreate}
            isAdmin={props.isAdmin}
          />
        </TabPane>
      </Tabs>
    </>
  )
}
export default SalesTabIndex
