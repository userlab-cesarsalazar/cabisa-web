import React from 'react'
import { Cache } from 'aws-amplify'
import NewNoteView from '../commons/newNoteView'
import { validateRole } from '../../../../utils'

function ServiceNoteview() {
  const isAdmin = validateRole(Cache.getItem('currentSession').rol_id, 1)

  return (
    <div>
      <NewNoteView isAdmin={isAdmin} />
    </div>
  )
}
export default ServiceNoteview
