import React, { useState } from 'react'
import { Spin, Drawer, message } from 'antd'
import ClientFields from './clientFields'
import ClientsSrc from '../clientsSrc'
import { catchingErrors } from '../../../utils/Utils'

function ClientsDrawer(props) {
  const [loadingDrawer, setLoadingDrawer] = useState(false)

  const onSaveButton = (method, data, id) => {
    setLoadingDrawer(true)
    data.id = id
    ClientsSrc.updateClient(data)
      .then(_ => {
        setLoadingDrawer(false)
        message.success('Informacion actualizada.')
        props.saveButton()
      })
      .catch(err => {
        setLoadingDrawer(false)
        console.log('ERROR ON UPDATE CLIENT', err)
        message.warning(catchingErrors(err))
      })
  }

  return (
    <Drawer
      placement='right'
      closable={false}
      onClose={props.closable}
      visible={props.visible}
      width={800}
    >
      <Spin spinning={loadingDrawer}>
        <ClientFields
          saveUserData={onSaveButton}
          visible={props.visible}
          edit={props.edit}
          editData={props.editData}
          cancelButton={props.cancelButton}
        />
      </Spin>
    </Drawer>
  )
}

export default ClientsDrawer
