import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import moment from 'moment'
import { message } from 'antd'
import HeaderPage from '../../components/HeaderPage'
import RepairsTable from './components/repairsTable'
import RepairsDrawer from '../repairs/components/repairsDrawer'
import { showErrors } from '../../utils'

//api
import RepairsSrc from './repairsSrc'
import { permissions } from '../../commons/types'

function Repairs(props) {
  const initFilters = useRef()

  if (!initFilters.current) {
    initFilters.current = {
      start_at: '',
      end_at: '',
      status: '',
    }
  }

  const history = useHistory()
  const [visible, setVisible] = useState(false)
  const [editData, setEditData] = useState(null)
  const [dataSource, setDataSource] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState(initFilters.current)
  const [statusOptionsList, setStatusOptionsList] = useState([])

  const getStatusOptionsList = useCallback(() => {
    setLoading(true)

    RepairsSrc.getRepairsStatus()
      .then(data => setStatusOptionsList(data))
      .catch(error => {
        showErrors(error)
      })
      .finally(() => setLoading(false))
  }, [])

  const loadData = useCallback(() => {
    setLoading(true)
    setVisible(false)

    RepairsSrc.getRepairs({
      start_date: filters.start_date
        ? { $like: `${moment(filters.start_date).format('YYYY-MM-DD')}%25` }
        : '',
      end_date: filters.end_date
        ? { $like: `${moment(filters.end_date).format('YYYY-MM-DD')}%25` }
        : '',
      status: { $like: `%25${filters.status}%25` },
    })
      .then(data => setDataSource(data))
      .catch(_ => message.error('No se pudo obtener la informacion.'))
      .finally(() => setLoading(false))
  }, [filters])

  useEffect(() => {
    getStatusOptionsList()
  }, [getStatusOptionsList])

  useEffect(() => {
    setVisible(false)
    setLoading(false)
    loadData()

    return () => {
      setVisible(false)
      setLoading(false)
    }
  }, [loadData])

  const setSearchFilters = field => value =>
    setFilters(prevState => ({ ...prevState, [field]: value }))

  const showDrawer = data => {
    setVisible(true)
    setEditData(data)
  }

  const goToCreateOrder = () => history.push('/repairsView')

  const handleCloseModal = () => setVisible(false)

  const cancelRow = document_id => {
    setLoading(true)

    RepairsSrc.cancelRepair(document_id)
      .then(_ => {
        message.success('Orden cancelada exitosamente')
        loadData()
      })
      .catch(error => showErrors(error))
      .finally(() => setLoading(false))
  }

  const approveRow = document_id => {
    setLoading(true)

    RepairsSrc.approveRepair(document_id)
      .then(_ => {
        message.success('Orden aprobada exitosamente')
        loadData()
      })
      .catch(error => showErrors(error))
      .finally(() => setLoading(false))
  }

  return (
    <>
      <HeaderPage
        titleButton={'Nueva Orden de Reparacion'}
        title={'Reparaciones'}
        showDrawer={goToCreateOrder}
        permissions={permissions.REPARACIONES}
      />

      <RepairsTable
        loading={loading}
        dataSource={dataSource}
        handleFiltersChange={setSearchFilters}
        handlerApproveRow={approveRow}
        handlerCancelRow={cancelRow}
        handlerEditRow={showDrawer}
        statusOptionsList={statusOptionsList}
      />

      <RepairsDrawer
        closable={handleCloseModal}
        visible={visible}
        editData={editData}
        cancelButton={handleCloseModal}
        loadData={loadData}
      />
    </>
  )
}

export default Repairs
