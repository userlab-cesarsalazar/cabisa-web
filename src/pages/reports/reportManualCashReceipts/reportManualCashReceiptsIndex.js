import React, { useEffect,useState,useRef,useCallback } from 'react'
import HeaderPage from '../../../components/HeaderPage'
import { withRouter } from 'react-router'
import ReportManualCashReceiptsTable from './components/reportManualCashReceiptsTable'
import { permissions } from '../../../commons/types'
import ReportsSrc from '../reportsSrc'
import { message } from 'antd'
import moment from 'moment'
import PaymentsSrc from '../../payments/paymentsSrc'

function ReportManualCashReceipts(props) {

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

    const [dataSource, setDataSource] = useState([])
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(true)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

    
  const exportDataAction = () => {
    setLoading(true)    
                
    let params = {        
        id: { $like: `%25${filters.id}%25` }, // Nro de Serie
      name: { $like: `%25${filters.name}%25` }, // nombre cliente
      nit: { $like: `%25${filters.nit}%25` }, // nombre cliente
        ...getDateRangeFilterReport(filters.created_at),
        payment_method: filters.paymentMethods,
        total_amount: { $like: `%25${filters.totalInvoice}%25` },
        status: filters.status,
        reportType:"manualCashReceipts"
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
      link.setAttribute("download", `Reporte-Recibos-Manuales.xls`);
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
        id: { $like: `%25${filters.id}%25` }, // Nro de Serie
        name: { $like: `%25${filters.name}%25` }, // nombre cliente
        nit: { $like: `%25${filters.nit}%25` }, // nombre cliente
          ...getDateRangeFilterReport(filters.created_at),
          payment_method: filters.paymentMethods,
          total_amount: { $like: `%25${filters.totalInvoice}%25` },
          status: filters.status,
      }
       
    ReportsSrc
      .getManualCashReceipts(filterParams)
      .then(data => setDataSource(data))
      .catch(_ => message.error('Error al cargar reporte facturas'))
      .finally(() => setLoading(false))
  }, [filters])
  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadData])

  return (
    <>
      <HeaderPage 
      title={'Reporte - Recibos manuales'} 
      titleButton={'Exportar'}
      permissions={permissions.REPORTES}
      showDrawer={exportDataAction}
      />
    <ReportManualCashReceiptsTable
        dataSource={dataSource}        
        handleFiltersChange={setSearchFilters}
        paymentMethodsOptionsList={paymentMethodsOptionsList}        
        creditStatusOptionsList={creditStatusOptionsList}
        loading={loading}
        isAdmin={isAdmin}
      />
            
    </>
  )
}
export default withRouter(ReportManualCashReceipts)
