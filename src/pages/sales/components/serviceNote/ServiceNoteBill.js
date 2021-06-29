import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { message, Card } from 'antd'
import HeaderPage from '../../../../components/HeaderPage'
import billingSrc from '../../../billing/billingSrc'
import saleSrc from '../../salesSrc'
import BillingFields from '../../../billing/components/billingFields'
import FooterButtons from '../../../../components/FooterButtons'
import {
  showErrors,
  roundNumber,
  getPercent,
  validateDynamicTableProducts,
} from '../../../../utils'

function ServiceNoteBill() {
  const location = useLocation()
  const history = useHistory()

  const [loading, setLoading] = useState(false)
  const [paymentMethodsOptionsList, setPaymentMethodsOptionsList] = useState([])
  const [serviceTypesOptionsList, setServiceTypesOptionsList] = useState([])
  const [creditDaysOptionsList, setCreditDaysOptionsList] = useState([])
  const [data, setData] = useState([])
  const [productsData, setProductsData] = useState([])
  const [discountInputValue, setDiscountInputValue] = useState(0)

  useEffect(() => {
    setData(location.state)
    setProductsData(
      location.state.products.map(p => ({
        ...p,
        base_unit_price: p.unit_price,
        subtotal: p.unit_price * p.quantity,
      }))
    )

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

  useEffect(() => {
    setData(prevState => {
      const totals = productsData.reduce((r, p) => {
        const discount = (r.discount || 0) + p.unit_discount * p.quantity
        const subtotal = (r.subtotal || 0) + p.unit_price * p.quantity
        const total_tax = (r.total_tax || 0) + p.unit_tax_amount * p.quantity
        const total = subtotal + total_tax

        return {
          discount: roundNumber(discount) || 0,
          subtotal: roundNumber(subtotal) || 0,
          total_tax: roundNumber(total_tax) || 0,
          total: roundNumber(total) || 0,
          credit_days: prevState.credit_days ? prevState.credit_days : 0,
        }
      }, {})

      return { ...prevState, ...totals }
    })
  }, [setData, productsData])

  const handleDiscountChange = e => {
    setDiscountInputValue(e.target.value)

    setProductsData(prevState =>
      prevState.map(p => {
        const unit_discount = p.base_unit_price * getPercent(e.target.value)
        const unit_price = p.base_unit_price - unit_discount
        const unit_tax_amount = unit_price * getPercent(p.tax_fee)
        const subtotal = p.quantity * unit_price

        return {
          ...p,
          unit_price: roundNumber(unit_price),
          unit_discount: roundNumber(unit_discount),
          unit_tax_amount: roundNumber(unit_tax_amount),
          subtotal: roundNumber(subtotal),
        }
      })
    )
  }

  const handleChange = field => e => {
    const value = e?.target?.value === undefined ? e : e.target.value

    setData(prevState => ({
      ...prevState,
      [field]: value,
    }))
  }

  const getSaveData = () => ({
    document_id: data.id,
    payment_method: data.payment_method,
    service_type: data.service_type,
    credit_days: data.credit_days,
    total_invoice: data.total,
    products: productsData.map(p => ({
      product_id: p.id,
      product_quantity: p.quantity,
      product_price: p.unit_price,
      product_discount_percentage: discountInputValue,
      product_discount: p.unit_discount,
    })),
  })

  const validateSaveData = data => {
    const errors = []
    const requiredFields = [
      { key: 'payment_method', value: 'Metodo de pago' },
      { key: 'service_type', value: 'Tipo de Servicio' },
    ]
    const requiredErrors = requiredFields.flatMap(field =>
      !data[field.key] ? field.value : []
    )
    if (requiredErrors.length > 0) {
      requiredErrors.forEach(k => {
        errors.push(`El campo ${k} es obligatorio`)
      })
    }
    const productsRequiredFields = [
      'product_id',
      'product_quantity',
      'product_price',
    ]

    const productErrors = validateDynamicTableProducts(
      data.products,
      productsRequiredFields
    )

    if (productErrors.required.length > 0) {
      errors.push(
        `Los campos Precio y Cantidad de los productos en posicion ${productErrors.required.join(
          ', '
        )} deben ser mayor o igual a cero`
      )
    }

    Object.keys(productErrors.duplicate).forEach(k => {
      if (productErrors.duplicate[k]?.length > 1) {
        errors.push(
          `Los productos en posicion ${productErrors.duplicate[k].join(
            ', '
          )} no pueden estar duplicados`
        )
      }
    })

    if (!discountInputValue || discountInputValue < 0) {
      errors.push(
        `El campo Descuento (%) debe contener un valor mayor o igual a cero`
      )
    }

    return {
      isInvalid: errors.length > 0,
      error: {
        message: errors,
      },
    }
  }

  const saveData = () => {
    const saveData = getSaveData()

    const { isInvalid, error } = validateSaveData(saveData)

    if (isInvalid) return showErrors(error)

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
    <>
      <HeaderPage titleButton={''} title={'Nueva Factura'} bill={true} />
      <Card className={'card-border-radius margin-top-15'}>
        <BillingFields
          isInvoiceFromSale
          edit={false}
          loading={loading}
          data={data}
          productsData={productsData}
          paymentMethodsOptionsList={paymentMethodsOptionsList}
          serviceTypesOptionsList={serviceTypesOptionsList}
          creditDaysOptionsList={creditDaysOptionsList}
          discountInputValue={discountInputValue}
          handleDiscountChange={handleDiscountChange}
          handleChange={handleChange}
          handleSearchStakeholder={() => {}}
          handleSearchProduct={() => {}}
          handleSearchProject={() => {}}
          editableList={{}}
        />
        <FooterButtons saveData={saveData} edit={false} cancelLink='/sales' />
      </Card>
    </>
  )
}
export default ServiceNoteBill
