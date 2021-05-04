import api from '../../commons/api'
import { stage } from '../../commons/credentials'

const urlUser = stage.usersUrl

const getUsers = () => api.get(urlUser)
const getUsersPermissions = email =>
  api.getParams(email ? `${urlUser}?email=${email}` : urlUser)
const createUser = _users => api.post(urlUser, _users)
const updateUser = _users => api.put(urlUser, _users)
const deleteUser = _users => api.remove(urlUser, _users)
const getUsersByName = name =>
  api.getParams(name ? `${urlUser}?full_name=${name}` : urlUser)

const UsersSrc = {
  getUsersByName,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUsersPermissions,
}

export default UsersSrc
