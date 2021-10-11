import React from 'react'
import NewNoteView from '../commons/newNoteView'
import { validatePermissions, validateRole } from '../../../../utils'
import { actions, permissions, roles } from '../../../../commons/types'

function ServiceNoteview() {
  const can = validatePermissions(permissions.VENTAS)
  const canEditAndCreate = can(actions.CREATE) || can(actions.EDIT)
  const isAdmin = validateRole(roles.ADMIN)

  return (
    <div>
      <NewNoteView canEditAndCreate={canEditAndCreate} isAdmin={isAdmin} />
    </div>
  )
}
export default ServiceNoteview
