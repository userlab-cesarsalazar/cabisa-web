import React, { useState } from 'react'
import HeaderPage from '../../components/HeaderPage'
import { Card, message, Spin } from 'antd'
import SupplierFields from './components/supplierFields'
import SuppliersSrc from './suppliersSrc'
import { showErrors } from '../../utils'
import { permissions } from '../../commons/types'

function SupplierView(props) {
  const [viewLoading, setViewLoading] = useState(false)

  const saveData = data => {
    setViewLoading(true)

    SuppliersSrc.createSupplier(data)
      .then(() => {
        message.success('Proveedor creado')
        props.history.push('/suppliers')
      })
      .catch(error => {
        showErrors(error)
      })
      .finally(() => setViewLoading(false))
  }

  return (
    <Spin spinning={viewLoading}>
      <HeaderPage
        title={'Crear Proveedor'}
        permissions={permissions.PROVEEDORES}
      />
      <Card className={'card-border-radius margin-top-15'}>
        <SupplierFields
          saveUserData={saveData}
          visible={true}
          edit={false}
          data={props.editData}
          cancelButton={props.cancelButton}
        />
      </Card>
    </Spin>
  )
}

export default SupplierView
