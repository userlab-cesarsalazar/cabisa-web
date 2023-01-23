import React, { useCallback, useEffect, useState } from 'react'
import InventoryTable from '../../components/inventoryTable'
import ServiceDrawer from './serviceDrawer'

import ActionOptions from '../../../../components/actionOptions'
import { withRouter } from 'react-router'
import Tag from '../../../../components/Tag'
import { validateRole } from '../../../../utils'
import { permissions, roles } from '../../../../commons/types'

function InventoryService(props) {
  const [editMode, setEditMode] = useState(false)
  const [editDataDrawer, setEditDataDrawer] = useState(null)
  const [dataSource, setDataSource] = useState([])
  const [isVisible, setIsVisible] = useState(false)

  const columns = [
    { width:250,title: 'Codigo', dataIndex: 'code', key: 'code' },
    { width:420,title: 'Descripcion', dataIndex: 'description', key: 'description' },
    {
      width:100,
      title: 'Estado',
      dataIndex: 'status', // Field that is goint to be rendered
      key: 'status',
      render: text => <Tag type='productStatus' value={text} />,
    },
    {
      width:100,
      title: '',
      dataIndex: 'id', // Field that is goint to be rendered
      key: 'id',
      render: (_, data) => (
        <ActionOptions
          editPermissions={false}
          data={data}
          permissionId={permissions.INVENTARIO}
          showDeleteBtn
          handlerDeleteRow={DeleteRow}
          handlerEditRow={EditRow}
        />
      ),
    },
  ]

  const isAdmin = validateRole(roles.ADMIN)

  const loadData = useCallback(() => {
    setDataSource(getClientData(props.dataSource))
  }, [props.dataSource])

  useEffect(() => {
    loadData()
    return () => setIsVisible(false)
  }, [loadData])

  const getClientData = data => {
    const _data = []
    for (let k in data) {
      const d = data[k]
      _data.push(d)
    }
    return _data
  }

  const showDrawer = () => props.history.push('/inventoryServicesView')

  const onClose = () => setIsVisible(false)

  const searchTextFinder = data => props.searchByTxt(data)

  const onCloseAfterSave = () => {
    setIsVisible(false)
    props.clearSearch()
  }

  //START: table handler
  const EditRow = data => {
    setEditDataDrawer(data)
    setIsVisible(true)
    setEditMode(true)
  }

  const DeleteRow = data => props.deleteItemModule({ id: data.id })
  //END: table handler

  return (
    <>
      <InventoryTable
        warehouse={true}
        showDraweTbl={showDrawer}
        dataSource={dataSource}
        loading={props.loading}
        handlerTextSearch={searchTextFinder}
        handlerEditRow={EditRow}
        handlerDeleteRow={DeleteRow}
        columns={columns}
        isAdmin={isAdmin}
      />

      <ServiceDrawer
        warehouse={false}
        closable={onClose}
        visible={isVisible}
        edit={editMode}
        editData={editDataDrawer}
        cancelButton={onClose}
        closeAfterSave={onCloseAfterSave}
        serviceStatusList={props.serviceStatusList}
        isAdmin={isAdmin}
      />
    </>
  )
}

export default withRouter(InventoryService)
