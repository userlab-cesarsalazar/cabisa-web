//libraries
import React, { useEffect, useState } from 'react'
import { message } from 'antd'
import UsersSrc from './usersSrc'
//components
import UserTable from '../users/components/userTable'
import HeaderPage from '../../components/HeaderPage'
import UserDrawer from './components/userDrawer'
import UserPermissions from './components/userPermissions'
import { withRouter } from 'react-router'

function Users(props) {
  const [dataSource, setDataSource] = useState([])
  const [dataPermissions, setDataPermissions] = useState([])
  const [visible, setVisible] = useState(false)
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
    UsersSrc.getUsers()
      .then(data => {
        setLoading(false)
        setDataSource(data.message)
      })
      .catch(err => {
        console.log('ERROR GET USERS', err)
        message.error('No se pudo obtener la informacion.')
      })
  }

  const EditRow = data => {
    setLoading(true)
    setEditMode(true)
    setVisible(true)
    setLoading(false)
    setEditDataDrawer(data)
    console.log('edita data drawer', data)
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

  const DeleteRow = data => {
    setLoading(true)
    UsersSrc.deleteUser({ id: data.id })
      .then(_ => {
        message.success('Usuario eliminado')
        loadUserData()
      })
      .catch(err => {
        setLoading(false)
        console.log('ERROR ON DELETE USER', err)
        message.warning('No se ha podido borrar el usuario')
      })
  }

  const editPermissions = data => {
    setUserId(data.id)
    setDataPermissions(data)
    setShowPermissions(true)
  }

  const saveInformation = data => {
    console.log('SAVE INFORMATION')
    setVisible(false)
    setShowPermissions(false)
    console.log(data)
    UsersSrc.updateUser(data)
      .then(_ => {
        message.success('Informacion actualizada')
        loadUserData()
      })
      .catch(err => {
        console.log('ERROR ON UPDATE PERMISSIONS', err)
        message.warning('No se ha podido actualizar la informacion')
      })
  }

  return (
    <div>
      <HeaderPage
        titleButton={'Nuevo usuario'}
        title={'Usuarios'}
        showDrawer={showDrawer}
        permissions={2}
      />
      <UserTable
        dataSource={dataSource}
        handlerTextSearch={searchText}
        loading={loading}
        handlerEditRow={EditRow}
        handlerDeleteRow={DeleteRow}
        handlerEditPermissions={editPermissions}
      />

      <UserDrawer
        closable={onClose}
        visible={visible}
        edit={editMode}
        editData={editDataDrawer}
        cancelButton={onCancelButton}
        saveButtonEdit={saveInformation}
      />
      <UserPermissions
        closable={() => {
          setShowPermissions(false)
        }}
        visible={showPermissions}
        userId={userId}
        permissionsData={dataPermissions}
        savePermissions={saveInformation}
      />
    </div>
  )
}
export default withRouter(Users)
