import React, { useCallback, useEffect, useState, useRef } from 'react'
import moment from 'moment'
import HeaderPage from '../../components/HeaderPage'
import BillingTable from './components/BillingTable'
import DetailBilling from './components/detailBilling'
import billingSrc from './billingSrc'
import { message } from 'antd'
import { showErrors, roundNumber } from '../../utils'
import { stakeholdersTypes, permissions } from '../../commons/types'

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
  const [creditDaysOptionsList, setCreditDaysOptionsList] = useState([])

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

  const loadData = useCallback(() => {
    setLoading(true)

    billingSrc
      .getInvoices({
        id: { $like: `%25${filters.id}%25` }, // Nro de Serie
        nit: { $like: `%25${filters.nit}%25` },
        created_at: filters.created_at
          ? { $like: `${moment(filters.created_at).format('YYYY-MM-DD')}%25` }
          : '',
        service_type: filters.serviceTypes,
        payment_method: filters.paymentMethods,
        total_invoice: { $like: `%25${filters.totalInvoice}%25` },
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
    setDetailInvoiceData({
      ...data,
      discount_percentage: roundNumber(data.discount_percentage),
      discount: roundNumber(data.discount),
      subtotal: roundNumber(data.subtotal),
      total_tax: roundNumber(data.total_tax),
      total: roundNumber(data.total),
      products: data.products.map(p => ({
        ...p,
        product_price: roundNumber(p.product_price),
        subtotal: roundNumber(p.subtotal),
      })),
    })
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
        serviceTypesOptionsList={serviceTypesOptionsList}
        handlerDeleteRow={handlerDeleteRow}
        loading={loading}
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
        creditDaysOptionsList={creditDaysOptionsList}
      />
    </>
  )
}
export default Billing
