import api from '../../commons/api'
import { stage } from '../../commons/credentials'
import { stakeholdersTypes, stakeholdersStatus } from '../../commons/types'

const url = stage.stakeholderUrl

const getSuppliers = params =>
  api.get(url, {
    ...params,
    stakeholder_type: stakeholdersTypes.PROVIDER,
    status: stakeholdersStatus.ACTIVE,
  })
const getSuppliersFilter = name =>
  api.get(url, {
    open_parenthesis: 'name',
    close_parenthesis: 'nit',
    name: { $like: `%25${name}%25` },
    nit: { $or: true, $like: `%25${name}%25` },
    stakeholder_type: stakeholdersTypes.PROVIDER,
    status: stakeholdersStatus.ACTIVE,
  })
const createSupplier = _users => api.post(url, _users)
const updateSupplier = _users => api.put(url, _users)
const deleteSupplier = id =>
  api.put(`${url}/status`, { id, status: stakeholdersStatus.INACTIVE })

const SuppliersSrc = {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getSuppliersFilter,
}

export default SuppliersSrc
