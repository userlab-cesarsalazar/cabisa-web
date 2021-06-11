import React from 'react'
import { Cache } from 'aws-amplify'
import NewNoteView from '../commons/newNoteView'
import { validateRole } from '../../../../utils'

function ServiceNoteview() {
  const canViewPrice = validateRole(Cache.getItem('currentSession').rol_id, 1)

  return (
    <div>
      <NewNoteView canViewPrice={canViewPrice} />
    </div>
  )
}
export default ServiceNoteview
