import React, { useEffect } from 'react'
import HeaderPage from '../../components/HeaderPage'
import {Card, message} from 'antd'
import InventoryFields from './components/inventoryFields'
import InventoryHistory from './components/invetoryHistory'
import InventorySrc from './invetorySrc'

function InventoryView(props) {
  const saveData = (method, data, user_id) => {
    console.log('Save new Item')
      let newDataObj = {
          "name": data.description,
          "category_id": data.category,
          "service_type_id": data.service,
          "code": data.code,
          "serial_number": data.serie,
          "cost": data.price
      }

    InventorySrc.createProduct(newDataObj).then(result=>{


    }).catch(err=>{
        message.warning('No se ha podido guardar la informacion.')
    })


  }

  return (
    <>
      <HeaderPage titleButton={'Nuevo Item'} title={'Crear Item'} />
      <Card className={'card-border-radius margin-top-15'}>
        <InventoryFields
          warehouse={props.location.pathname.includes('warehouse')}
          saveUserData={saveData}
          visible={true}
          edit={false}
          data={props.editData}
          cancelButton={props.cancelButton}
        />
        <InventoryHistory dataDetail={[]} />
      </Card>
    </>
  )
}
export default InventoryView
