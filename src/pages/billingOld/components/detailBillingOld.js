import React from 'react'
import { Card, Drawer, message } from 'antd'
import BillingFields from './billingFieldsTwoOld'
import billingSrc from '../billingSrcOld'
import { showErrors } from '../../../utils'

function DetailBilling(props) {
  const handleSaveData = saveData => {
    props.setLoading(true)        
    billingSrc
      .updateInvoice(saveData)
      .then(_ => {
        message.success('Factura actualizada exitosamente')
        props.loadData()
        props.closable()
      })
      .catch(error => showErrors(error))
      .finally(() => props.setLoading(false))
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
        <BillingFields
          visible={props.visible}
          edit={true}
          isAdmin={props.isAdmin}
          loading={props.loading}
          setLoading={props.setLoading}
          editData={props.editData}
          paymentMethodsOptionsList={props.paymentMethodsOptionsList}
          stakeholderTypesOptionsList={props.stakeholderTypesOptionsList}
          serviceTypesOptionsList={props.serviceTypesOptionsList}
          handleSaveData={handleSaveData}
          handleCancelButton={props.closable}
        />
      </Card>
    </Drawer>
  )
}

export default DetailBilling
