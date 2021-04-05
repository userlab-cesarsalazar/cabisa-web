import api from '../../commons/api'
import { stage } from '../../commons/credentials'

const urlUser = stage.inventoryUrl

const getProducts = () => api.get(urlUser)
const createProduct = _users => api.post(urlUser, _users)
const updateProduct = _users => api.put(urlUser, _users)
const deleteProduct = _users => api.remove(urlUser, _users)

export default {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
}
