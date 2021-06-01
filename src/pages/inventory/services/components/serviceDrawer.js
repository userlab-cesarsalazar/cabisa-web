import React, { useState } from 'react'
import { Drawer, message, Spin } from 'antd'
import ServiceFields from './serviceFields'
import InventorySrc from '../../inventorySrc'
import { showErrors } from '../../../../utils'

function ServiceDrawer(props) {
  const [loadingDrawer, setLoadingDrawer] = useState(false)

  const onSaveBtn = data => {
    setLoadingDrawer(true)

    InventorySrc.updateService(data)
      .then(_ => {
        message.success('Elemento actualizado.')
        props.closeAfterSave()
      })
      .catch(err => showErrors(err))
      .finally(setLoadingDrawer(false))
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
        <ServiceFields
          saveUserData={onSaveBtn}
          visible={props.visible}
          edit={props.edit}
          editData={props.editData}
          cancelButton={props.cancelButton}
          serviceStatusList={props.serviceStatusList}
        />
      </Spin>
    </Drawer>
  )
}

export default ServiceDrawer
