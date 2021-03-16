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

  const dataDummy = {
    data: {
      current_page: 1,
      data: [
        {
          id: 1,
          code: '234-123',
          serie: 'LKJ-1234-4545-VBNN',
          description: 'ITEM DE PRUEBA',
          price: '100',
          engine: 'SRC-ASDFASD8234-23423',
          type: 0,
        },
        {
          id: 2,
          code: '234-123',
          serie: 'LKJ-1234-4545-VBNN',
          description: 'ITEM DE PRUEBA',
          price: '100',
          engine: 'SRC-ASDFASD8234-23423',
          type: 0,
        },
        {
          id: 3,
          code: '234-123',
          serie: 'LKJ-1234-4545-VBNN',
          description: 'ITEM DE PRUEBA',
          price: '100',
          engine: 'SRC-ASDFASD8234-23423',
          type: 1,
        },
        {
          id: 4,
          code: '234-123',
          serie: 'LKJ-1234-4545-VBNN',
          description: 'ITEM DE PRUEBA',
          price: '100',
          engine: 'SRC-ASDFASD8234-23423',
          type: 0,
        },
      ],
    },
  }

  const inventoryColumns = [
    {
      title: 'Codigo',
      dataIndex: 'code', // Field that is goint to be rendered
      key: 'code',
      render: text => <span>{text}</span>,
    },
    {
      title: '# Serie',
      dataIndex: 'serie', // Field that is goint to be rendered
      key: 'serie',
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
      dataIndex: 'description', // Field that is goint to be rendered
      key: 'description',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Categoria',
      dataIndex: 'type', // Field that is goint to be rendered
      key: 'type',
      render: text => (
        <span>
          {text === 0 ? (
            <Tag color='#87d068'>Servicio</Tag>
          ) : text === 1 ? (
            <Tag color='#f50'>Equipo</Tag>
          ) : text === 2 ? (
            <Tag color='#f50'>Repuesto</Tag>
          ) : (
            ''
          )}
        </span>
      ),
    },
    {
      title: 'Costo',
      dataIndex: 'price', // Field that is goint to be rendered
      key: 'price',
      render: text => <span>{text}</span>,
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

  const showDrawer = () => {
    props.history.push('/inventoryView')
  }
  const onClose = () => {
    setIsVisible(false)
  }

  useEffect(() => {
    setIsVisible(false)
    setLoading(false)
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadData = () => {
    setIsVisible(false)
    setLoading(true)
    setTimeout(() => setLoading(false), 500)
    setTimeout(() => setDataSource(setClientData(dataDummy.data.data)), 500)
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

  const EditRow = data => {
    setEditDataDrawer(data)
    setIsVisible(true)
    setEditMode(true)
  }

  const DeleteRow = data => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1000)
  }

  const onSaveButton = (method, data, dataId) => {
    setExistMoreInfo(false)
    setLoading(true)
    setIsVisible(false)
    setTimeout(() => setLoading(false), 1000)
  }

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
        closable={onClose}
        visible={isVisible}
        edit={editMode}
        editData={editDataDrawer}
        cancelButton={onClose}
        saveButton={onSaveButton}
      />
    </>
  )
}

export default withRouter(InventoryModule)
