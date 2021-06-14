import React from 'react'
import { Button, Divider, Popconfirm, Tooltip } from 'antd'
import { permissionsButton, validatePermissions } from '../utils'
import { Cache } from 'aws-amplify'
import {
  DeleteOutlined,
  FileSearchOutlined,
  ApartmentOutlined,
  CheckSquareOutlined,
} from '@ant-design/icons'

function ActionOptions({
  deleteAction = 'delete',
  editAction = 'edit',
  ...props
}) {
  const handlerEditRow = data => props.handlerEditRow(data)

  const handlerApproveRow = data => props.handlerApproveRow(data)

  const handlerDeleteRow = data => props.handlerDeleteRow(data)

  const handlerEditPermissions = data => props.handlerEditPermissions(data)

  const can = action =>
    validatePermissions(
      Cache.getItem('currentSession').userPermissions,
      props.permissionId
    ).permissionsSection[0][action]

  return (
    <div>
      {permissionsButton(
        props.permissionId,
        Cache.getItem('currentSession')
      ) && (
        <div>
          {props.editPermissions && can('edit') && (
            <Tooltip title='Editar permisos' color={'blue'}>
              <Button
                icon={<ApartmentOutlined />}
                onClick={() => handlerEditPermissions(props.data)}
              />
            </Tooltip>
          )}

          {props.editPermissions && can('edit') && (
            <Divider type={'vertical'} />
          )}

          {can('edit') && (
            <Tooltip title={editAction === 'edit' ? 'Editar' : 'Ver Detalle'}>
              <Button
                icon={<FileSearchOutlined />}
                onClick={() => handlerEditRow(props.data)}
              />
            </Tooltip>
          )}

          {can('edit') && can('delete') && props.showDeleteBtn && (
            <Divider type={'vertical'} />
          )}

          {can('delete') && props.showDeleteBtn && (
            <Tooltip
              title={deleteAction === 'delete' ? 'Eliminar' : 'Cancelar'}
              color={'red'}
            >
              <Popconfirm
                title={`¿Estas seguro de ${
                  deleteAction === 'delete' ? 'borrar' : 'anular'
                } el elemento seleccionado?`}
                onConfirm={() => handlerDeleteRow(props.data)}
                okText='Si'
                cancelText='No'
              >
                <Button danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </Tooltip>
          )}

          {can('edit') && can('delete') && props.showApproveBtn && (
            <Divider type={'vertical'} />
          )}

          {can('edit') && props.showApproveBtn && (
            <Tooltip title='Facturar'>
              <Popconfirm
                title={`¿Estas seguro de facturar el elemento seleccionado?`}
                onConfirm={() => handlerApproveRow(props.data)}
                okText='Si'
                cancelText='No'
              >
                <Button icon={<CheckSquareOutlined />} />
              </Popconfirm>
            </Tooltip>
          )}
        </div>
      )}
    </div>
  )
}

export default ActionOptions
