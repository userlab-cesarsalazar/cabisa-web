import React, { useCallback, useEffect, useState } from 'react'
import { Cache } from 'aws-amplify'
import InventoryTable from '../../components/inventoryTable'
import ServiceDrawer from './serviceDrawer'

import ActionOptions from '../../../../components/actionOptions'
import { withRouter } from 'react-router'
import Tag from '../../../../components/Tag'
import { validateRole } from '../../../../utils'

function InventoryService(props) {
  const [editMode, setEditMode] = useState(false)
  const [editDataDrawer, setEditDataDrawer] = useState(null)
  const [dataSource, setDataSource] = useState([])
  const [isVisible, setIsVisible] = useState(false)

  const columns = [
    { title: 'Codigo', dataIndex: 'code', key: 'code' },
    { title: 'Descripcion', dataIndex: 'description', key: 'description' },
    {
      title: 'Estado',
      dataIndex: 'status', // Field that is goint to be rendered
      key: 'status',
      render: text => <Tag type='productStatus' value={text} />,
    },
  ]

  const priceColumn = {
    title: 'Precio de venta',
    dataIndex: 'unit_price',
    key: 'unit_price',
    render: text => <span>{text.toFixed(2)}</span>,
  }

  const actionsColumn = {
    title: '',
    dataIndex: 'id', // Field that is goint to be rendered
    key: 'id',
    render: (_, data) => (
      <ActionOptions
        editPermissions={false}
        data={data}
        permissionId={5}
        showDeleteBtn
        handlerDeleteRow={DeleteRow}
        handlerEditRow={EditRow}
      />
    ),
  }

  const isAdmin = validateRole(Cache.getItem('currentSession').rol_id, 1)

  const columnsWithPrice = isAdmin ? [...columns, priceColumn] : columns

  const inventoryColumns = [...columnsWithPrice, actionsColumn]

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
        columns={inventoryColumns}
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
