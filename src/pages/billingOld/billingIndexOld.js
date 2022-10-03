import React, { useCallback, useEffect, useState, useRef } from 'react'
import moment from 'moment'
import HeaderPage from '../../components/HeaderPage'
import BillingTable from './components/BillingTableOld'
import DetailBilling from './components/detailBillingOld'
import billingSrc from './billingSrcOld'
import { message } from 'antd'
import { getPercent, showErrors, roundNumber, validateRole } from '../../utils'
import {
  stakeholdersTypes,
  permissions,
  documentsServiceType,
  roles,
  documentsPaymentMethods,
} from '../../commons/types'

export function getDetailData(data) {
  const getParentProduct = (products, childProduct) => {
    if (!childProduct.parent_product_id) return {}

    const parentProduct = products.find(
      p => Number(p?.id) === Number(childProduct?.parent_product_id)
    )

    const baseUnitPrice =
      parentProduct?.product_price || parentProduct?.unit_price || 0
    const unitDiscountAmount = parentProduct?.unit_discount_amount || 0
    const parentBaseUnitPrice =
      (Number(baseUnitPrice) + unitDiscountAmount) /
      (1 - getPercent(Number(parentProduct.tax_fee)))
    const unitPrice =
      Number(baseUnitPrice) / (1 - getPercent(Number(parentProduct.tax_fee)))
    const parentUnitTaxAmount = roundNumber(unitPrice - baseUnitPrice)
    // const unitPrice =
    //   parentProduct?.product_price || Number(parentProduct?.product_price) === 0
    //     ? Number(parentProduct.product_price)
    //     : Number(parentProduct?.unit_price || 0)

    return {
      id: parentProduct?.id || '',
      description: parentProduct?.description || '',
      parent_tax_fee: parentProduct?.tax_fee || 0,
      // parent_unit_tax_amount: roundNumber(parentProduct?.unit_tax_amount || 0),
      parent_unit_tax_amount: parentUnitTaxAmount,
      parent_unit_discount: roundNumber(unitDiscountAmount),
      parent_base_unit_price: roundNumber(parentBaseUnitPrice),
      // parent_base_unit_price: roundNumber(unitPrice + parent_unit_discount),
      parent_unit_price: roundNumber(unitPrice),
      parent_display_unit_price: roundNumber(unitPrice),
      unit_tax_amount: roundNumber(
        parentUnitTaxAmount + childProduct.unit_tax_amount
      ),
      subtotal: roundNumber(Number(unitPrice) + childProduct.subtotal),
    }
  }

  const products = data?.products?.flatMap(p => {
    if (p.service_type === documentsServiceType.SERVICE && !p.parent_product_id)
      return []

    const baseUnitPrice = p?.product_price || p?.unit_price || 0
    const unitDiscountAmount = p?.unit_discount_amount || 0
    const childBaseUnitPrice =
      (Number(baseUnitPrice) + unitDiscountAmount) /
      (1 - getPercent(Number(p.tax_fee)))
    const unitPrice =
      Number(baseUnitPrice) / (1 - getPercent(Number(p.tax_fee)))
    // const unitPrice = p?.product_price || p?.unit_price || 0
    const quantity = p?.quantity || p?.product_quantity || 0
    const subtotal = unitPrice * quantity
    const unitTaxAmount = roundNumber(unitPrice - baseUnitPrice)

    return {
      ...p,
      child_id: p?.id || '',
      child_description: p?.description || '',
      child_tax_fee: p?.tax_fee || '0',
      // child_unit_tax_amount: roundNumber(p?.unit_tax_amount || 0),
      child_unit_tax_amount: unitTaxAmount,
      child_unit_discount: roundNumber(unitDiscountAmount),
      child_base_unit_price: roundNumber(childBaseUnitPrice),
      // child_base_unit_price: roundNumber(unitPrice + child_unit_discount),
      child_unit_price: roundNumber(unitPrice),
      child_display_unit_price: roundNumber(unitPrice),
      unit_price: roundNumber(unitPrice),
      unit_discount: roundNumber(unitDiscountAmount),
      unit_tax_amount: unitTaxAmount,
      quantity,
      subtotal: roundNumber(subtotal),
      id: '',
      description: '',
      code: '',
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

  return {
    ...data,
    discount_percentage: roundNumber(data?.discount_percentage || 0),
    discount: roundNumber(data?.discount || 0),
    subtotal: roundNumber(data?.subtotal || 0),
    total_tax: roundNumber(data?.total_tax || 0),
    total: roundNumber(data?.total || 0),
    products,
  }
}

function Billing(props) {
  const initFilters = useRef()

  if (!initFilters.current) {
    initFilters.current = {
      id: '',
      nit: '',
      created_at: '',
      serviceTypes: '',
      paymentMethods: '',
      totalInvoice: '',
    }
  }

  const isAdmin = validateRole(roles.ADMIN)

  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [dataSource, setDataSource] = useState(false)
  const [detailInvoiceData, setDetailInvoiceData] = useState(false)
  const [filters, setFilters] = useState(initFilters.current)
  const [paymentMethodsOptionsList, setPaymentMethodsOptionsList] = useState([])
  const [
    stakeholderTypesOptionsList,
    setStakeholderTypesOptionsList,
  ] = useState([])
  const [serviceTypesOptionsList, setServiceTypesOptionsList] = useState([])

  useEffect(() => {
    setPaymentMethodsOptionsList([
      documentsPaymentMethods.CARD,
      documentsPaymentMethods.CASH,
    ])

    setLoading(true)

    Promise.all([
      billingSrc.getStakeholderTypes(),
      billingSrc.getServiceTypes(),
    ])
      .then(data => {
        const stakeholdersTypesList = data[0].filter(
          s => s !== stakeholdersTypes.PROVIDER
        )

        setStakeholderTypesOptionsList(stakeholdersTypesList)
        setServiceTypesOptionsList(data[1])
      })
      .catch(_ => message.error('Error al cargar listados'))
      .finally(() => setLoading(false))
  }, [])

  const loadData = useCallback(() => {
    setLoading(true)

    billingSrc
      .getInvoices({
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

  const handlerDeleteRow = row => {
    setLoading(true)

    billingSrc
      .cancelInvoice({ document_id: row.id })
      .then(_ => {
        if (JSON.stringify(filters) === JSON.stringify(initFilters.current)) {
          loadData()
        } else {
          setFilters(initFilters.current)
        }

        message.success('Factura anulada exitosamente')
      })
      .catch(error => showErrors(error))
      .finally(() => setLoading(false))
  }

  const setSearchFilters = field => value =>
    setFilters(prevState => ({ ...prevState, [field]: value }))

  const newBill = () => props.history.push('/billingView')

  const showDetail = data => {
    const detailInvoiceData = getDetailData(data)

    setDetailInvoiceData(detailInvoiceData)

    setVisible(true)
  }

  const closeDetail = () => setVisible(false)

  return (
    <>
      <HeaderPage
        titleButton={'Factura Nueva'}
        title={'Facturación'}
        showDrawer={newBill}
        permissions={permissions.FACTURACION}
      />
      <BillingTable
        dataSource={dataSource}
        showDetail={showDetail}
        handleFiltersChange={setSearchFilters}
        paymentMethodsOptionsList={paymentMethodsOptionsList}
        handlerDeleteRow={handlerDeleteRow}
        loading={loading}
        isAdmin={isAdmin}
      />
      <DetailBilling
        closable={closeDetail}
        visible={visible}
        loading={loading}
        setLoading={setLoading}
        editData={detailInvoiceData}
        paymentMethodsOptionsList={paymentMethodsOptionsList}
        stakeholderTypesOptionsList={stakeholderTypesOptionsList}
        serviceTypesOptionsList={serviceTypesOptionsList}
        isAdmin={isAdmin}
        loadData={loadData}
      />
    </>
  )
}
export default Billing
