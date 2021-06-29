import React from 'react'
import NewNoteView from '../commons/newNoteView'
import { validateRole } from '../../../../utils'
import { roles } from '../../../../commons/types'

function ServiceNoteview() {
  const isAdmin = validateRole(roles.ADMIN)

  return (
    <div>
      <NewNoteView isAdmin={isAdmin} />
    </div>
  )
}
export default ServiceNoteview
