import React, { useState } from 'react'
import { Card, Drawer, message } from 'antd'
import PaymentsFields from './paymentsFields'
import PaymentsSrc from '../paymentsSrc'
import { showErrors } from '../../../utils'

function PaymentsDetail(props) {
  const [loading, setLoading] = useState(false)

  const handleSaveData = data => {
    setLoading(true)

    PaymentsSrc.crupdatePayment(data)
      .then(a => {
        console.log(a)
        message.success('Pagos grabados exitosamente')
      })
      .catch(error => showErrors(error))
      .finally(() => {
        setLoading(false)
        props.closable()
        props.loadData()
      })
  }

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
          loading={loading}
          detailData={props.detailData}
          paymentMethodsOptionsList={props.paymentMethodsOptionsList}
          cancelButton={props.closable}
          handleSaveData={handleSaveData}
        />
      </Card>
    </Drawer>
  )
}

export default PaymentsDetail
