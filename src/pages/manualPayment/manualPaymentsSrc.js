import api from '../../commons/api'
import { stage } from '../../commons/credentials'

const urlInvoice = stage.invoiceUrl
const urlPayment = stage.manualPaymentsUrl

const crupdatePayment = data => api.post(urlPayment, data)
const createManualPayment = data => api.post(`${urlPayment}/createManualPayment`, data)
const removeManualPayment = data => api.post(`${urlPayment}/removeManualPayment`, data)
const getPayments = params => api.get(urlPayment, params)
const getPaymentMethods = () => api.get(`${urlInvoice}/payment-methods`)
const getCreditStatusOptions = () => api.get(`${urlInvoice}/credit-status`)

const InventorySrc = {
  crupdatePayment,
  getPayments,
  getPaymentMethods,
  getCreditStatusOptions,
  createManualPayment,
  removeManualPayment
}

export default InventorySrc
