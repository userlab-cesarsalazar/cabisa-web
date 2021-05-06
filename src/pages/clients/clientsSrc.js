import api from '../../commons/api'
import { stage } from '../../commons/credentials'

const url = stage.clientsUrl

const getClients = () => api.get(url)
const getClientsFilter = name =>
  api.getParams(
    name ? `${url}?name=$like:%25${name}%25&nit=$or$like:%25${name}%25` : url
  )
const createClient = _users => api.post(url, _users)
const updateClient = _users => api.put(url, _users)
const deleteClient = _users => api.remove(url, _users)

const ClientsSrc = {
  getClients,
  createClient,
  updateClient,
  deleteClient,
  getClientsFilter,
}

export default ClientsSrc
