import React from 'react'
import HeaderPage from '../../components/HeaderPage'
import SalesTabIndex from './components/salesTabIndex'
import { validatePermissions, validateRole } from '../../utils'
import { actions, permissions, roles } from '../../commons/types'

function Sales() {
  const can = validatePermissions(permissions.VENTAS)
  const canEditAndCreate = can(actions.CREATE) || can(actions.EDIT)
  const isAdmin = validateRole(roles.ADMIN) || validateRole(roles.SELLS)

  return (
    <>
      <HeaderPage title={'Ventas'} />
      <SalesTabIndex canEditAndCreate={canEditAndCreate} isAdmin={isAdmin} />
    </>
  )
}
export default Sales
