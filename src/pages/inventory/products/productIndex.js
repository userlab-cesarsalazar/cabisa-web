import React, { useEffect, useState, useCallback } from 'react'
import HeaderPage from '../../../components/HeaderPage'
import InventoryProduct from './components/inventoryProduct'
import InventorySrc from '../inventorySrc'
import { message } from 'antd'
import { showErrors } from '../../../utils'

function ProductIndex() {
  const [inventoryProducts, setInventoryProducts] = useState([])
  const [productCategoriesList, setProductCategoriesList] = useState([])
  const [productStatusList, setProductStatusList] = useState([])
  const [productsTaxesList, setProductsTaxesList] = useState([])
  const [searchText, setSearchText] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [loading, setLoading] = useState(false)

  const getProducts = useCallback(() => {
    setLoading(true)

    InventorySrc.getProducts({
      description: { $like: `%25${searchText}%25` },
      product_category: categoryFilter,
    })
      .then(result => setInventoryProducts(result))
      .catch(err => {
        console.log('ERROR ON GET INVENTORY PRODUCTS', err)
        message.warning('No se ha podido obtener informacion del inventario.')
      })
      .finally(() => setLoading(false))
  }, [searchText, categoryFilter])

  useEffect(() => {
    getProducts()
  }, [getProducts])

  useEffect(() => {
    setLoading(true)

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
      .finally(() => setLoading(false))
  }, [])

  const searchByTxt = description => setSearchText(description)

  const searchByCategory = data => setCategoryFilter(data)

  const clearSearch = () => {
    if (searchText === '' && categoryFilter === '') getProducts()
    else {
      setSearchText('')
      setCategoryFilter('')
    }
  }

  const deleteProduct = data => {
    setLoading(true)

    InventorySrc.deleteProduct(data)
      .then(_ => {
        message.success('Elemento eliminado')
        clearSearch()
      })
      .catch(err => showErrors(err))
      .finally(() => setLoading(false))
  }

  return (
    <>
      <HeaderPage titleButton={''} title={'Productos'} permissions={5} />
      <InventoryProduct
        title={'Productos'}
        searchByCategory={searchByCategory}
        searchByTxt={searchByTxt}
        dataSource={inventoryProducts}
        closeAfterSaveWareHouse={clearSearch}
        deleteItemWareHouse={deleteProduct}
        loading={loading}
        productStatusList={productStatusList}
        productCategoriesList={productCategoriesList}
        productsTaxesList={productsTaxesList}
      />
    </>
  )
}

export default ProductIndex
