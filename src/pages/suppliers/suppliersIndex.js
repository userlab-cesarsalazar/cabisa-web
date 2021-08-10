import React, { useEffect, useState } from 'react'
import { message } from 'antd'
import HeaderPage from '../../components/HeaderPage'
import SupplierTable from './components/supplierTable'
import SuppliersDrawer from '../suppliers/components/suppliersDrawer'

//api
import SuppliersSrc from './suppliersSrc'
import { permissions } from '../../commons/types'

function Suppliers(props) {
  const [visible, setVisible] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editDataDrawer, setEditDataDrawer] = useState(null)
  const [dataSource, setDataSource] = useState([])
  const [loading, setLoading] = useState(false)

  const showDrawer = () => props.history.push('/supplierView')

  const onClose = () => setVisible(false)

  useEffect(() => {
    setVisible(false)
    setLoading(false)
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadData = () => {
    setLoading(true)
    setVisible(false)

    SuppliersSrc.getSuppliers()
      .then(data => {
        setDataSource(setSupplierData(data))
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        message.error('No se pudo obtener la informacion.')
        setLoading(false)
      })
  }

  const searchTextFinder = data => {
    setLoading(true)
    SuppliersSrc.getSuppliersFilter(data)
      .then(resp => {
        setDataSource(setSupplierData(resp))
        setLoading(false)
      })
      .catch(err => {
        setLoading(false)
        console.log(err)
        message.error('No se pudo obtener la informacion.')
      })
  }

  const setSupplierData = data => {
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
    setLoading(true)

    SuppliersSrc.deleteSupplier(data.id)
      .then(_ => {
        message.success('Elemento eliminado.')
        loadData()
      })
      .catch(_ => {
        message.warning('No se pudo eliminar el elemento seleccionado.')
        setLoading(false)
      })
  }

  return (
    <>
      <HeaderPage
        titleButton={'Nuevo Proveedor'}
        title={'Proveedores'}
        showDrawer={showDrawer}
        permissions={permissions.PROVEEDORES}
      />
      <SupplierTable
        dataSource={dataSource}
        loading={loading}
        handlerTextSearch={searchTextFinder}
        handlerEditRow={EditRow}
        handlerDeleteRow={DeleteRow}
      />
      <SuppliersDrawer
        closable={onClose}
        visible={visible}
        edit={editMode}
        editData={editDataDrawer}
        cancelButton={onClose}
        loadData={loadData}
      />
    </>
  )
}

export default Suppliers
