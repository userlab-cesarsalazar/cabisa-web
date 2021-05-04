import React, { useEffect, useState } from 'react'
import InventoryTable from '../../components/inventoryTable'

import ProductDrawer from './productDrawer'

import { withRouter } from 'react-router'
import { Tag } from 'antd'
import ActionOptions from '../../../../components/actionOptions'

function InventoryProduct(props) {
  const [editMode, setEditMode] = useState(false)
  const [editDataDrawer, setEditDataDrawer] = useState(null)
  const [dataSource, setDataSource] = useState([])
  const [loading, setLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const wareHouseColumns = [
    {
      title: 'Codigo',
      dataIndex: 'code', // Field that is goint to be rendered
      key: 'code',
      render: text => <span>{text}</span>,
    },
    {
      title: '# Serie',
      dataIndex: 'serial_number', // Field that is goint to be rendered
      key: 'serial_number',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Descripcion',
      dataIndex: 'name', // Field that is goint to be rendered
      key: 'name',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Categoria',
      dataIndex: 'service_type_id', // Field that is goint to be rendered
      key: 'service_type_id',
      render: text => (
        <span>
          {text === 1 ? (
            <Tag color='red'>Servicio</Tag>
          ) : text === 2 ? (
            <Tag color='blue'>Equipo</Tag>
          ) : text === 3 ? (
            <Tag color='orange'>Repuesto</Tag>
          ) : (
            ''
          )}
        </span>
      ),
    },
    {
      title: 'Precio de venta',
      dataIndex: 'cost', // Field that is goint to be rendered
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
    props.history.push('/inventoryProductsView')
  }

  const onClose = () => {
    setIsVisible(false)
  }

  const loadData = () => {
    setIsVisible(false)
    setLoading(true)
    setTimeout(() => setLoading(false), 1000)
    setTimeout(() => setDataSource(setClientData(props.dataSource)), 500)
  }

  const searchTextFinder = data => {
    props.searchWarehouseByTxt(data, 'Warehouse')
  }

  const searchByServiceCategory = data => {
    props.searchByServiceCategory(data)
  }

  const setClientData = data => {
    const _data = []
    for (let k in data) {
      const d = data[k]
      _data.push(d)
    }
    return _data
  }

  const onCloseAfterSaveWarehouse = () => {
    setIsVisible(false)
    props.closeAfterSaveWareHouse()
  }
  //START: table handler
  const EditRow = data => {
    setEditDataDrawer(data)
    setIsVisible(true)
    setEditMode(true)
  }

  const DeleteRow = data => {
    setLoading(true)
    props.deleteItemWareHouse({ id: data.id })
  }
  //END: table handler

  return (
    <>
      <InventoryTable
        warehouse={false}
        showDraweTbl={showDrawer}
        dataSource={dataSource}
        loading={loading}
        handlerTextSearch={searchTextFinder}
        handlerCategoryService={searchByServiceCategory}
        columns={wareHouseColumns}
      />

      <ProductDrawer
        warehouse={true}
        closable={onClose}
        visible={isVisible}
        edit={editMode}
        editData={editDataDrawer}
        cancelButton={onClose}
        closeAfterSave={onCloseAfterSaveWarehouse}
      />
    </>
  )
}
export default withRouter(InventoryProduct)
