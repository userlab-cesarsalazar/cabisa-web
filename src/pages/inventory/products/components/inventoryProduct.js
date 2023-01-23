import React, { useCallback, useEffect, useState } from 'react'
import InventoryTable from '../../components/inventoryTable'
import ProductDrawer from './productDrawer'
import { withRouter } from 'react-router'
import Tag from '../../../../components/Tag'
import ActionOptions from '../../../../components/actionOptions'
import { validateRole } from '../../../../utils'
import { permissions, roles } from '../../../../commons/types'

function InventoryProduct(props) {
  const [editMode, setEditMode] = useState(false)
  const [editDataDrawer, setEditDataDrawer] = useState(null)
  const [dataSource, setDataSource] = useState([])
  const [isVisible, setIsVisible] = useState(false)

  const columns = [
    {
      width:120,
      title: 'Codigo',
      dataIndex: 'code', // Field that is goint to be rendered
      key: 'code',
      render: text => <span>{text}</span>,
    },
    {
      width:120,
      title: '# Serie',
      dataIndex: 'serial_number', // Field that is goint to be rendered
      key: 'serial_number',
      render: text => <span>{text}</span>,
    },
    {
      width:350,
      title: 'Descripcion',
      dataIndex: 'description', // Field that is goint to be rendered
      key: 'description',
      render: text => <span>{text}</span>,
    },
    {
      width:120,
      title: 'Categoria',
      dataIndex: 'product_category', // Field that is goint to be rendered
      key: 'product_category',
      render: text => <Tag type='productCategories' value={text} />,
    },
    {
      width:120,
      title: 'Estado',
      dataIndex: 'status', // Field that is goint to be rendered
      key: 'status',
      render: text => <Tag type='productStatus' value={text} />,
    },
    {
      width:120,
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

  const showDrawer = () => props.history.push('/inventoryProductsView')

  const onClose = () => setIsVisible(false)

  const searchTextFinder = data => props.searchByTxt(data)

  const searchByCategory = data => props.searchByCategory(data)

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

  const DeleteRow = data => props.deleteItemWareHouse({ id: data.id })
  //END: table handler

  return (
    <>
      <InventoryTable
        warehouse={false}
        showDraweTbl={showDrawer}
        dataSource={dataSource}
        loading={props.loading}
        handlerTextSearch={searchTextFinder}
        handlerCategorySearch={searchByCategory}
        columns={columns}
        productCategoriesList={props.productCategoriesList}
        isAdmin={isAdmin}
      />

      <ProductDrawer
        warehouse={true}
        closable={onClose}
        visible={isVisible}
        edit={editMode}
        editData={editDataDrawer}
        cancelButton={onClose}
        closeAfterSave={onCloseAfterSaveWarehouse}
        productStatusList={props.productStatusList}
        productCategoriesList={props.productCategoriesList}
        productsTaxesList={props.productsTaxesList}
        isAdmin={isAdmin}
      />
    </>
  )
}
export default withRouter(InventoryProduct)
