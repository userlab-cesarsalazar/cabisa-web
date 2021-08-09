import api from '../../commons/api'
import { stage } from '../../commons/credentials'
import { stakeholdersTypes } from '../../commons/types'

const urlProduct = stage.productUrl
const urlInvoice = stage.invoiceUrl
const urlStakeholder = stage.stakeholderUrl

const getInvoices = params => api.get(urlInvoice, { ...params })
const getPaymentMethods = () => api.get(`${urlInvoice}/payment-methods`)
const getServiceTypes = () => api.get(`${urlInvoice}/service-types`)
const getCreditDays = () => api.get(`${urlInvoice}/credit-days`)
const createInvoice = data => api.post(urlInvoice, data)
const cancelInvoice = data => api.put(`${urlInvoice}/cancel`, data)
const updateCreditStatus = data => api.put(`${urlInvoice}/credit-status`, data)

const getProductsOptions = params =>
  api.get(`${urlProduct}-options`, { ...params })
const getStakeholdersOptions = params =>
  api.get(`${urlStakeholder}-options`, {
    ...params,
    stakeholder_type: { $ne: stakeholdersTypes.PROVIDER },
  })
const getProjectsOptions = params =>
  api.get(`${urlStakeholder}/projects-options`, params)
const getStakeholderTypes = () => api.get(`${urlStakeholder}/types`)
const getCreditStatusOptions = () => api.get(`${urlInvoice}/credit-status`)

const InventorySrc = {
  getCreditDays,
  getCreditStatusOptions,
  getInvoices,
  getPaymentMethods,
  createInvoice,
  cancelInvoice,
  getProductsOptions,
  getProjectsOptions,
  getServiceTypes,
  getStakeholdersOptions,
  getStakeholderTypes,
  updateCreditStatus,
}

export default InventorySrc
