import React, { useEffect, useCallback, useState } from 'react'
import moment from 'moment'
import { useHistory } from 'react-router'
import { message } from 'antd'
import ActionOptions from '../../../../components/actionOptions'
import InventoryMovementTable from './inventoryMovementTable'
import InventoryMovementDrawer from './inventoryMovementDrawer'
import inventorySrc from '../../inventorySrc'
import Tag from '../../../../components/Tag'
import { showErrors, validateRole } from '../../../../utils'
import { permissions, documentsStatus, roles } from '../../../../commons/types'

const getColumns = ({ DeleteRow, EditRow, isAdmin }) => [
  {
    title: 'Fecha',
    dataIndex: 'start_date', // Field that is goint to be rendered
    key: 'start_date',
    render: text =>
      text ? <span>{moment(text).format('DD-MM-YYYY')}</span> : '',
  },
  {
    title: 'Nro Documento',
    dataIndex: 'related_external_document_id',
    key: 'related_external_document_id',
  },
  {
    title: 'Proveedor',
    dataIndex: 'stakeholder_name',
    key: 'stakeholder_name',
  },
  {
    title: 'Status',
    dataIndex: 'status', // Field that is goint to be rendered
    key: 'status',
    render: text => <Tag type='documentStatus' value={text} />,
  },
  {
    title: '',
    dataIndex: 'id', // Field that is goint to be rendered
    key: 'id',
    render: (_, data) => (
      <ActionOptions
        editPermissions={false}
        data={data}
        permissionId={permissions.INVENTARIO}
        showDeleteBtn={data.status !== documentsStatus.CANCELLED}
        handlerDeleteRow={DeleteRow}
        handlerEditRow={EditRow}
        editAction={
          isAdmin && data.status !== documentsStatus.CANCELLED ? 'edit' : 'show'
        }
        deleteAction='cancel'
      />
    ),
  },
]

function InventoryMovementComponent() {
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState([])
  const [isVisible, setIsVisible] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [editDataDrawer, setEditDataDrawer] = useState(null)

  const isAdmin = validateRole(roles.ADMIN)

  const getPurchases = useCallback(() => {
    setLoading(true)

    inventorySrc
      .getPurchases({
        related_external_document_id: { $like: `%25${searchText}%25` },
        status: statusFilter,
      })
      .then(data => setDataSource(data))
      .catch(error => showErrors(error))
      .finally(() => setLoading(false))
  }, [searchText, statusFilter])

  useEffect(() => {
    getPurchases()
  }, [getPurchases])

  const searchByTxt = data => setSearchText(data)

  const searchByStatus = data => setStatusFilter(data)

  const goCreateNewItem = () => history.push('/inventoryMovementsView')

  const onClose = () => setIsVisible(false)

  const clearSearch = () => {
    if (searchText === '' && statusFilter === '') getPurchases()
    else {
      setSearchText('')
      setStatusFilter('')
    }
  }

  const EditRow = data => {
    setEditDataDrawer(data)
    setIsVisible(true)
  }

  const DeleteRow = data => {
    setLoading(true)

    inventorySrc
      .cancelPurchase({ document_id: data.id })
      .then(_ => {
        clearSearch()
        message.success('Compra anulada exitosamente')
      })
      .catch(error => showErrors(error))
      .finally(() => setLoading(false))
  }

  const columns = getColumns({ DeleteRow, EditRow, isAdmin })

  return (
    <>
      <InventoryMovementTable
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        goCreateNewItem={goCreateNewItem}
        handlerTextSearch={searchByTxt}
        handlerCategoryService={searchByStatus}
      />

      <InventoryMovementDrawer
        closable={onClose}
        visible={isVisible}
        editData={editDataDrawer}
        forbidEdition={
          !isAdmin || editDataDrawer?.status === documentsStatus.CANCELLED
        }
        getPurchases={getPurchases}
      />
    </>
  )
}

export default InventoryMovementComponent
