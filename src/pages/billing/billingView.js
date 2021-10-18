import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import HeaderPage from '../../components/HeaderPage'
import { message, Card } from 'antd'
import BillingFields from './components/billingFields'
import billingSrc from './billingSrc'
import { showErrors, validateRole } from '../../utils'
import { stakeholdersTypes, roles } from '../../commons/types'

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
    setLoading(true)

    Promise.all([
      billingSrc.getPaymentMethods(),
      billingSrc.getStakeholderTypes(),
      billingSrc.getServiceTypes(),
      billingSrc.getCreditDays(),
    ])
      .then(data => {
        const stakeholdersTypesList = data[1].filter(
          s => s !== stakeholdersTypes.PROVIDER
        )

        setPaymentMethodsOptionsList(data[0])
        setStakeholderTypesOptionsList(stakeholdersTypesList)
        setServiceTypesOptionsList(data[2])
        setCreditDaysOptionsList(data[3])
      })
      .catch(_ => message.error('Error al cargar listados'))
      .finally(() => setLoading(false))
  }, [])

  const handleSaveData = saveData => {
    setLoading(true)

    billingSrc
      .createInvoice(saveData)
      .then(_ => {
        message.success('Factura creada exitosamente')
        history.push('/billing')
      })
      .catch(error => showErrors(error))
      .finally(() => setLoading(false))
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
