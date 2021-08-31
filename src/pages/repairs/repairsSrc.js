import api from '../../commons/api'
import { stage } from '../../commons/credentials'

const urlRepairs = stage.repairsUrl
const urlProduct = stage.productUrl

const getRepairs = params => api.get(urlRepairs, params)
const getRepairsStatus = () => api.get(`${urlRepairs}-status`)
const createRepair = _users => api.post(urlRepairs, _users)
const updateRepair = _users => api.put(urlRepairs, _users)
const approveRepair = document_id =>
  api.put(`${urlRepairs}/approve`, { document_id })
const cancelRepair = document_id =>
  api.put(`${urlRepairs}/cancel`, { document_id })

const getProductsOptions = params =>
  api.get(`${urlProduct}-options`, { ...params })

const RepairsSrc = {
  getRepairs,
  getRepairsStatus,
  createRepair,
  updateRepair,
  approveRepair,
  cancelRepair,
  getProductsOptions,
}

export default RepairsSrc
