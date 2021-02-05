import React from 'react'
import NewNoteView from '../commons/newNoteView'

function ReceiptNoteView() {
  // Handlers
  const SaveReceiptData = () => {
    console.log('Save new Shipping Note')
  }

  const Cancel = () => {
    console.log('Cancelar')
  }

  return (
    <div>
      <NewNoteView
        saveDate={SaveReceiptData}
        cancelButton={Cancel}
        title={'Nueva nota de recibo'}
      />
    </div>
  )
}
export default ReceiptNoteView
