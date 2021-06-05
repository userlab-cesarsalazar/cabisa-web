import React, { useCallback, useEffect, useState } from 'react'
import moment from 'moment'
import HeaderPage from '../../components/HeaderPage'
import BillingTable from './components/BillingTable'
import LoadMoreButton from '../../components/LoadMoreButton'
import DetailBilling from './components/detailBilling'
import billingSrc from './billingSrc'
import { message } from 'antd'
import { showErrors, roundNumber } from '../../utils'
import { stakeholdersTypes } from '../../commons/types'

function Billing(props) {
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [dataSource, setDataSource] = useState(false)
  const [showInvoiceData, setShowInvoiceData] = useState(false)
  const [filters, setFilters] = useState(false)
  const [paymentMethodsOptionsList, setPaymentMethodsOptionsList] = useState([])
  const [
    stakeholderTypesOptionsList,
    setStakeholderTypesOptionsList,
  ] = useState([])

  useEffect(() => {
    setLoading(true)

    Promise.all([
      billingSrc.getPaymentMethods(),
      billingSrc.getStakeholderTypes(),
    ])
      .then(data => {
        const stakeholdersTypesList = data[1].filter(
          s => s !== stakeholdersTypes.PROVIDER
        )

        setPaymentMethodsOptionsList(data[0])
        setStakeholderTypesOptionsList(stakeholdersTypesList)
      })
      .catch(_ => message.error('Error al cargar listados'))
      .finally(setLoading(false))
  }, [])

  const loadData = useCallback(() => {
    setLoading(true)

    billingSrc
      .getInvoices({
        payment_method: filters.paymentMethods,
        // nit: filters.nit ? `${filters.nit}%` : '',
        id: filters.id ? `${filters.id}%` : '',
        created_at: filters.created_at
          ? { $like: `${moment(filters.created_at).format('YYYY-MM-DD')}%` }
          : '',
      })
      .then(data => setDataSource(data))
      .catch(_ => message.error('Error al cargar facturas'))
      .finally(setLoading(false))
  }, [filters])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handlerDeleteRow = row => {
    setLoading(true)

    billingSrc
      .cancelInvoice({ document_id: row.id })
      .then(_ => message.success('Factura anulada exitosamente'))
      .catch(error => showErrors(error))
      .finally(setLoading(false))
  }

  const setSearchFilters = field => value =>
    setFilters(prevState => ({ ...prevState, [field]: value }))

  const newBill = () => props.history.push('/billingView')

  const showDetail = data => {
    setShowInvoiceData({
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
        permissions={4}
      />
      <BillingTable
        dataSource={dataSource}
        showDetail={showDetail}
        handleFiltersChange={setSearchFilters}
        paymentMethodsOptionsList={paymentMethodsOptionsList}
        handlerDeleteRow={handlerDeleteRow}
        loading={loading}
      />
      <LoadMoreButton
        handlerButton={() => console.log('more Button')}
        moreInfo={false}
      />
      <DetailBilling
        closable={closeDetail}
        cancelButton={closeDetail}
        visible={visible}
        loading={loading}
        setLoading={setLoading}
        data={showInvoiceData}
        productsData={showInvoiceData?.products}
        paymentMethodsOptionsList={paymentMethodsOptionsList}
        stakeholderTypesOptionsList={stakeholderTypesOptionsList}
        discountInputValue={showInvoiceData.discount_percentage}
      />
    </>
  )
}
export default Billing
