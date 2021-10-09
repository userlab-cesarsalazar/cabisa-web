import React from 'react'
import ServiceView from '../commons/serviceView'

function ServiceNote(props) {
  return (
    <ServiceView
      canEditAndCreate={props.canEditAndCreate}
      isAdmin={props.isAdmin}
    />
  )
}

export default ServiceNote
