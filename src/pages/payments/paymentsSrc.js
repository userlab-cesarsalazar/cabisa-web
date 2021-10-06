import api from '../../commons/api'
import { stage } from '../../commons/credentials'

const urlInvoice = stage.invoiceUrl
const urlPayment = stage.paymentsUrl

const createPayment = data => api.post(urlPayment, data)
const deletePayment = data => api.remove(urlPayment, data)
const getPayments = params => api.get(urlPayment, params)
const getPaymentMethods = () => api.get(`${urlInvoice}/payment-methods`)
const getCreditStatusOptions = () => api.get(`${urlInvoice}/credit-status`)

const InventorySrc = {
  createPayment,
  deletePayment,
  getPayments,
  getPaymentMethods,
  getCreditStatusOptions,
}

export default InventorySrc
