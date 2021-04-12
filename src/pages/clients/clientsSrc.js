import api from '../../commons/api'
import { stage } from '../../commons/credentials'

const url = stage.clientsUrl

const getClients = () => api.get(url)
const getClientsFilter = name =>
  api.getParams(name ? `${url}?name=${name}` : url)
const createClient = _users => api.post(url, _users)
const updateClient = _users => api.put(url, _users)
const deleteClient = _users => api.remove(url, _users)

export default {
  getClients,
  createClient,
  updateClient,
  deleteClient,
  getClientsFilter,
}
