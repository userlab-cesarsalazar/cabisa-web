import React from 'react'
import HeaderPage from '../../components/HeaderPage'
import { Card } from 'antd'
import InventoryFields from './components/inventoryFields'

function InventoryView(props) {
  const saveData = (method, data, user_id) => {
    console.log('Save new Item')
    console.log('data', data)
    console.log('method', method)
    console.log('user_id', user_id)
  }

  return (
    <>
      <HeaderPage titleButton={'Nuevo Item'} title={'Crear Item'} />
      <Card className={'card-border-radius margin-top-15'}>
        <InventoryFields
          saveUserData={saveData}
          visible={true}
          edit={false}
          data={props.editData}
          cancelButton={props.cancelButton}
        />
      </Card>
    </>
  )
}
export default InventoryView
