import React, { useEffect,useState,useRef,useCallback } from 'react'
import HeaderPage from '../../../components/HeaderPage'
import { withRouter } from 'react-router'
import ReportSalesProductTable from './components/reportSalesProductTable'
import { permissions } from '../../../commons/types'
import ReportsSrc from '../reportsSrc'
import { message } from 'antd'
import moment from 'moment'

function ReportSalesProduct(props) {

    const initFilters = useRef()

  if (!initFilters.current) {
    initFilters.current = {
        code: '',
        description: '',
        created_at: '',
    }
  }

    const [dataSource, setDataSource] = useState([])
    const [loading, setLoading] = useState(true)    
    const [filters, setFilters] = useState(initFilters.current)
    
  const exportDataAction = () => {
    setLoading(true)    
    let params = {
        code: { $like: `%25${filters.code}%25` },                
        description: { $like: `%25${filters.description}%25` },                
        ...getDateRangeFilterReport(filters.created_at),
        reportType:"salesProducts"
          }
    
    ReportsSrc
      .exportReport(params)
      .then(data => {        
        message.success('Reporte creado')
        exportExcel(data.reportExcel)
      })
      .catch(_ => message.error('Error al cargar reporte productos vendidos'))
      .finally(() => setLoading(false))

  }

  const exportExcel = (base64Excel) =>{
    try{      
      let uri = 'data:application/octet-stream;base64,'+base64Excel;
      let link = document.createElement('a');
      link.setAttribute("download", `Reporte-productos-vendidos.xls`);
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
      .getSalesProductReport({                
        code: { $like: `%25${filters.code}%25` },                
        description: { $like: `%25${filters.description}%25` },                
        ...getDateRangeFilterReport(filters.created_at),        
      })
      .then(data => setDataSource(data))
      .catch(_ => message.error('Error al cargar reporte Venta de productos'))
      .finally(() => setLoading(false))
  }, [filters])
  useEffect(() => {
    loadData()
  }, [loadData])

  return (
    <>
      <HeaderPage 
      title={'Reporte - Productos vendidos'} 
      titleButton={'Exportar'}
      permissions={permissions.REPORTES}
      showDrawer={exportDataAction}
      />
    <ReportSalesProductTable
        dataSource={dataSource}        
        handleFiltersChange={setSearchFilters}        
        loading={loading}
        isAdmin={true}
      />
            
    </>
  )
}
export default withRouter(ReportSalesProduct)
