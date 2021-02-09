import React from 'react'
import HeaderPage from '../../components/HeaderPage'
import { Card } from 'antd'
import BillingFields from './components/billingFields'
import FooterButtons from '../../components/FooterButtons'

function BillingView(props) {
  const saveData = (method, data, user_id) => {
    console.log('Save Data')
  }

  return (
    <>
      <HeaderPage titleButton={''} title={'Nueva Factura'} bill={true} />
      <Card className={'card-border-radius margin-top-15'}>
        <BillingFields
          saveBilling={saveData}
          visible={true}
          edit={false}
          data={props.editData}
          dataDetail={[]}
        />
        <FooterButtons
          saveData={saveData}
          cancelButton={props.cancelButton}
          edit={props.edit}
          cancelLink='/billing'
        />
      </Card>
    </>
  )
}
export default BillingView
