import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import HeaderPage from '../../components/HeaderPage'
import { message, Card } from 'antd'
import BillingFields from './components/billingFields'
import billingSrc from './billingSrc'
import { showErrors, validateRole } from '../../utils'
import {
  stakeholdersTypes,
  roles,
  documentsPaymentMethods,
} from '../../commons/types'

function BillingView() {
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const [paymentMethodsOptionsList, setPaymentMethodsOptionsList] = useState([])
  const [
    stakeholderTypesOptionsList,
    setStakeholderTypesOptionsList,
  ] = useState([])
  const [serviceTypesOptionsList, setServiceTypesOptionsList] = useState([])
  const [creditDaysOptionsList, setCreditDaysOptionsList] = useState([])

  const isAdmin = validateRole(roles.ADMIN)

  useEffect(() => {
    setPaymentMethodsOptionsList([
      documentsPaymentMethods.CARD,
      documentsPaymentMethods.CASH,
    ])

    setLoading(true)

    Promise.all([
      billingSrc.getStakeholderTypes(),
      billingSrc.getServiceTypes(),
      billingSrc.getCreditDays(),
    ])
      .then(data => {
        const stakeholdersTypesList = data[0].filter(
          s => s !== stakeholdersTypes.PROVIDER
        )

        setStakeholderTypesOptionsList(stakeholdersTypesList)
        setServiceTypesOptionsList(data[1])
        setCreditDaysOptionsList(data[2])
      })
      .catch(_ => message.error('Error al cargar listados'))
      .finally(() => setLoading(false))
  }, [])

  const handleSaveData = saveData => {
           
   let billData =  createBillStructure(saveData)
   console.log("bill data>> ",billData)

    //setLoading(true)
    // billingSrc
    //   .createInvoice(saveData)
    //   .then(_ => {
    //     message.success('Factura creada exitosamente')
    //     history.push('/billing')
    //   })
    //   .catch(error => showErrors(error))
    //   .finally(() => setLoading(false))
  }

  const createBillStructure = dataBill => {
    const { client_data: client, description: observations, products, ...rest } = dataBill;
    let items = [];
    items = products.map(product => {
       const price = (product.service_user_price || product.product_user_price).toFixed(2);
       const description = product.product_description || product.service_description
       const discount = ((product.product_discount_percentage/100) * price).toFixed(2)
       const quantity = product.product_quantity.toFixed(2)
       return { description, price,discount,quantity}
    })
    
    let newStructure = {
       client,
       "invoice":{
          items,      
          observations
       }
    }
    return newStructure
  }

  return (
    <>
      <HeaderPage titleButton={''} title={'Nueva Factura'} bill={true} />
      <Card className={'card-border-radius margin-top-15'}>
        <BillingFields
          edit={false}
          loading={loading}
          setLoading={setLoading}
          handleSaveData={handleSaveData}
          paymentMethodsOptionsList={paymentMethodsOptionsList}
          stakeholderTypesOptionsList={stakeholderTypesOptionsList}
          serviceTypesOptionsList={serviceTypesOptionsList}
          creditDaysOptionsList={creditDaysOptionsList}
          cancelLink='/billing'
          isAdmin={isAdmin}
        />
      </Card>
    </>
  )
}
export default BillingView
