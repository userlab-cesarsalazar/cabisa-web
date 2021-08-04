import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Spin, message, Card } from 'antd'
import HeaderPage from '../../../../components/HeaderPage'
import billingSrc from '../../../billing/billingSrc'
import saleSrc from '../../salesSrc'
import BillingFields from '../../../billing/components/billingFields'
import { showErrors, roundNumber } from '../../../../utils'

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

  const getInvoiceData = () => ({
    ...location.state,
    products: location.state?.products.flatMap(p => {
      const child = location.state?.products.find(
        p => Number(p.parent_product_id) === Number(p.id)
      )

      return {
        ...p,
        parent_tax_fee: p.tax_fee,
        parent_unit_tax_amount: roundNumber(p.unit_tax_amount),
        parent_unit_discount: 0,
        parent_base_unit_price: roundNumber(p.unit_price),
        parent_unit_price: roundNumber(p.unit_price),
        child_id: child ? child.id : '',
        child_description: child ? child.description : '',
        child_tax_fee: child ? child.tax_fee : 0,
        child_unit_tax_amount: child ? roundNumber(child.unit_tax_amount) : 0,
        child_unit_discount: 0,
        child_base_unit_price: child ? roundNumber(child.unit_price) : 0,
        child_unit_price: child ? roundNumber(child.unit_price) : 0,
        quantity: child ? child.quantity : p.quantity,
        unit_tax_amount: child
          ? roundNumber(p.unit_tax_amount + child.unit_tax_amount)
          : roundNumber(p.unit_tax_amount),
        unit_price: child
          ? roundNumber(p.unit_price + child.unit_price)
          : roundNumber(p.unit_price),
        subtotal: child
          ? roundNumber(p.unit_price + child.unit_price * child.quantity)
          : roundNumber(p.unit_price * p.quantity),
      }
    }),
  })

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
          editData={getInvoiceData()}
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
