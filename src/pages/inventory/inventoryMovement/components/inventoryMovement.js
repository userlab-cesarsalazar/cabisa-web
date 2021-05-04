import React, { useEffect, useState } from 'react'
import { Tag } from 'antd'
import ActionOptions from '../../../../components/actionOptions'
import InventoryMovementTable from './inventoryMovementTable'
import InventoryMovementDrawer from './inventoryMovementDrawer'
import { withRouter } from 'react-router'

function InventoryMovementComponent(props) {
  const [editMode, setEditMode] = useState(false)
  const [editDataDrawer, setEditDataDrawer] = useState(null)
  const [dataSource, setDataSource] = useState([])
  const [loading, setLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const columns = [
    {
      title: 'Fecha de ingreso',
      dataIndex: 'dateCreated', // Field that is goint to be rendered
      key: 'dateCreated',
    },
    {
      title: 'Descripcion',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Codigo de producto',
      dataIndex: 'productCode',
      key: 'productCode',
    },
    {
      title: 'Proveedor',
      dataIndex: 'provider',
      key: 'provider',
    },
    {
      title: 'Costo de compra',
      dataIndex: 'purchaseCost',
      key: 'purchaseCost',
    },
    {
      title: 'Tipo de movimiento',
      dataIndex: 'type', // Field that is goint to be rendered
      key: 'type',
      render: text => (
        <span>
          {text === 1 ? (
            <Tag color='blue'>Compra</Tag>
          ) : text === 2 ? (
            <Tag color='green'>Ingreso</Tag>
          ) : text === 3 ? (
            <Tag color='red'>Egreso</Tag>
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

  const showEdit = () => {
    props.history.push('/inventoryMovementsView')
  }

  const onClose = () => {
    setIsVisible(false)
  }

  const loadData = () => {
    setIsVisible(false)
    setLoading(true)
    setTimeout(() => setLoading(false), 1000)
    setTimeout(() => setDataSource(props.dataSource), 500)
  }

  const searchTextFinder = data => {
    props.searchByTxt(data)
  }

  const searchByCategory = data => {
    props.searchByCategoryMovement(data)
  }

  const onCloseAfterSave = () => {
    setIsVisible(false)
    props.closeAfterSaveInventoryMovement()
  }

  //START: table handler
  const EditRow = data => {
    setEditDataDrawer(data)
    setIsVisible(true)
    setEditMode(true)
  }

  const DeleteRow = data => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
    props.deleteMovement({ id: data.id })
  }
  //END: table handler

  return (
    <>
      <InventoryMovementTable
        showDraweTbl={showEdit}
        dataSource={dataSource}
        loading={loading}
        handlerTextSearch={searchTextFinder}
        handlerCategoryService={searchByCategory}
        columns={columns}
      />
      <InventoryMovementDrawer
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

export default withRouter(InventoryMovementComponent)
