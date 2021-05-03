import React from 'react'
import { Button, Divider, Popconfirm, Tooltip } from 'antd'
import { permissionsButton, validatePermissions } from '../utils/Utils'
import { Cache } from 'aws-amplify'
import {
  DeleteOutlined,
  FileSearchOutlined,
  ApartmentOutlined,
} from '@ant-design/icons'

function ActionOptions(props) {
  const handlerEditRow = data => {
    props.handlerEditRow(data)
  }

  const handlerDeleteRow = data => {
    props.handlerDeleteRow(data)
  }

  const handlerEditPermissions = data => {
    props.handlerEditPermissions(data)
  }

  return (
    <div>
      {permissionsButton(
        props.permissionId,
        Cache.getItem('currentSession')
      ) && (
        <div>
          {props.editPermissions &&
            validatePermissions(
              Cache.getItem('currentSession').userPermissions,
              props.permissionId
            ).permissionsSection[0].edit && (
              <Tooltip title='Editar permisos' color={'blue'}>
                <Button
                  icon={<ApartmentOutlined />}
                  onClick={() => handlerEditPermissions(props.data)}
                />
              </Tooltip>
            )}

          {props.editPermissions &&
            validatePermissions(
              Cache.getItem('currentSession').userPermissions,
              props.permissionId
            ).permissionsSection[0].edit && <Divider type={'vertical'} />}

          {validatePermissions(
            Cache.getItem('currentSession').userPermissions,
            props.permissionId
          ).permissionsSection[0].edit && (
            <Tooltip title='Editar'>
              <Button
                icon={<FileSearchOutlined />}
                onClick={() => handlerEditRow(props.data)}
              />
            </Tooltip>
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
            <Tooltip title='Eliminar' color={'red'}>
              <Popconfirm
                title='Estas seguro de borrar el elemento selccionado?'
                onConfirm={() => handlerDeleteRow(props.data)}
                okText='Si'
                cancelText='No'
              >
                <Button danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </Tooltip>
          )}
        </div>
      )}
    </div>
  )
}

export default ActionOptions
