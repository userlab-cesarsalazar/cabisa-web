import React from 'react'
import { Card, Drawer } from 'antd'
import BillingFields from './billingFields'
function DetailBilling(props) {
  return (
    <Drawer
      placement='right'
      closable={false}
      onClose={props.closable}
      visible={props.visible}
      width='70%'
    >
      <Card className={'card-border-radius margin-top-15'}>
        <BillingFields
          visible={props.visible}
          edit={true}
          loading={props.loading}
          setLoading={props.setLoading}
          data={props.data}
          productsData={props.productsData}
          paymentMethodsOptionsList={props.paymentMethodsOptionsList}
          stakeholderTypesOptionsList={props.stakeholderTypesOptionsList}
          discountInputValue={props.discountInputValue}
          handleDiscountChange={() => {}}
          handleChange={() => {}}
          handleSearchStakeholder={() => {}}
          handleSearchProduct={() => {}}
          handleSearchProject={() => {}}
        />
      </Card>
    </Drawer>
  )
}

export default DetailBilling
