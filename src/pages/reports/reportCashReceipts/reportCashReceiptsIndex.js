import React, { useEffect,useState,useRef,useCallback } from 'react'
import HeaderPage from '../../../components/HeaderPage'
import { withRouter } from 'react-router'
import ReportCashReceiptsTable from './components/ReportCashReceiptsTable'
import { permissions } from '../../../commons/types'
import ReportsSrc from '../reportsSrc'
import { message } from 'antd'
import moment from 'moment'
import PaymentsSrc from '../../payments/paymentsSrc'
import { getDetailData } from '../../billing/billingIndex'
import PaymentsDetail from '../../payments/components/paymentsDetail'

function ReportCashReceipts(props) {

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

    const [dataSource, setDataSource] = useState([])
    const [loading, setLoading] = useState(true)    
    const [filters, setFilters] = useState(initFilters.current)
    const [paymentMethodsOptionsList, setPaymentMethodsOptionsList] = useState([])
    const [creditStatusOptionsList, setCreditStatusOptionsList] = useState([])
    const [visible, setVisible] = useState(false)
    const [detailData, setDetailData] = useState(false)

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

    
  const exportDataAction = () => {
    setLoading(true)    
    let params = {
        related_internal_document_id: { $like: `%25${filters.related_internal_document_id}%25` }, // Nro de nota de servicio      
        id: { $like: `%25${filters.id}%25` }, // Nro de Serie
        name: { $like: `%25${filters.name}%25` }, // nombre cliente
        nit: { $like: `%25${filters.nit}%25` }, // nombre cliente        
        ...getDateRangeFilterReport(filters.created_at),
        payment_method: filters.paymentMethods,
        total_amount: { $like: `%25${filters.totalInvoice}%25` },
        credit_status: filters.creditStatus,
        reportType:"cashReceipts"
    }

    if(filters.document_number !== ""){
        params.document_number = { $like: `%25${filters.document_number}%25` } // Nro de Serie
      }
    
    ReportsSrc
      .exportReport(params)
      .then(data => {        
        message.success('Reporte creado')
        exportExcel(data.reportExcel)
      })
      .catch(_ => message.error('Error al cargar reporte facturas'))
      .finally(() => setLoading(false))

  }

  const exportExcel = (base64Excel) =>{
    try{      
      let uri = 'data:application/octet-stream;base64,'+base64Excel;
      let link = document.createElement('a');
      link.setAttribute("download", `Reporte-Recibos-Caja.xls`);
      link.setAttribute("href", uri);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(document.body.lastChild);                    
    }catch (e) {
      console.log('ERROR ON EXPORT MANIFEST',e)            
      message.warning('Error al exportar el manifiesto')
    }finally{
        setLoading(false)
    }
  }
    
  const setSearchFilters = field => value =>{        
    setFilters(prevState => ({ ...prevState, [field]: value }))
  } 

  const getDateRangeFilterReport = dateRange => {
    if (!dateRange) return {}
  
    return {
      start_date: {
        $gte: moment(dateRange[0]).format('YYYY-MM-DD'),
      },
      end_date: {
        $lte: moment(dateRange[1]).add(1, 'days').format('YYYY-MM-DD'),
      },
    }
  }

  const loadData = useCallback(() => {
    setLoading(true)

    let filterParams = {      
        related_internal_document_id: { $like: `%25${filters.related_internal_document_id}%25` }, // Nro de nota de servicio      
        id: { $like: `%25${filters.id}%25` }, // Nro de Serie
        name: { $like: `%25${filters.name}%25` }, // nombre cliente
        nit: { $like: `%25${filters.nit}%25` }, // nombre cliente        
        ...getDateRangeFilterReport(filters.created_at),
        payment_method: filters.paymentMethods,
        total_amount: { $like: `%25${filters.totalInvoice}%25` },
        credit_status: filters.creditStatus,
      }
  
      if(filters.document_number !== ""){
        filterParams.document_number = { $like: `%25${filters.document_number}%25` } // Nro de Serie
      }

    ReportsSrc
      .getCashReceipts(filterParams)
      .then(data => setDataSource(data))
      .catch(_ => message.error('Error al cargar reporte facturas'))
      .finally(() => setLoading(false))
  }, [filters])
  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadData])

  const handlerEditRow = data => {
    const detailData = getDetailData(data)
     detailData.status = "CANCELLED" 
    setDetailData(detailData)    
    setVisible(true)
  }
  
  const closeDetail = () => setVisible(false)

  return (
    <>
      <HeaderPage 
      title={'Reporte - Recibos de caja'} 
      titleButton={'Exportar'}
      permissions={permissions.REPORTES}
      showDrawer={exportDataAction}
      />
    <ReportCashReceiptsTable
        dataSource={dataSource}        
        handleFiltersChange={setSearchFilters}
        paymentMethodsOptionsList={paymentMethodsOptionsList}        
        creditStatusOptionsList={creditStatusOptionsList}
        loading={loading}
        isAdmin={true}
        handlerEditRow={handlerEditRow}
      />
      <PaymentsDetail
        closable={closeDetail}
        visible={visible}
        loading={loading}
        setLoading={setLoading}
        detailData={detailData}
        loadData={loadData}
        paymentMethodsOptionsList={paymentMethodsOptionsList}
        onlyEdit={true}
      />
    </>
  )
}
export default withRouter(ReportCashReceipts)
