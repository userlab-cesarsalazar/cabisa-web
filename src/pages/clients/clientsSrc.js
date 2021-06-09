import api from '../../commons/api'
import { stage } from '../../commons/credentials'

const url = stage.clientsUrl

const getClients = () => api.get(url)
const getClientsFilter = name =>
  api.get(url, {
    name: { $like: `${name}%` },
    nit: { $or: true, $like: `${name}%` },
  })
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
