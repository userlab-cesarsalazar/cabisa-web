import React, { useState, useEffect, useRef, useCallback } from 'react'
import moment from 'moment'
import { Spin, message } from 'antd'
import HeaderPage from '../../../components/HeaderPage'
import ReportClientTable from './components/reportClientTable'
import ReportsSrc from '../reportsSrc'
import { showErrors } from '../../../utils'
import { stakeholdersTypes } from '../../../commons/types'
import { permissions } from '../../../commons/types'

const getTotals = clientsList =>
  clientsList.reduce(
    (result, client) => ({
      totalCredit: result.totalCredit + Number(client.total_credit),
      totalPaidCredit: result.totalPaidCredit + Number(client.paid_credit),
      totalCreditBalance:
        result.totalCreditBalance + Number(client.credit_balance),
    }),
    {
      totalCredit: 0,
      totalPaidCredit: 0,
      totalCreditBalance: 0,
    }
  )

function ReportClient() {
  const initFilters = useRef()

  if (!initFilters.current) {
    initFilters.current = {
      created_at: '',
      name: '',
      stakeholder_type: '',
    }
  }

  const [clients, setClients] = useState([])
  const [
    stakeholderTypesOptionsList,
    setStakeholderTypesOptionsList,
  ] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState(initFilters.current)
  const [isSwitchChecked, setIsSwitchChecked] = useState(true)
  const [totals, setTotals] = useState({})

  const fetchClients = useCallback(() => {
    setLoading(true)
    ReportsSrc.getClientsAccountState({
      created_at: filters.created_at
        ? { $like: `${moment(filters.created_at).format('YYYY-MM-DD')}%25` }
        : '',
      name: { $like: `%25${filters.name}%25` },
      stakeholder_type: filters.stakeholder_type,
    })
      .then(result => setClients(result))
      .catch(error => showErrors(error))
      .finally(() => setLoading(false))
  }, [filters])

  const fetchClientTypes = () => {
    ReportsSrc.getClientTypes()
      .then(data => {
        const stakeholdersTypesList = data.filter(
          s => s !== stakeholdersTypes.PROVIDER
        )
        setStakeholderTypesOptionsList(stakeholdersTypesList)
      })
      .catch(error => showErrors(error))
  }

  useEffect(() => {
    if (stakeholderTypesOptionsList.length === 0) fetchClientTypes()
    fetchClients()
  }, [fetchClients, stakeholderTypesOptionsList])

  useEffect(() => {
    if (isSwitchChecked) setTotals(getTotals(clients))
  }, [isSwitchChecked, clients])

  const setSearchFilters = field => value => {
    if (field === 'clearFilters') setFilters(initFilters.current)
    else setFilters(prevState => ({ ...prevState, [field]: value }))
  }

  const handleSwitchChange = isChecked => setIsSwitchChecked(isChecked)

  const exportDataAction = () => {
    setLoading(true)    
    let params = {
      created_at: filters.created_at
      ? { $like: `${moment(filters.created_at).format('YYYY-MM-DD')}%25` }
      : '',
      name: { $like: `%25${filters.name}%25` },
            
      stakeholder_type: filters.stakeholder_type
      ? filters.stakeholder_type
      : { $ne: stakeholdersTypes.PROVIDER },
      status: 'ACTIVE',

      reportType:"clientReport"
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
      link.setAttribute("download", `Reporte-Cuenta-Clientes.xls`);
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

  return (
    <Spin spinning={loading}>
      <HeaderPage
        titleButton={'Exportar'} 
        title={'Reporte - Estado de cuenta clientes'} 
        permissions={permissions.REPORTES}
        showDrawer={exportDataAction}
      />
      <ReportClientTable      
        dataSource={clients}
        stakeholderTypesOptionsList={stakeholderTypesOptionsList}
        handleFiltersChange={setSearchFilters}
        handleSwitchChange={handleSwitchChange}
        isSwitchChecked={isSwitchChecked}
        totals={totals}        
      />
    </Spin>
  )
}

export default ReportClient
