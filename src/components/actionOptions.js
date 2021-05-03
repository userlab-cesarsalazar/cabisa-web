import React from 'react'
import { Button, Divider, Popconfirm } from 'antd'
import { permissionsButton, validatePermissions } from '../utils/Utils'
import { Cache } from 'aws-amplify'
import { DeleteOutlined, FileSearchOutlined } from '@ant-design/icons'

function ActionOptions(props) {
  const handlerEditRow = data => {
    props.handlerEditRow(data)
  }

  const handlerDeleteRow = data => {
    props.handlerDeleteRow(data)
  }

  return (
    <div>
      {permissionsButton(
        props.permissionId,
        Cache.getItem('currentSession')
      ) && (
        <div>
          {validatePermissions(
            Cache.getItem('currentSession').userPermissions,
            props.permissionId
          ).permissionsSection[0].edit && (
            <Button
              icon={<FileSearchOutlined />}
              onClick={() => handlerEditRow(props.data)}
            />
          )}
          {validatePermissions(
            Cache.getItem('currentSession').userPermissions,
            props.permissionId
          ).permissionsSection[0].delete &&
            validatePermissions(
              Cache.getItem('currentSession').userPermissions,
              props.permissionId
            ).permissionsSection[0].edit && <Divider type={'vertical'} />}
          {validatePermissions(
            Cache.getItem('currentSession').userPermissions,
            props.permissionId
          ).permissionsSection[0].delete && (
            <Popconfirm
              title='Estas seguro de borrar el elemento selccionado?'
              onConfirm={() => handlerDeleteRow(props.data)}
              okText='Si'
              cancelText='No'
            >
              <Button danger icon={<DeleteOutlined />} />
            </Popconfirm>
          )}
        </div>
      )}
    </div>
  )
}

export default ActionOptions
