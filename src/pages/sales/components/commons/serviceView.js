import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

import SalesTable from '../commons/salesTable'
import SalesDetail from '../commons/salesDetail'
import { permissions } from '../../../../commons/types'

function ServiceView(props) {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const history = useHistory()

  const showDrawer = () => setIsDrawerVisible(true)

  const hideDrawer = () => setIsDrawerVisible(false)

  const NewNoteShipping = () => history.push('/serviceNoteView')

  return (
    <>
      <SalesTable
        buttonTitle={'Nueva nota de servicio'}
        permissions={permissions.VENTAS}
        newNote={NewNoteShipping}
        isDrawerVisible={isDrawerVisible}
        showDrawer={showDrawer}
        isAdmin={props.isAdmin}
        canEditAndCreate={props.canEditAndCreate}
        history={history}
      />
      <SalesDetail
        closable={hideDrawer}
        visible={isDrawerVisible}
        isAdmin={props.isAdmin}
        canEditAndCreate={props.canEditAndCreate}
      />
    </>
  )
}
export default ServiceView
