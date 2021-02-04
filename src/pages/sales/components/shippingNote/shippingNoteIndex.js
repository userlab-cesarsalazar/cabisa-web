import React, { useState } from 'react'
import ShippingNoteTable from './shippingNoteTable'
import ShippingNoteDetail from './shippingNoteDetailDrawer'
import LoadMoreButton from '../../../../components/LoadMoreButton'

const dataSource = [
  {
    id: 1,
    _ticketId: '001831',
    _enterprise: 'Empresas Ejemplo',
    _project: 'Proyecto ejemplo',
    _manager: 'Luis de leon',
    _phone: 55459429,
    _address: 'Ciudad Guatemala',
  },
  {
    id: 2,
    _ticketId: '001832',
    _enterprise: 'Empresas Ejemplo 2',
    _project: 'Proyecto ejemplo',
    _manager: 'Luis de leon',
    _phone: 55459429,
    _address: 'Ciudad Guatemala',
  },
  {
    id: 3,
    _ticketId: '001833',
    _enterprise: 'Empresas Ejemplo 3',
    _project: 'Proyecto ejemplo',
    _manager: 'Luis de leon',
    _phone: 55459429,
    _address: 'Ciudad Guatemala',
  },
  {
    id: 4,
    _ticketId: '001834',
    _enterprise: 'Empresas Ejemplo 4',
    _project: 'Proyecto ejemplo',
    _manager: 'Luis de leon',
    _phone: 55459429,
    _address: 'Ciudad Guatemala',
  },
]

const detailData = []

function ShippingNote() {
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [existMoreInfo, setExistMoreInfo] = useState(false)

  const onClose = () => {
    setVisible(false)
  }

  const onCancelButton = () => {
    console.log('ocultando')
    setVisible(false)
  }

  const handlerMoreButton = () => {
    console.log('moreInfo')
  }

  const saveButtonEdit = (data, user_id) => {
    setExistMoreInfo(false)
    setLoading(true)
    setVisible(false)
    setTimeout(() => setLoading(false), 1000)
  }

  const searchText = data => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1000)
  }

  const EditRow = data => {
    console.log('Ver detalle', data)
    setLoading(false)
    setVisible(true)
  }

  const DeleteRow = data => {
    setLoading(true)
    console.log('delete method')
    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <>
      <ShippingNoteTable
        dataSource={dataSource}
        handlerTextSearch={searchText}
        loading={loading}
        handlerEditRow={EditRow}
        handlerDeleteRow={DeleteRow}
      />
      <LoadMoreButton
        handlerButton={handlerMoreButton}
        moreInfo={existMoreInfo}
      />
      <ShippingNoteDetail
        closable={onClose}
        visible={visible}
        editData={detailData}
        cancelButton={onCancelButton}
        saveButtonEdit={saveButtonEdit}
      />
    </>
  )
}

export default ShippingNote
