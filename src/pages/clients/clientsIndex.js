import React, { useEffect, useState } from 'react'
import HeaderPage from '../../components/HeaderPage'
import ClientTable from './components/clientTable'
import ClientsDrawer from '../clients/components/clientsDrawer'

//api
import ClientsSrc from './clientsSrc'
import { message } from 'antd'

function Clients(props) {
  const [visible, setVisible] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editDataDrawer, setEditDataDrawer] = useState(null)
  const [dataSource, setDataSource] = useState([])
  const [loading, setLoading] = useState(false)

  const showDrawer = () => {
    props.history.push('/clientView')
  }
  const onClose = () => {
    setVisible(false)
  }

  useEffect(() => {
    setVisible(false)
    setLoading(false)
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadData = () => {
    setVisible(false)
    setLoading(true)
    ClientsSrc.getClients()
      .then(data => {
        setDataSource(setClientData(data.message))
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        message.error('No se pudo obtener la informacion.')
      })
  }

  const searchTextFinder = data => {
    setLoading(true)
    ClientsSrc.getClientsFilter(data)
      .then(resp => {
        setDataSource(setClientData(resp.message))
        setLoading(false)
      })
      .catch(err => {
        setLoading(false)
        console.log(err)
        message.error('No se pudo obtener la informacion.')
      })
  }

  const setClientData = data => {
    const _data = []
    for (let k in data) {
      const d = data[k]
      _data.push(d)
    }
    return _data
  }

  const EditRow = data => {
    setEditDataDrawer(data)
    setVisible(true)
    setEditMode(true)
  }

  const DeleteRow = data => {
    ClientsSrc.deleteClient({ id: data.id })
      .then(_ => {
        message.success('Elemento eliminado.')
        loadData()
      })
      .catch(err => {
        console.log('DELETE CLIENTE ERROR', err)
        message.warning('No se pudo eliminar el elemento seleccionado.')
      })
  }

  const onSaveButton = () => {
    loadData()
  }

  return (
    <>
      <HeaderPage
        titleButton={'Nuevo Cliente'}
        title={'Clientes'}
        showDrawer={showDrawer}
        permissions={6}
      />
      <ClientTable
        dataSource={dataSource}
        loading={loading}
        handlerTextSearch={searchTextFinder}
        handlerEditRow={EditRow}
        handlerDeleteRow={DeleteRow}
      />
      <ClientsDrawer
        closable={onClose}
        visible={visible}
        edit={editMode}
        editData={editDataDrawer}
        cancelButton={onClose}
        saveButton={onSaveButton}
      />
    </>
  )
}

export default Clients
