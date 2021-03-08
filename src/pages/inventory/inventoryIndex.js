import React, { useEffect, useState } from 'react'
import HeaderPage from '../../components/HeaderPage'
import InventoryTable from './components/inventoryTable'
import InventoryDrawer from './components/inventoryDrawer'
import LoadMoreButton from '../../components/LoadMoreButton'

function Inventory(props) {
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
      <HeaderPage
        titleButton={'Nuevo Item'}
        title={'Inventario'}
        showDrawer={showDrawer}
        permissions={6}
      />
      <InventoryTable
        dataSource={dataSource}
        loading={loading}
        handlerTextSearch={searchTextFinder}
        handlerEditRow={EditRow}
        handlerDeleteRow={DeleteRow}
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

export default Inventory
