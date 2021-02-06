//libraries
import React, { useEffect, useState } from 'react'
import { message } from 'antd'

//components
import UserTable from '../users/components/userTable'
import HeaderPage from '../../components/HeaderPage'
import UserDrawer from './components/userDrawer'
import LoadMoreButton from '../../components/LoadMoreButton'
import UserPermissions from './components/userPermissions'
import { withRouter } from 'react-router'

const dataDummy = [
  {
    id: 1,
    name: 'luis de leon',
    email: 'luis.deleon@userlab.co',
    phone: 55459429,
    rolName: 'Gerencia',
    rolId: [1],
  },
  {
    id: 2,
    name: 'luis de leon R',
    email: 'luis.deleon@userlab.co',
    phone: 55459429,
    rolName: 'Administrador',
    rolId: [2],
  },
]

function Users(props) {
  const [dataSource, setDataSource] = useState([])
  const [visible, setVisible] = useState(false)
  const [existMoreInfo, setExistMoreInfo] = useState(false)
  const [showPermissions, setShowPermissions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState(0)

  const [editMode, setEditMode] = useState(false)
  const [editDataDrawer, setEditDataDrawer] = useState(null)

  useEffect(() => {
    loadUserData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadUserData = () => {
    setLoading(true)
    setVisible(false)
    setTimeout(() => setLoading(false), 500)
    setTimeout(() => setDataSource(getUsers(dataDummy)), 500)
  }

  const EditRow = data => {
    setLoading(true)
    setEditMode(true)
    setVisible(true)
    setLoading(false)
    setEditDataDrawer(data)
  }

  const getUsers = (users, edit = false) => {
    if (users !== 'Too Many Attempts.') {
      let _users = users
      return _users.map((d, i) => ({
        key: i,
        _id: d.id,
        _name: d.name,
        _email: d.email,
        _phone: d.phone,
        _rolName: d.rolName,
        _rolId: d.rolId,
      }))
    } else {
      message.error(
        'Se excedio el limite de peticiones, espera y recarga la aplicacion'
      )
    }
  }

  const handlerMoreButton = () => {
    setExistMoreInfo(false)
    if (existMoreInfo) {
      setLoading(true)
    }
  }

  const searchText = data => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1000)
  }

  const showDrawer = () => {
    props.history.push('/userView')
  }

  const onClose = () => {
    setVisible(false)
  }

  const onCancelButton = () => {
    console.log('ocultando')
    setVisible(false)
  }

  const saveButtonEdit = (data, user_id, method) => {
    console.log('Save index')
    console.log('data', data)
    console.log('user_id', user_id)
    console.log('method', method)
    setExistMoreInfo(false)
    setLoading(true)
    setVisible(false)
    setTimeout(() => setLoading(false), 1000)
  }

  const DeleteRow = data => {
    setLoading(true)
    console.log('delete method')
    setTimeout(() => setLoading(false), 1000)
  }

  const editPermissions = data => {
    setUserId(data._id)
    setShowPermissions(true)
  }

  return (
    <div>
      <HeaderPage
        titleButton={'Nuevo usuario'}
        title={'Usuarios'}
        showDrawer={showDrawer}
        permissions={6}
      />
      <UserTable
        dataSource={dataSource}
        handlerTextSearch={searchText}
        loading={loading}
        handlerEditRow={EditRow}
        handlerDeleteRow={DeleteRow}
        handlerEditPermissions={editPermissions}
      />
      <LoadMoreButton
        handlerButton={handlerMoreButton}
        moreInfo={existMoreInfo}
      />
      <UserDrawer
        closable={onClose}
        visible={visible}
        edit={editMode}
        editData={editDataDrawer}
        cancelButton={onCancelButton}
        saveButtonEdit={saveButtonEdit}
      />
      <UserPermissions
        closable={() => {
          setShowPermissions(false)
        }}
        visible={showPermissions}
        userId={userId}
      />
    </div>
  )
}
export default withRouter(Users)
