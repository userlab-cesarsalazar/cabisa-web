import api from '../../commons/api'
import { stage } from '../../commons/credentials'

const urlSale = stage.saleUrl
const urlProject = stage.projectUrl
const urlProduct = stage.productUrl
const urlStakeholder = stage.stakeholderUrl

const getProjects = params => api.get(urlProject, { ...params })
const getProjectsStatus = () => api.get(`${urlProject}-status`)
const getProjectsOptions = params =>
  api.get(`${urlProject}-options`, { ...params })
const getProductsOptions = params =>
  api.get(`${urlProduct}-options`, { ...params })
const getStakeholdersOptions = params =>
  api.get(`${urlStakeholder}-options`, { ...params })
const getSales = params => api.get(urlSale, { ...params })
const getSalesStatus = () => api.get(`${urlSale}-status`)
const approveSale = data => api.post(`${urlSale}/invoice`, data)
const createSale = data => api.post(urlSale, data)
const cancelSale = data => api.put(`${urlSale}/cancel`, data)
const updateSale = data => api.put(urlSale, data)

const InventorySrc = {
  getProjects,
  getProjectsStatus,
  getProjectsOptions,
  getProductsOptions,
  getStakeholdersOptions,
  getSales,
  getSalesStatus,
  approveSale,
  createSale,
  cancelSale,
  updateSale,
}

export default InventorySrc
