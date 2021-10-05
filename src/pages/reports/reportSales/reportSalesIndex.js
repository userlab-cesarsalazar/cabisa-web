import React, { useEffect, useState, useRef, useCallback } from 'react'
import moment from 'moment'
import { message } from 'antd'
import GenericTable from '../../../components/genericTable'
import ReportSalesFilters from './components/reportSalesFilters'
import HeaderPage from '../../../components/HeaderPage'
import Tag from '../../../components/Tag'
import ReportsSrc from '../reportsSrc'
import { showErrors, getDateRangeFilter } from '../../../utils'

const columns = [
  {
    title: 'Nro Factura',
    dataIndex: 'id', // Field that is goint to be rendered
    key: 'id',
    render: text => <span>{text}</span>,
  },
  {
    title: 'Fecha',
    dataIndex: 'created_at', // Field that is goint to be rendered
    key: 'created_at',
    render: text =>
      text ? <span>{moment(text).format('DD-MM-YYYY')}</span> : null,
  },
  {
    title: 'Metodo de pago',
    dataIndex: 'payment_method', // Field that is goint to be rendered
    key: 'payment_method',
    render: text => <Tag type='documentsPaymentMethods' value={text} />,
  },
  {
    title: 'Vendedor',
    dataIndex: 'seller_name', // Field that is goint to be rendered
    key: 'seller_name',
    render: text => <span>{text}</span>,
  },
  {
    title: 'Cliente',
    dataIndex: 'stakeholder_name', // Field that is goint to be rendered
    key: 'stakeholder_name',
    render: text => <span>{text}</span>,
  },
]

function ReportSales() {
  const initFilters = useRef()

  if (!initFilters.current) {
    initFilters.current = {
      start_date: '',
      end_date: '',
      payment_method: '',
      document_type: '',
      seller_name: '',
      stakeholder_name: '',
    }
  }

  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState(initFilters.current)
  const [dataSource, setDataSource] = useState([])
  const [paymentMethodsOptionsList, setPaymentMethodsOptionsList] = useState([])

  const fetchSales = useCallback(() => {
    setLoading(true)

    ReportsSrc.getSales({
      ...getDateRangeFilter(filters.dateRange),
      payment_method: filters.payment_method,
      document_type: filters.document_type,
      seller_name: { $like: `%25${filters.seller_name}%25` },
      stakeholder_name: { $like: `%25${filters.stakeholder_name}%25` },
    })
      .then(result => setDataSource(result))
      .catch(error => showErrors(error))
      .finally(() => setLoading(false))
  }, [filters])

  useEffect(() => {
    fetchSales()
  }, [fetchSales])

  useEffect(() => {
    setLoading(true)

    ReportsSrc.getPaymentMethods()
      .then(data => setPaymentMethodsOptionsList(data))
      .catch(_ => message.error('Error al cargar listados'))
      .finally(() => setLoading(false))
  }, [])

  const setSearchFilters = field => value =>
    setFilters(prevState => ({ ...prevState, [field]: value }))

  return (
    <>
      <HeaderPage title={'Reporte - Ventas'} />
      <ReportSalesFilters
        filters={filters}
        setSearchFilters={setSearchFilters}
        paymentMethodsOptionsList={paymentMethodsOptionsList}
      />
      <GenericTable data={dataSource} loading={loading} columns={columns} />
    </>
  )
}

export default ReportSales
