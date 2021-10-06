import React from 'react'
import { Card, Drawer } from 'antd'
import PaymentsFields from './paymentsFields'

function PaymentsDetail(props) {
  return (
    <Drawer
      placement='right'
      closable={false}
      onClose={props.closable}
      visible={props.visible}
      width='80%'
      destroyOnClose
    >
      <Card className={'card-border-radius margin-top-15'}>
        <PaymentsFields
          visible={props.visible}
          edit={true}
          loading={props.loading}
          setLoading={props.setLoading}
          detailData={props.detailData}
          paymentMethodsOptionsList={props.paymentMethodsOptionsList}
          cancelButton={props.closable}
        />
      </Card>
    </Drawer>
  )
}

export default PaymentsDetail
