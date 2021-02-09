import React from 'react'
import { Card, Drawer } from 'antd'
import BillingFields from './billingFields'
function DetailBilling(props) {
  const dataDummyDetails = [
    {
      quantity: '1',
      type_service: 1,
      description: 'Cabina',
      unit_price: '1000',
      sub_total: 1000,
    },
    {
      quantity: '3',
      type_service: 0,
      description: 'Pipa extractora',
      unit_price: '1000',
      sub_total: 3000,
    },
    {
      quantity: '1',
      type_service: 2,
      description: 'Aseroria',
      unit_price: '1000',
      sub_total: 1000,
    },
  ]
  return (
    <Drawer
      placement='right'
      closable={false}
      onClose={props.closable}
      visible={props.visible}
      width={850}
    >
      <Card className={'card-border-radius margin-top-15'}>
        <BillingFields
          visible={props.visible}
          edit={true}
          data={props.editData}
          dataDetail={dataDummyDetails}
        />
      </Card>
    </Drawer>
  )
}

export default DetailBilling
