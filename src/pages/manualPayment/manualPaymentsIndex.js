import React, { useCallback, useEffect, useState, useRef } from 'react'
import moment from 'moment'
import HeaderPage from '../../components/HeaderPage'
import PaymentsTable from './components/manualPaymentsTable'
import PaymentsDetail from './components/manualPaymentsDetail'
import PaymentsSrc from './manualPaymentsSrc'
import PaymentsCreate from './components/manualPaymentsCreate'
import { message } from 'antd'
import { permissions } from '../../commons/types'
import { getDetailData } from '../billing/billingIndex'

function Payments() {
  const initFilters = useRef()

  if (!initFilters.current) {
    initFilters.current = {            
      id: '',
      name: '',
      nit: '',
      created_at: '',
      paymentMethods: '',
      totalInvoice: '',
      status: '',
    }
  }

  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [dataSource, setDataSource] = useState(false)
  const [detailData, setDetailData] = useState(false)
  const [filters, setFilters] = useState(initFilters.current)
  const [paymentMethodsOptionsList, setPaymentMethodsOptionsList] = useState([])
  const [creditStatusOptionsList, setCreditStatusOptionsList] = useState([])
  const [showModal,setShowModal] = useState(false)

  useEffect(() => {
    setLoading(true)

    Promise.all([
      PaymentsSrc.getPaymentMethods(),
      PaymentsSrc.getCreditStatusOptions(),
    ])
      .then(data => {        
        setPaymentMethodsOptionsList(data[0])
        setCreditStatusOptionsList(data[1].filter(item => item !== 'DEFAULT'))
      })
      .catch(_ => message.error('Error al cargar listados'))
      .finally(() => setLoading(false))
  }, [])

  const loadData = useCallback(() => {
    setLoading(true)

    let filterParams = {            
      id: { $like: `%25${filters.id}%25` }, // Nro de Serie
      name: { $like: `%25${filters.name}%25` }, // nombre cliente
      nit: { $like: `%25${filters.nit}%25` }, // nombre cliente
      created_at: filters.created_at
        ? { $like: `${moment(filters.created_at).format('YYYY-MM-DD')}%25` }
        : '',
      payment_method: filters.paymentMethods,
      total_amount: { $like: `%25${filters.totalInvoice}%25` },
      status: filters.status,
    }
    
    
    PaymentsSrc.getPayments(filterParams)
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

  const handlerDeleteRow = data => {    
    setLoading(true)
    PaymentsSrc.removeManualPayment({id:data.id}).then(_=>{
      message.success("Recibo eliminado")
      loadData()        
  }).catch(error=> {
      console.log(error); message.error('No se ha podido eliminar el recibo')
  }).finally(()=>setLoading(false))

  }

  const closeDetail = () => setVisible(false)
  
  const showDrawerAction = () => {    
    setShowModal(true)
  }

  
  return (
    <>
      <HeaderPage 
      titleButton={'Nuevo Recibo'} 
      title={'Recibos'} 
      permissions={permissions.PAGOS} 
      showDrawer={showDrawerAction}/>
      <PaymentsTable
        dataSource={dataSource}
        handlerEditRow={handlerEditRow}
        handlerDeleteRow={handlerDeleteRow}
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
      <PaymentsCreate          
          showModal={showModal}
          hideModal={()=>{setShowModal(false); loadData()}}          
        />
    </>
  )
}
export default Payments
