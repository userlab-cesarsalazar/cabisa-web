import React, { useEffect, useState } from 'react'
import HeaderPage from '../../components/HeaderPage'
import ClientTable from './components/clientTable'
import ClientsDrawer from '../clients/components/clientsDrawer'
import LoadMoreButton from '../../components/LoadMoreButton'

function Clients() {
  const [visible, setVisible] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editDataDrawer, setEditDataDrawer] = useState(null)
  const [dataSource, setDataSource] = useState([])
  const [existMoreInfo, setExistMoreInfo] = useState(false)
  const [loading, setLoading] = useState(false)

  const dataDummy = {
      "data":{
          "current_page":1,
          "data":[
              {
                  "id":1,
                  "name":"Pedro Ju\u00e1rez",
                  "type":"INDIVIDUAL",
                  "nit":"526398",
                  "address":"Direcci\u00f3n de prueba",
                  "sales":"Cesar Salazar",
                  "shops":"Luis de leon",
                  "email":"test@cabisa.com",
                  "phone":"22229998"
              },
              {
                  "id":2,
                  "name":"Company",
                  "type":"CORPORATION",
                  "nit":"45128965",
                  "address":"4-58 Calle Esperanza , zona 11",
                  "email":"test@cabisa.com",
                  "phone":"22229998"
              },
              {
                  "id":3,
                  "name":"Test",
                  "type":"CORPORATION",
                  "country_id":1,
                  "nit":"121212",
                  "uuid":"4ee8c9ee-cbee-4222-a14d-3665e78f5e01",
                  "address":"Ciudad",
                  "sales":"Cesar Salazar",
                  "shops":"Luis de leon",
                  "email":"test@cabisa.com",
                  "phone":"22229998"
              },
              {
                  "id":4,
                  "name":"Pablo Henrique",
                  "type":"INDIVIDUAL",
                  "country_id":1,
                  "nit":"5222362",
                  "uuid":"40fa3855-c3eb-44af-b850-f2b5d8d07cea",
                  "address":"zona 11 ciudad",
                  "sales":"Cesar Salazar",
                  "shops":"Luis de leon",
                  "email":"test@cabisa.com",
                  "phone":"22229998"
              }
          ]
      }
  }

  const showDrawer = () => {
    setVisible(true)
    setEditMode(false)
  }
  const onClose = () => {
    setVisible(false)
  }

  useEffect(() => {
    setVisible(false)
    setLoading(false)
      loadData()
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadData = () => {
    setVisible(false)
    setLoading(false)
      setDataSource(setClientData(dataDummy.data.data))
  }

  const handlerMoreButton = () => {
    if (existMoreInfo) {
      setLoading(true)
    }
  }

  const searchTextFinder = data => {
      setLoading(true)
      setTimeout(()=>setLoading(false),1000);
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
    setVisible(true)
    setEditMode(true)
  }

  const DeleteRow = data => {
    setLoading(true)
      setTimeout(()=>setLoading(false),1000);
  }

  const onSaveButton = (method, data, dataId) => {
    setExistMoreInfo(false)
    setLoading(true)
    setVisible(false)
      setTimeout(()=>setLoading(false),1000);
  }

  return (
    <>
      <HeaderPage titleButton={'Nuevo Cliente'} title={'Clientes'} showDrawer={showDrawer} permissions={6} />
      <ClientTable
        dataSource={dataSource}
        loading={loading}
        handlerTextSearch={searchTextFinder}
        handlerEditRow={EditRow}
        handlerDeleteRow={DeleteRow}
      />
      <LoadMoreButton handlerButton={handlerMoreButton} moreInfo={existMoreInfo} />
      <ClientsDrawer
        closable={onClose}
        visible={visible}
        edit={editMode}
        editData={editDataDrawer}
        cancelButton={onClose}
        saveButton={onSaveButton}
      />
    </>
  )
}

export default Clients
