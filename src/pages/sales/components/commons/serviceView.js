import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

import SalesTable from '../commons/salesTable'
import SalesDetail from '../commons/salesDetail'
import { validateRole } from '../../../../utils'
import { permissions, roles } from '../../../../commons/types'

function ServiceView() {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const history = useHistory()

  const isAdmin = validateRole(roles.ADMIN)

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
        isAdmin={isAdmin}
        history={history}
      />
      <SalesDetail
        closable={hideDrawer}
        visible={isDrawerVisible}
        isAdmin={isAdmin}
      />
    </>
  )
}
export default ServiceView
