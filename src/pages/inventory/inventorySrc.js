import api from '../../commons/api'
import { stage } from '../../commons/credentials'

const urlProduct = stage.productUrl
const urlService = stage.serviceUrl

const getProducts = params => api.get(urlProduct, { ...params })
const getProductsStatus = () => api.get(`${urlProduct}-status`)
const getProductsCategories = () => api.get(`${urlProduct}-categories`)
const getProductsTaxes = () => api.get(`${urlProduct}-taxes`)
const createProduct = _products => api.post(urlProduct, _products)
const updateProduct = _products => api.put(urlProduct, _products)
const deleteProduct = _products => api.remove(urlProduct, _products)

const getServices = params => api.get(urlService, { ...params })
const getServicesStatus = () => api.get(`${urlService}-status`)
const createService = _services => api.post(urlService, _services)
const updateService = _services => api.put(urlService, _services)
const deleteService = _services => api.remove(urlService, _services)

const InventorySrc = {
  getProducts,
  getProductsCategories,
  getProductsStatus,
  getProductsTaxes,
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
