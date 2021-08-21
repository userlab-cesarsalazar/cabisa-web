import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Spin, message, Card } from 'antd'
import HeaderPage from '../../../../components/HeaderPage'
import billingSrc from '../../../billing/billingSrc'
import saleSrc from '../../salesSrc'
import BillingFields from '../../../billing/components/billingFields'
import { showErrors } from '../../../../utils'
import { getDetailData } from '../../../billing/billingIndex'

function ServiceNoteBill() {
  const location = useLocation()
  const history = useHistory()

  const [loading, setLoading] = useState(false)
  const [paymentMethodsOptionsList, setPaymentMethodsOptionsList] = useState([])
  const [serviceTypesOptionsList, setServiceTypesOptionsList] = useState([])
  const [creditDaysOptionsList, setCreditDaysOptionsList] = useState([])

  useEffect(() => {
    setLoading(true)

    Promise.all([
      billingSrc.getPaymentMethods(),
      billingSrc.getServiceTypes(),
      billingSrc.getCreditDays(),
    ])
      .then(data => {
        setPaymentMethodsOptionsList(data[0])
        setServiceTypesOptionsList(data[1])
        setCreditDaysOptionsList(data[2])
      })
      .catch(_ => message.error('Error al cargar listados'))
      .finally(() => setLoading(false))
  }, [location])

  const handleSaveData = saveData => {
    setLoading(true)

    saleSrc
      .approveSale(saveData)
      .then(_ => {
        message.success('Factura creada exitosamente')
        history.push('/sales')
      })
      .catch(error => showErrors(error))
      .finally(() => setLoading(false))
  }

  return (
    <Spin spinning={loading}>
      <HeaderPage titleButton={''} title={'Nueva Factura'} bill={true} />
      <Card className={'card-border-radius margin-top-15'}>
        <BillingFields
          isInvoiceFromSale
          edit={false}
          loading={loading}
          editData={getDetailData(location.state)}
          paymentMethodsOptionsList={paymentMethodsOptionsList}
          serviceTypesOptionsList={serviceTypesOptionsList}
          creditDaysOptionsList={creditDaysOptionsList}
          cancelLink='/sales'
          handleSaveData={handleSaveData}
        />
      </Card>
    </Spin>
  )
}
export default ServiceNoteBill
