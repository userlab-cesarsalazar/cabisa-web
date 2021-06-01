import React, { useState, useEffect } from 'react'
import HeaderPage from '../../../../components/HeaderPage'
import { Card, message, Spin } from 'antd'
import ProductFields from './productFields'
import InventoryHistory from '../../components/invetoryHistory'
import InventorySrc from '../../inventorySrc'
import { showErrors } from '../../../../utils'

function ProductView(props) {
  const [viewLoading, setViewLoading] = useState(false)
  const [productStatusList, setProductStatusList] = useState([])
  const [productCategoriesList, setProductCategoriesList] = useState([])
  const [productsTaxesList, setProductsTaxesList] = useState([])

  useEffect(() => {
    setViewLoading(true)

    Promise.all([
      InventorySrc.getProductsStatus(),
      InventorySrc.getProductsCategories(),
      InventorySrc.getProductsTaxes(),
    ])
      .then(result => {
        setProductStatusList(result[0])
        setProductCategoriesList(result[1])
        setProductsTaxesList(result[2])
      })
      .catch(err => {
        console.log('ERROR ON GET INVENTORY PRODUCTS', err)
        message.warning('No se ha podido obtener informacion del inventario.')
      })
      .finally(setViewLoading(false))
  }, [])

  const saveData = data => {
    setViewLoading(true)

    InventorySrc.createProduct(data)
      .then(_ => {
        message.success('Elemento creado.')
        props.history.push('/inventoryProducts')
      })
      .catch(err => showErrors(err))
      .finally(setViewLoading(false))
  }

  return (
    <Spin spinning={viewLoading}>
      <HeaderPage title={'Crear Producto'} permissions={5} />
      <Card className={'card-border-radius margin-top-15'}>
        <ProductFields
          warehouse={props.location.pathname.includes('warehouse')}
          saveUserData={saveData}
          visible={true}
          edit={false}
          data={props.editData}
          cancelButton={props.cancelButton}
          productStatusList={productStatusList}
          productCategoriesList={productCategoriesList}
          productsTaxesList={productsTaxesList}
        />
        <InventoryHistory dataDetail={[]} />
      </Card>
    </Spin>
  )
}
export default ProductView
