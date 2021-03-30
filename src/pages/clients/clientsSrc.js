import api from '../../commons/api'
import { stage } from '../../commons/credentials'

const url = stage.clientsUrl

const getUsers = () => api.get(url)
const createUser = _users => api.post(url, _users)
const updateClient = _users => api.put(url, _users)
const deleteClient = _users => api.remove(url, _users)

export default {
  getUsers,
  createUser,
  updateClient,
  deleteClient,
}
