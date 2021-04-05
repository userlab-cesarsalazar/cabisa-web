import api from '../../commons/api'
import { stage } from '../../commons/credentials'

const urlUser = stage.inventoryUrl

const getProducts = () => api.get(urlUser)
const createProduct = _products => api.post(urlUser, _products)
const updateProduct = _products => api.put(urlUser, _products)
const deleteProduct = _products => api.remove(urlUser, _products)

export default {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
}
