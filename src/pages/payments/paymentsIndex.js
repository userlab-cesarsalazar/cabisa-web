import React, { useCallback, useEffect, useState, useRef } from 'react'
import moment from 'moment'
import HeaderPage from '../../components/HeaderPage'
import PaymentsTable from './components/paymentsTable'
import PaymentsDetail from './components/paymentsDetail'
import PaymentsSrc from './paymentsSrc'
import { message } from 'antd'
import { permissions } from '../../commons/types'
import { getDetailData } from '../billing/billingIndex'

function Payments() {
  const initFilters = useRef()

  if (!initFilters.current) {
    initFilters.current = {
      related_internal_document_id:'',
      document_number:'',
      id: '',
      name: '',
      nit: '',
      created_at: '',
      paymentMethods: '',
      totalInvoice: '',
      creditStatus: '',
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

    let filterParams = {      
      related_internal_document_id: { $like: `%25${filters.related_internal_document_id}%25` }, // Nro de nota de servicio      
      id: { $like: `%25${filters.id}%25` }, // Nro de Serie
      name: { $like: `%25${filters.name}%25` }, // nombre cliente
      nit: { $like: `%25${filters.nit}%25` }, // nombre cliente
      created_at: filters.created_at
        ? { $like: `${moment(filters.created_at).format('YYYY-MM-DD')}%25` }
        : '',
      payment_method: filters.paymentMethods,
      total_amount: { $like: `%25${filters.totalInvoice}%25` },
      credit_status: filters.creditStatus,
    }

    if(filters.document_number !== ""){
      filterParams.document_number = { $like: `%25${filters.document_number}%25` } // Nro de Serie
    }

    PaymentsSrc.getPayments(filterParams)
      .then(data => setDataSource(data.filter(item => item.status !== 'CANCELLED')))
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
      <HeaderPage title={'Recibo de cajax'} permissions={permissions.PAGOS} />
      <PaymentsTable
        dataSource={dataSource}
        handlerEditRow={handlerEditRow}
        handleFiltersChange={setSearchFilters}
        paymentMethodsOptionsList={paymentMethodsOptionsList}
        creditStatusOptionsList={creditStatusOptionsList}
        loading={loading}
      />
      <PaymentsDetail
        closable={closeDetail}
        visible={visible}
        loading={loading}
        setLoading={setLoading}
        detailData={detailData}
        loadData={loadData}
        paymentMethodsOptionsList={paymentMethodsOptionsList}
      />
    </>
  )
}
export default Payments
