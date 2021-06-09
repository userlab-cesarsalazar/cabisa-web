import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

import LoadMoreButton from '../../../../components/LoadMoreButton'
import SalesTable from '../commons/salesTable'
import SalesDetail from '../commons/salesDetail'

function ServiceView() {
  const [existMoreInfo, setExistMoreInfo] = useState(false)
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)
  const history = useHistory()

  const handlerMoreButton = () => console.log('moreInfo')

  const showDrawer = () => setIsDrawerVisible(true)

  const hideDrawer = () => setIsDrawerVisible(false)

  const NewNoteShipping = () => history.push('/serviceNoteView')

  return (
    <>
      <SalesTable
        buttonTitle={'Nueva nota de servicio'}
        permissions={6}
        newNote={NewNoteShipping}
        isDrawerVisible={isDrawerVisible}
        showDrawer={showDrawer}
      />
      <LoadMoreButton
        handlerButton={handlerMoreButton}
        moreInfo={existMoreInfo}
      />
      <SalesDetail
        closable={hideDrawer}
        visible={isDrawerVisible}
        setExistMoreInfo={setExistMoreInfo}
      />
    </>
  )
}
export default ServiceView
