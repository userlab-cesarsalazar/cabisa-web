import React, { useEffect, useState } from 'react'
import HeaderPage from '../../../components/HeaderPage'
import InventoryProduct from './components/inventoryProduct'
import InventorySrc from '../inventorySrc'
import { message } from 'antd'

function ProductIndex() {
  const [inventoryProducts, setInventoryProducts] = useState([])

  useEffect(() => {
    getProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getProducts = () => {
    //GET ALL PRODUCTOS
    InventorySrc.getProducts()
      .then(result => {
        setInventoryProducts(
          result.message.filter(data => data.category_id === 2)
        )
      })
      .catch(err => {
        console.log('ERROR ON GET INVENTORY PRODUCTS', err)
        message.warning('No se ha podido obtener informacion del inventario.')
      })
  }

  const searchByTxt = (name, type) => {
    //GET FILTER PRODUCTOS BY NAME
    InventorySrc.getProductsFilter(name)
      .then(result => {
        setInventoryProducts(
          result.message.filter(data => data.category_id === 2)
        )
      })
      .catch(err => {
        console.log('ERROR ON GET INVENTORY PRODUCTS', err)
        message.warning('No se ha podido obtener informacion del inventario.')
      })
  }

  const searchByCategoryService = data => {
    let categoryServiceId = data === 99 ? false : data
    InventorySrc.getProductsFilterByCategory(categoryServiceId)
      .then(result => {
        setInventoryProducts(
          result.message.filter(data => data.category_id === 2)
        )
      })
      .catch(err => {
        console.log('ERROR ON GET INVENTORY PRODUCTS', err)
        message.warning('No se ha podido obtener informacion del inventario.')
      })
  }

  const deleteProduct = data => {
    InventorySrc.deleteProduct(data)
      .then(_ => {
        message.success('Elemento eliminado')
        getProducts()
      })
      .catch(err => {
        console.log('ERROR ON DELETE ELEMENT', err)
      })
  }

  return (
    <>
      <HeaderPage titleButton={''} title={'Productos'} permissions={5} />
      <InventoryProduct
        title={'Productos'}
        searchByServiceCategory={searchByCategoryService}
        searchWarehouseByTxt={searchByTxt}
        dataSource={inventoryProducts}
        closeAfterSaveWareHouse={getProducts}
        deleteItemWareHouse={deleteProduct}
      />
    </>
  )
}

export default ProductIndex