import React, { useState } from 'react'
import { Spin, Drawer, message } from 'antd'
import RepairsFields from './repairsFields'
import RepairsSrc from '../repairsSrc'
import { showErrors } from '../../../utils'

function RepairsDrawer(props) {
  const [loadingDrawer, setLoadingDrawer] = useState(false)

  const onSaveButton = data => {
    setLoadingDrawer(true)

    RepairsSrc.updateRepair(data)
      .then(_ => {
        message.success('Orden de Reparacion actualizada exitosamente')
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
      width='80%'
      destroyOnClose
    >
      <Spin spinning={loadingDrawer}>
        <RepairsFields
          saveData={onSaveButton}
          visible={props.visible}
          isEditing={true}
          editData={props.editData}
          cancelButton={props.cancelButton}
          loading={loadingDrawer}
          setLoading={setLoadingDrawer}
        />
      </Spin>
    </Drawer>
  )
}

export default RepairsDrawer
