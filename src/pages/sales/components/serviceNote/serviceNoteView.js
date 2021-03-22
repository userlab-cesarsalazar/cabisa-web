import React from 'react'
import NewNoteView from '../commons/newNoteView'

function ServiceNoteview() {
  // Handlers
  const SaveData = () => {
    console.log('Save new Shipping Note')
  }

  const CancelButton = () => {
    console.log('Cancelar')
  }

  return (
    <div>
      <NewNoteView
        saveData={SaveData}
        cancelButton={CancelButton}
        title={'Nueva nota de servicio'}
      />
    </div>
  )
}
export default ServiceNoteview
