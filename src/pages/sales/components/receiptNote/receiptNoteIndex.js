import React, { useEffect, useState } from 'react'
import SalesView from '../commons/salesView'
import { withRouter } from 'react-router'
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

function ReceiptNote(props) {
  const [dataSourceReceipt, setDataSourceReceipt] = useState([])
  const [dataDetailReceipt, setDataDetailReceipt] = useState([])
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)
  const [existMoreInfo, setExistMoreInfo] = useState(false)

  useEffect(() => {
    console.log('cargando shiping note')
    loadInfo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadInfo = () => {
    setTimeout(() => setLoading(false), 500)
    setTimeout(() => setDataSourceReceipt(dataSource), 500)
  }

  //Sales viewHandlers
  const EditRowReceipt = data => {
    console.log('Edit Row', data)
    setVisible(true)
  }

  const DeleteRowReceipt = data => {
    console.log('Delete Row', data)
  }

  const SearchTextReceipt = data => {
    console.log('search text', data)
  }

  const SaveButtonEditReceipt = (data, id) => {
    console.log('Save Button Edit', data)
    setExistMoreInfo(false)
    setVisible(false)
  }

  const HandlerMoreButtonReceipt = () => {
    console.log('moreInfo')
  }

  const onCancelButtonReceipt = () => {
    console.log('ocultando')
    setVisible(false)
  }

  const NewNote = () => {
    props.history.push('/receiptNoteView')
  }

  return (
    <>
      <SalesView
        dataSource={dataSource}
        loading={loading}
        editRow={EditRowReceipt}
        deleteRow={DeleteRowReceipt}
        searchText={SearchTextReceipt}
        saveButtonEdit={SaveButtonEditReceipt}
        onCancelButton={onCancelButtonReceipt}
        handlerMoreButton={HandlerMoreButtonReceipt}
        visible={visible}
        existsMoreInfo={existMoreInfo}
        detailData={dataDetailReceipt}
        buttonTitle={'Nueva nota de recibo'}
        newNote={NewNote}
      />
    </>
  )
}

export default withRouter(ReceiptNote)
