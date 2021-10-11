import React, { useState, useEffect, useRef, useCallback } from 'react'
import moment from 'moment'
import { Spin } from 'antd'
import HeaderPage from '../../../components/HeaderPage'
import ReportClientTable from './components/reportClientTable'
import ReportsSrc from '../reportsSrc'
import { showErrors } from '../../../utils'
import { stakeholdersTypes } from '../../../commons/types'

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
    else fetchClients()
  }, [fetchClients, stakeholderTypesOptionsList])

  useEffect(() => {
    if (isSwitchChecked) setTotals(getTotals(clients))
  }, [isSwitchChecked, clients])

  const setSearchFilters = field => value => {
    if (field === 'clearFilters') setFilters(initFilters.current)
    else setFilters(prevState => ({ ...prevState, [field]: value }))
  }

  const handleSwitchChange = isChecked => setIsSwitchChecked(isChecked)

  return (
    <Spin spinning={loading}>
      <HeaderPage titleButton={''} title={'Reporte - Clientes'} />
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
