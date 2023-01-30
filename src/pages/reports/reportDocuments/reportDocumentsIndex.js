import React, { useEffect,useState,useRef,useCallback } from 'react'
import HeaderPage from '../../../components/HeaderPage'
import { withRouter } from 'react-router'
import ReportDocumentTable from './components/reportDocumentTable'
import { permissions,documentsPaymentMethods } from '../../../commons/types'
import ReportsSrc from '../reportsSrc'
import { message } from 'antd'
import moment from 'moment'

function ReportDocuments(props) {

    const initFilters = useRef()

  if (!initFilters.current) {
    initFilters.current = {
      id: '',
      document_number: '',
      name:'',
      related_internal_document_id: '',
      nit: '',
      created_at: '',
      serviceTypes: '',
      paymentMethods: '',
      totalInvoice: '',
    }
  }

    const [dataSource, setDataSource] = useState([])
    const [loading, setLoading] = useState(true)    
    const [filters, setFilters] = useState(initFilters.current)
    const [paymentMethodsOptionsList, setPaymentMethodsOptionsList] = useState([])

    useEffect(() => {    
    setPaymentMethodsOptionsList([
        documentsPaymentMethods.CARD,
        documentsPaymentMethods.CASH,
      ])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

    
  const exportDataAction = () => {
    setLoading(true)
    console.log("expor data")
    let params = {
            related_internal_document_id: { $like: `%25${filters.related_internal_document_id}%25` }, // Nro nota de servicio
            id: { $like: `%25${filters.id}%25` },
            name: { $like: `%25${filters.name}%25` },
            document_number: { $like: `%25${filters.document_number}%25` },
            nit: { $like: `%25${filters.nit}%25` },        
            ...getDateRangeFilterReport(filters.created_at),
            payment_method: filters.paymentMethods,
            total_amount: { $like: `%25${filters.totalInvoice}%25` },
            reportType:"documentReport"
          }
    //     console.log(params)

    ReportsSrc
      .exportReport(params)
      .then(data => {
        console.log("export data >> ",data)
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
      link.setAttribute("download", `Reporte-facturas.xls`);
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
    ReportsSrc
      .getDocumentReport({
        related_internal_document_id: { $like: `%25${filters.related_internal_document_id}%25` }, // Nro nota de servicio
        id: { $like: `%25${filters.id}%25` },
        name: { $like: `%25${filters.name}%25` },
        document_number: { $like: `%25${filters.document_number}%25` },
        nit: { $like: `%25${filters.nit}%25` },        
        ...getDateRangeFilterReport(filters.created_at),
        payment_method: filters.paymentMethods,
        total_amount: { $like: `%25${filters.totalInvoice}%25` },
      })
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
      title={'Reporte - Factura Electronica'} 
      titleButton={'Exportar'}
      permissions={permissions.REPORTES}
      showDrawer={exportDataAction}
      />
    <ReportDocumentTable
        dataSource={dataSource}        
        handleFiltersChange={setSearchFilters}
        paymentMethodsOptionsList={paymentMethodsOptionsList}        
        loading={loading}
        isAdmin={true}
      />
            
    </>
  )
}
export default withRouter(ReportDocuments)
