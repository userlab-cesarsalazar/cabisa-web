import api from '../../commons/api'
import { stage } from '../../commons/credentials'

const urlProduct = stage.productUrl
const urlInvoice = stage.invoiceUrl
const urlStakeholder = stage.stakeholderUrl
const urlProject = stage.projectUrl

const getInvoices = params => api.get(urlInvoice, { ...params })
const getPaymentMethods = () => api.get(`${urlInvoice}/payment-methods`)
const createInvoice = data => api.post(urlInvoice, data)
const cancelInvoice = data => api.put(`${urlInvoice}/cancel`, data)
const getInvoiceStatus = () => api.get(`${urlInvoice}-status`)

const getProductsOptions = params =>
  api.get(`${urlProduct}-options`, { ...params })
const getStakeholdersOptions = params =>
  api.get(`${urlStakeholder}-options`, { ...params })
const getProjectsOptions = params =>
  api.get(`${urlProject}-options`, { ...params })
const getStakeholderTypes = () => api.get(`${urlStakeholder}/types`)

const InventorySrc = {
  getInvoices,
  getPaymentMethods,
  createInvoice,
  cancelInvoice,
  getInvoiceStatus,
  getProductsOptions,
  getProjectsOptions,
  getStakeholdersOptions,
  getStakeholderTypes,
}

export default InventorySrc
