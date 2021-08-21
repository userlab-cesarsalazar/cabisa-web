import React, { useState } from 'react'
import { Spin, Drawer, message } from 'antd'
import SupplierFields from './supplierFields'
import SuppliersSrc from '../suppliersSrc'
import { showErrors } from '../../../utils'

function SuppliersDrawer(props) {
  const [loadingDrawer, setLoadingDrawer] = useState(false)

  const onSaveButton = data => {
    setLoadingDrawer(true)

    SuppliersSrc.updateSupplier(data)
      .then(_ => {
        message.success('Proveedor actualizado exitosamente')
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
      destroyOnClose
    >
      <Spin spinning={loadingDrawer}>
        <SupplierFields
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

export default SuppliersDrawer
