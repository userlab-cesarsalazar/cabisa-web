import React, { useState } from 'react'
import HeaderPage from '../../components/HeaderPage'
import { Card, message, Spin } from 'antd'
import RepairsFields from './components/repairsFields'
import RepairsSrc from './repairsSrc'
import { showErrors } from '../../utils'
import { permissions } from '../../commons/types'

function RepairsView(props) {
  const [loading, setLoading] = useState(false)

  const saveData = data => {
    setLoading(true)

    RepairsSrc.createRepair(data)
      .then(() => {
        message.success('Orden de Reparacion creado exitosamente')
        props.history.push('/repairs')
      })
      .catch(error => {
        showErrors(error)
      })
      .finally(() => setLoading(false))
  }

  return (
    <Spin spinning={loading}>
      <HeaderPage
        title={'Crear Orden de Reparacion'}
        permissions={permissions.REPARACIONES}
      />
      <Card className={'card-border-radius margin-top-15'}>
        <RepairsFields
          saveData={saveData}
          visible={true}
          edit={false}
          data={props.editData}
          cancelButton={props.cancelButton}
          loading={loading}
          setLoading={setLoading}
        />
      </Card>
    </Spin>
  )
}

export default RepairsView
