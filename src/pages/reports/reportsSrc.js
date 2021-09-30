import api from '../../commons/api'
import { stage } from '../../commons/credentials'
import { stakeholdersStatus, stakeholdersTypes } from '../../commons/types'

const urlStakeholder = stage.stakeholderUrl
const urlReport = stage.reportUrl
const urlInvoice = stage.invoiceUrl
const urlProduct = stage.productUrl

const getSales = params => api.get(`${urlReport}/sales`, params)
const getInventory = params => api.get(`${urlReport}/inventory`, params)
const getAccountsReceivable = params =>
  api.get(`${urlReport}/accounts-receivable`, params)
const getCreditStatusOptions = () => api.get(`${urlInvoice}/credit-status`)
const getStakeholderTypes = () => api.get(`${urlStakeholder}/types`)
const getPaymentMethods = () => api.get(`${urlInvoice}/payment-methods`)
const getClients = params =>
  api.get(urlStakeholder, {
    ...params,
    stakeholder_type: params.stakeholder_type
      ? params.stakeholder_type
      : { $ne: stakeholdersTypes.PROVIDER },
    status: stakeholdersStatus.ACTIVE,
  })
const getClientTypes = () => api.get(`${urlStakeholder}/types`)
const getProductsCategories = () => api.get(`${urlProduct}-categories`)

const ReportsSrc = {
  getSales,
  getInventory,
  getAccountsReceivable,
  getClients,
  getClientTypes,
  getCreditStatusOptions,
  getStakeholderTypes,
  getPaymentMethods,
  getProductsCategories,
}

export default ReportsSrc
