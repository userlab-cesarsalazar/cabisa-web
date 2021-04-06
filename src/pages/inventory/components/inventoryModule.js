import React, { useEffect, useState } from 'react'
import InventoryTable from '../components/inventoryTable'
import InventoryDrawer from '../components/inventoryDrawer'
import LoadMoreButton from '../../../components/LoadMoreButton'
import { withRouter } from 'react-router'
import { Button, Divider, Popconfirm, Popover, Tag } from 'antd'
import MoreOutlined from '@ant-design/icons/lib/icons/MoreOutlined'

function InventoryModule(props) {
  const [editMode, setEditMode] = useState(false)
  const [editDataDrawer, setEditDataDrawer] = useState(null)
  const [dataSource, setDataSource] = useState([])
  const [existMoreInfo, setExistMoreInfo] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const inventoryColumns = [
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
      title: '# Motor',
      dataIndex: 'engine', // Field that is goint to be rendered
      key: 'engine',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Descripcion',
      dataIndex: 'name', // Field that is goint to be rendered
      key: 'name',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Servicio',
      dataIndex: 'service_type_id', // Field that is goint to be rendered
      key: 'service_type_id',
      render: text => (
        <span>
          {text === 1 ? (
            <Tag color='#87d068'>Servicio</Tag>
          ) : text === 2 ? (
            <Tag color='#f50'>Equipo</Tag>
          ) : text === 3 ? (
            <Tag color='#f50'>Repuesto</Tag>
          ) : (
            ''
          )}
        </span>
      ),
    },
    {
      title: 'Costo',
      dataIndex: 'cost', // Field that is goint to be rendered
      key: 'cost',
      render: text => <span>{text.toFixed(2)}</span>,
    },
    {
      title: '',
      dataIndex: 'id', // Field that is goint to be rendered
      key: 'id',
      render: (row, data) => (
        <span>
          {
            <Popover
              placement='left'
              style={{ zIndex: 'auto' }}
              content={
                <div>
                  <span
                    className={'user-options-items'}
                    onClick={() => EditRow(data)}
                  >
                    Editar
                  </span>
                  <Divider
                    className={'divider-enterprise-margins'}
                    type={'horizontal'}
                  />

                  <Popconfirm
                    title='Estas seguro de borrar el elemento selccionado?'
                    onConfirm={() => DeleteRow(data)}
                    okText='Si'
                    cancelText='No'
                  >
                    <span className={'user-options-items'}>Eliminar</span>
                  </Popconfirm>
                </div>
              }
              trigger='click'
            >
              <Button shape={'circle'} className={'enterprise-settings-button'}>
                <MoreOutlined />
              </Button>
            </Popover>
          }
        </span>
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
    props.history.push('/inventoryView')
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

  const handlerMoreButton = () => {
    if (existMoreInfo) {
      setLoading(true)
    }
  }

  const searchTextFinder = data => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1000)
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
    setEditDataDrawer(data)
    setIsVisible(true)
    setEditMode(true)
  }

  const DeleteRow = data => {
    setLoading(true)
    props.deleteItemModule({id:data.id})
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
        handlerEditRow={EditRow}
        handlerDeleteRow={DeleteRow}
        columns={inventoryColumns}
      />
      <LoadMoreButton
        handlerButton={handlerMoreButton}
        moreInfo={existMoreInfo}
      />
      <InventoryDrawer
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

export default withRouter(InventoryModule)
