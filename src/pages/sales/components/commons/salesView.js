import React from 'react'

import LoadMoreButton from '../../../../components/LoadMoreButton'
import SalesTable from '../commons/salesTable'
import SalesDetail from '../commons/salesDetail'

function SalesView(props) {
  return (
    <>
      <SalesTable
        dataSource={props.dataSource}
        handlerTextSearch={props.searchText}
        loading={props.loading}
        handlerEditRow={props.editRow}
        handlerDeleteRow={props.deleteRow}
        buttonTitle={props.buttonTitle}
        newNote={props.newNote}
      />
      <LoadMoreButton
        handlerButton={props.handlerMoreButton}
        moreInfo={props.existsMoreInfo}
      />
      <SalesDetail
        closable={props.onCancelButton}
        visible={props.visible}
        editData={props.detailData}
        cancelButton={props.onCancelButton}
        saveButtonEdit={props.saveButtonEdit}
      />
    </>
  )
}
export default SalesView