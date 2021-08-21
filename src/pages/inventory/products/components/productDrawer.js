import React, { useState } from 'react'
import { Drawer, message, Spin } from 'antd'
import ProductFields from './productFields'
import InventoryHistory from '../../components/invetoryHistory'
import InventorySrc from '../../inventorySrc'
import { showErrors } from '../../../../utils'

function ProductDrawer(props) {
  const [loadingDrawer, setLoadingDrawer] = useState(false)

  const onSaveBtn = data => {
    setLoadingDrawer(true)

    InventorySrc.updateProduct(data)
      .then(_ => {
        message.success('Elemento actualizado.')
        props.closeAfterSave()
      })
      .catch(err => showErrors(err))
      .finally(() => setLoadingDrawer(false))
  }

  return (
    <Drawer
      placement='right'
      closable={false}
      onClose={props.closable}
      visible={props.visible}
      width={800}
      destroyOnClose
    >
      <Spin spinning={loadingDrawer}>
        <ProductFields
          isAdmin={props.isAdmin}
          saveUserData={onSaveBtn}
          visible={props.visible}
          edit={props.edit}
          editData={props.editData}
          cancelButton={props.cancelButton}
          productStatusList={props.productStatusList}
          productCategoriesList={props.productCategoriesList}
          productsTaxesList={props.productsTaxesList}
        />
        <InventoryHistory dataDetail={props.editData} />
      </Spin>
    </Drawer>
  )
}

export default ProductDrawer
