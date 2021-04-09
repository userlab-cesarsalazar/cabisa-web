import React, { useEffect, useState } from 'react'
import ServiceView from '../commons/serviceView'

import { withRouter } from 'react-router'
const _dataSource = [
  {
    id: 1,
    _ticketId: '001831',
    _enterprise: 'Empresas Ejemplo servicio',
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
]
const _detailData = []

function ServiceNote(props) {
  const [dataSource, setDataSource] = useState([])
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)
  const [existMoreInfo, setExistMoreInfo] = useState(false)

  useEffect(() => {
    loadInfo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadInfo = () => {
    setTimeout(() => setLoading(false), 500)
    setTimeout(() => setDataSource(_dataSource), 500)
  }

  //Sales viewHandlers
  const EditRow = data => {
    console.log('Edit Row', data)
    setVisible(true)
  }

  const DeleteRow = data => {
    console.log('Delete Row', data)
  }

  const SearchText = data => {
    console.log('search text', data)
  }

  const SaveButtonEdit = (data, id) => {
    console.log('Save Button Edit', data)
    setExistMoreInfo(false)
    setVisible(false)
  }

  const HandlerMoreButton = () => {
    console.log('moreInfo')
  }

  const onCancelButton = () => {
    console.log('ocultando')
    setVisible(false)
  }

  const NewNoteShipping = () => {
    props.history.push('/serviceNoteView')
  }

  return (
    <>
      <ServiceView
        dataSource={dataSource}
        loading={loading}
        editRow={EditRow}
        deleteRow={DeleteRow}
        searchText={SearchText}
        saveButtonEdit={SaveButtonEdit}
        onCancelButton={onCancelButton}
        handlerMoreButton={HandlerMoreButton}
        visible={visible}
        existsMoreInfo={existMoreInfo}
        detailData={_detailData}
        buttonTitle={'Nueva nota de servicio'}
        permissions={6}
        newNote={NewNoteShipping}
      />
    </>
  )
}

export default withRouter(ServiceNote)
