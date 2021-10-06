import React, { useCallback, useEffect, useState, useRef } from 'react'
import moment from 'moment'
import HeaderPage from '../../components/HeaderPage'
import PaymentsTable from './components/paymentsTable'
import PaymentsDetail from './components/paymentsDetail'
import PaymentsSrc from './paymentsSrc'
import { message } from 'antd'
import { roundNumber } from '../../utils'
import { permissions, documentsServiceType } from '../../commons/types'

export function getDetailData(data) {
  const getParentProduct = (products, childProduct) => {
    if (!childProduct.parent_product_id) return {}

    const parentProduct = products.find(
      p => Number(p?.id) === Number(childProduct?.parent_product_id)
    )

    const unitPrice = parentProduct?.product_price || parentProduct?.unit_price
    const subtotal = parentProduct?.subtotal || unitPrice

    return {
      id: parentProduct?.id || '',
      description: parentProduct?.description || '',
      parent_tax_fee: parentProduct?.tax_fee || 0,
      parent_unit_tax_amount: roundNumber(parentProduct?.unit_tax_amount || 0),
      parent_unit_discount: roundNumber(
        parentProduct?.unit_discount_amount || 0
      ),
      parent_base_unit_price: roundNumber(unitPrice),
      parent_unit_price: roundNumber(unitPrice),
      unit_tax_amount: roundNumber(
        parentProduct.unit_tax_amount + childProduct.unit_tax_amount
      ),
      subtotal: roundNumber(childProduct?.subtotal + subtotal),
    }
  }

  const products = data?.products?.flatMap(p => {
    if (p.service_type === documentsServiceType.SERVICE && !p.parent_product_id)
      return []

    const unitPrice = p?.product_price || p?.unit_price || 0
    const quantity = p?.quantity || p?.product_quantity || 0
    const subtotalFromProducts = unitPrice * quantity
    const subtotal = roundNumber(p?.subtotal || subtotalFromProducts)

    return {
      ...p,
      child_id: p?.id || '',
      child_description: p?.description || '',
      child_tax_fee: p?.tax_fee || '0',
      child_unit_tax_amount: roundNumber(p?.unit_tax_amount || 0),
      child_unit_discount: roundNumber(p?.unit_discount_amount || 0),
      child_base_unit_price: roundNumber(unitPrice),
      child_unit_price: roundNumber(unitPrice),
      unit_tax_amount: roundNumber(p.unit_tax_amount),
      quantity,
      subtotal,
      id: '',
      description: '',
      parent_tax_fee: 0,
      parent_unit_tax_amount: 0,
      parent_unit_discount: 0,
      parent_base_unit_price: 0,
      parent_unit_price: 0,
      ...getParentProduct(data.products, {
        ...p,
        product_price: unitPrice,
        subtotal,
      }),
    }
  })

  const totalFromProducts = products?.reduce((r, v) => r + v.subtotal, 0)
  const total = roundNumber(data?.total || totalFromProducts)

  return {
    ...data,
    discount_percentage: roundNumber(data?.discount_percentage || 0),
    discount: roundNumber(data?.discount || 0),
    subtotal: roundNumber(data?.subtotal || 0),
    total_tax: roundNumber(data?.total_tax || 0),
    total,
    products,
  }
}

function Payments(props) {
  const initFilters = useRef()

  if (!initFilters.current) {
    initFilters.current = {
      id: '',
      nit: '',
      created_at: '',
      paymentMethods: '',
      totalInvoice: '',
      creditStatus: ',',
    }
  }

  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [dataSource, setDataSource] = useState(false)
  const [detailData, setDetailData] = useState(false)
  const [filters, setFilters] = useState(initFilters.current)
  const [paymentMethodsOptionsList, setPaymentMethodsOptionsList] = useState([])
  const [creditStatusOptionsList, setCreditStatusOptionsList] = useState([])

  useEffect(() => {
    setLoading(true)

    Promise.all([
      PaymentsSrc.getPaymentMethods(),
      PaymentsSrc.getCreditStatusOptions(),
    ])
      .then(data => {
        setPaymentMethodsOptionsList(data[0])
        setCreditStatusOptionsList(data[1])
      })
      .catch(_ => message.error('Error al cargar listados'))
      .finally(() => setLoading(false))
  }, [])

  const loadData = useCallback(() => {
    setLoading(true)

    PaymentsSrc.getPayments({
      id: { $like: `%25${filters.id}%25` }, // Nro de Serie
      nit: { $like: `%25${filters.nit}%25` },
      created_at: filters.created_at
        ? { $like: `${moment(filters.created_at).format('YYYY-MM-DD')}%25` }
        : '',
      payment_method: filters.paymentMethods,
      total_amount: { $like: `%25${filters.totalInvoice}%25` },
    })
      .then(data => setDataSource(data))
      .catch(_ => message.error('Error al cargar facturas'))
      .finally(() => setLoading(false))
  }, [filters])

  useEffect(() => {
    loadData()
  }, [loadData])

  const setSearchFilters = field => value =>
    setFilters(prevState => ({ ...prevState, [field]: value }))

  const handlerEditRow = data => {
    const detailData = getDetailData(data)

    setDetailData(detailData)

    setVisible(true)
  }

  const closeDetail = () => setVisible(false)

  return (
    <>
      <HeaderPage title={'Facturación'} permissions={permissions.PAGOS} />
      <PaymentsTable
        dataSource={dataSource}
        handlerEditRow={handlerEditRow}
        handleFiltersChange={setSearchFilters}
        paymentMethodsOptionsList={paymentMethodsOptionsList}
        creditStatusOptionsList={creditStatusOptionsList}
        serviceTypesOptionsList={[]}
        loading={loading}
      />
      <PaymentsDetail
        closable={closeDetail}
        visible={visible}
        loading={loading}
        setLoading={setLoading}
        detailData={detailData}
        paymentMethodsOptionsList={paymentMethodsOptionsList}
        stakeholderTypesOptionsList={[]}
        serviceTypesOptionsList={[]}
        creditDaysOptionsList={[]}
      />
    </>
  )
}
export default Payments
