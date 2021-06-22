import React, { useState } from 'react'
import { Spin, Drawer, message } from 'antd'
import ClientFields from './clientFields'
import ClientsSrc from '../clientsSrc'
import { showErrors } from '../../../utils'

function ClientsDrawer(props) {
  const [loadingDrawer, setLoadingDrawer] = useState(false)

  const onSaveButton = data => {
    setLoadingDrawer(true)

    ClientsSrc.updateClient(data)
      .then(_ => {
        message.success('Cliente actualizado exitosamente')
        props.loadData()
      })
      .catch(error => showErrors(error))
      .finally(() => setLoadingDrawer(false))
  }

  return (
    <Drawer
      placement='right'
      closable={false}
      onClose={props.closable}
      visible={props.visible}
      width='70%'
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
