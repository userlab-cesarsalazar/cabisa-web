import api from '../../commons/api'
import { stage } from '../../commons/credentials'

const urlProduct = stage.productUrl
const urlPurchase = stage.purchaseUrl
const urlStakeholder = stage.stakeholderUrl

const getPurchases = params => api.get(urlPurchase, { ...params })
const createPurchase = data => api.post(urlPurchase, data)
const cancelPurchase = data => api.put(`${urlPurchase}/cancel`, data)

const getProducts = params => api.get(urlProduct, { ...params })
const getProductsStatus = () => api.get(`${urlProduct}-status`)
const getProductsCategories = () => api.get(`${urlProduct}-categories`)
const getProductsTaxes = () => api.get(`${urlProduct}-taxes`)
const getProductsOptions = params =>
  api.get(`${urlProduct}-options`, { ...params })
const getStakeholdersOptions = params =>
  api.get(`${urlStakeholder}-options`, { ...params })
const createProduct = _products => api.post(urlProduct, _products)
const updateProduct = _products => api.put(urlProduct, _products)
const deleteProduct = _products => api.remove(urlProduct, _products)

const InventorySrc = {
  getPurchases,
  createPurchase,
  cancelPurchase,
  getProducts,
  getProductsCategories,
  getProductsStatus,
  getProductsTaxes,
  getProductsOptions,
  getStakeholdersOptions,
  createProduct,
  updateProduct,
  deleteProduct,
}

export default InventorySrc
