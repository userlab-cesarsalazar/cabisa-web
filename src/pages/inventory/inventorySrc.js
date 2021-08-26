import api from '../../commons/api'
import { stage } from '../../commons/credentials'
import { productsTypes } from '../../commons/types'

const urlProduct = stage.productUrl
const urlPurchase = stage.purchaseUrl
const urlService = stage.serviceUrl
const urlStakeholder = stage.stakeholderUrl

const getPurchases = params => api.get(urlPurchase, { ...params })
const createPurchase = data => api.post(urlPurchase, data)
const updatePurchase = data => api.put(urlPurchase, data)
const cancelPurchase = data => api.put(`${urlPurchase}/cancel`, data)

const getProducts = params =>
  api.get(urlProduct, { ...params, product_type: productsTypes.PRODUCT })
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

const getServices = params => api.get(urlService, params)
const getServicesStatus = () => api.get(`${urlService}-status`)
const createService = _services => api.post(urlService, _services)
const updateService = _services => api.put(urlService, _services)
const deleteService = _services => api.remove(urlService, _services)

const InventorySrc = {
  getPurchases,
  createPurchase,
  updatePurchase,
  cancelPurchase,
  getProducts,
  getProductsCategories,
  getProductsOptions,
  getProductsStatus,
  getProductsTaxes,
  getStakeholdersOptions,
  createProduct,
  updateProduct,
  deleteProduct,
  getServices,
  getServicesStatus,
  createService,
  updateService,
  deleteService,
}

export default InventorySrc
