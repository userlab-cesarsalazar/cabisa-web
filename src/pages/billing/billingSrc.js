import api from '../../commons/api'
import { stage } from '../../commons/credentials'
import { stakeholdersTypes } from '../../commons/types'

const urlProduct = stage.productUrl
const urlInvoice = stage.invoiceUrl
const urlStakeholder = stage.stakeholderUrl
const urlProject = stage.projectUrl

const getInvoices = params => api.get(urlInvoice, { ...params })
const getPaymentMethods = () => api.get(`${urlInvoice}/payment-methods`)
const createInvoice = data => api.post(urlInvoice, data)
const cancelInvoice = data => api.put(`${urlInvoice}/cancel`, data)

const getProductsOptions = params =>
  api.get(`${urlProduct}-options`, { ...params })
const getStakeholdersOptions = params =>
  api.get(`${urlStakeholder}-options`, {
    ...params,
    stakeholder_type: { $ne: stakeholdersTypes.PROVIDER },
  })
const getProjectsOptions = params =>
  api.get(`${urlProject}-options`, { ...params })
const getStakeholderTypes = () => api.get(`${urlStakeholder}/types`)

const InventorySrc = {
  getInvoices,
  getPaymentMethods,
  createInvoice,
  cancelInvoice,
  getProductsOptions,
  getProjectsOptions,
  getStakeholdersOptions,
  getStakeholderTypes,
}

export default InventorySrc
