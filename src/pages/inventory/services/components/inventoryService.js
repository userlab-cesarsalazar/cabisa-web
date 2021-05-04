import React, { useEffect, useState } from 'react'
import InventoryTable from '../../components/inventoryTable'
import ServiceDrawer from './serviceDrawer'

import ActionOptions from '../../../../components/actionOptions'
import { withRouter } from 'react-router'
import { Tag } from 'antd'

function InventoryService(props) {
  const [editMode, setEditMode] = useState(false)
  const [editDataDrawer, setEditDataDrawer] = useState(null)
  const [dataSource, setDataSource] = useState([])
  const [loading, setLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const inventoryColumns = [
    { title: 'Codigo', dataIndex: 'code', key: 'code' },
    { title: 'Descripcion', dataIndex: 'name', key: 'name' },
    {
      title: 'Precio de venta',
      dataIndex: 'cost',
      key: 'cost',
      render: text => <span>{text.toFixed(2)}</span>,
    },
    {
      title: 'Estado',
      dataIndex: 'is_active', // Field that is goint to be rendered
      key: 'is_active',
      render: text => (
        <span>
          {text === 0 ? (
            <Tag color='#f50'>Inactivo</Tag>
          ) : text === 1 ? (
            <Tag color='#87d068'>Activo</Tag>
          ) : text === 2 ? (
            <Tag color='grey'>Bloqueado</Tag>
          ) : (
            ''
          )}
        </span>
      ),
    },

    {
      title: '',
      dataIndex: 'id', // Field that is goint to be rendered
      key: 'id',
      render: (row, data) => (
        <ActionOptions
          editPermissions={false}
          data={data}
          permissionId={5}
          handlerDeleteRow={DeleteRow}
          handlerEditRow={EditRow}
        />
      ),
    },
  ]

  useEffect(() => {
    setIsVisible(false)
    setLoading(false)
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.dataSource])

  const showDrawer = () => {
    props.history.push('/inventoryServicesView')
  }

  const onClose = () => {
    setIsVisible(false)
  }

  const onCloseAfterSave = () => {
    setIsVisible(false)
    props.closeAfterSave()
  }

  const loadData = () => {
    setIsVisible(false)
    setLoading(true)
    setTimeout(() => setLoading(false), 500)
    setTimeout(() => setDataSource(setClientData(props.dataSource)), 500)
  }

  const searchTextFinder = data => {
    props.searchModuleByTxt(data, 'Module')
  }

  const setClientData = data => {
    const _data = []
    for (let k in data) {
      const d = data[k]
      _data.push(d)
    }
    return _data
  }

  //START: table handler
  const EditRow = data => {
    console.log('DATA EDIT >> ', data)
    setEditDataDrawer(data)
    setIsVisible(true)
    setEditMode(true)
  }

  const DeleteRow = data => {
    setLoading(true)
    props.deleteItemModule({ id: data.id })
  }
  //END: table handler

  return (
    <>
      <InventoryTable
        warehouse={true}
        showDraweTbl={showDrawer}
        dataSource={dataSource}
        loading={loading}
        handlerTextSearch={searchTextFinder}
        handlerEditRow={EditRow}
        handlerDeleteRow={DeleteRow}
        columns={inventoryColumns}
      />

      <ServiceDrawer
        warehouse={false}
        closable={onClose}
        visible={isVisible}
        edit={editMode}
        editData={editDataDrawer}
        cancelButton={onClose}
        closeAfterSave={onCloseAfterSave}
      />
    </>
  )
}

export default withRouter(InventoryService)
