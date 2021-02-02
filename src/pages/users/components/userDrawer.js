import React from 'react'
import { Divider, Drawer, Typography, Row } from 'antd'
import UserFields from './userFields'
const { Title } = Typography

function UserDrawer(props) {
  const saveData = (requestData, id, edit) => {
    props.saveButtonEdit(requestData, id, edit)
  }

  return (
    <Drawer
      placement='right'
      closable={false}
      onClose={props.closable}
      visible={props.visible}
      width={800}
    >
      <UserFields
        saveUserData={saveData}
        visible={props.visible}
        edit={props.edit}
        data={props.editData}
        cancelButton={props.cancelButton}
      />
    </Drawer>
  )
}
export default UserDrawer
