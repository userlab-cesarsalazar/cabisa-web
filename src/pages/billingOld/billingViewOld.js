import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import HeaderPage from '../../components/HeaderPage'
import { message, Card } from 'antd'
import BillingFields from './components/billingFieldsOld'
import billingSrc from './billingSrcOld'
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

  const handleSaveData = async saveData => {
    let products = saveData.products
    saveData.products = products.filter(
      product =>
        product.parent_product_id === null ||
        product.parent_product_id === undefined
    )
   
   setLoading(true)  
  //Crea la factura solo en el sistema
  billingSrc
      .createInvoice(saveData)
      .then(_ => {
        message.success('Factura creada exitosamente')
        history.push('/FactOld')
      })
      .catch(error => showErrors(error))
      .finally(() => setLoading(false))
   
  }

  
  return (
    <>
      <HeaderPage titleButton={''} title={'Nueva Factura Manual'} bill={true} />
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
