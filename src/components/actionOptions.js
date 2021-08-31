import React from 'react'
import { Button, Divider, Popconfirm, Tooltip } from 'antd'
import { validatePermissions } from '../utils'
import { actions } from '../commons/types'
import {
  DeleteOutlined,
  FileSearchOutlined,
  ApartmentOutlined,
  CheckSquareOutlined,
} from '@ant-design/icons'

function ActionOptions({
  deleteAction = 'delete', // delete | cancel
  editAction = 'edit', // edit | show
  approveAction = 'invoice', // invoice | approve
  ...props
}) {
  const handlerEditRow = data => props.handlerEditRow(data)

  const handlerApproveRow = data => props.handlerApproveRow(data)

  const handlerDeleteRow = data => props.handlerDeleteRow(data)

  const handlerEditPermissions = data => props.handlerEditPermissions(data)

  const can = validatePermissions(props.permissionId)

  return (
    <div>
      {(can(actions.DELETE) || can(actions.EDIT)) && (
        <div>
          {props.editPermissions && can(actions.EDIT) && (
            <Tooltip title='Editar permisos' color={'blue'}>
              <Button
                icon={<ApartmentOutlined />}
                onClick={() => handlerEditPermissions(props.data)}
              />
            </Tooltip>
          )}

          {props.editPermissions && can(actions.EDIT) && (
            <Divider type={'vertical'} />
          )}

          {can(actions.EDIT) && (
            <Tooltip title={editAction === 'edit' ? 'Editar' : 'Ver Detalle'}>
              <Button
                icon={<FileSearchOutlined />}
                onClick={() => handlerEditRow(props.data)}
              />
            </Tooltip>
          )}

          {can(actions.EDIT) && can(actions.DELETE) && props.showDeleteBtn && (
            <Divider type={'vertical'} />
          )}

          {can(actions.DELETE) && props.showDeleteBtn && (
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

          {can(actions.CREATE) && can(actions.EDIT) && props.showApproveBtn && (
            <Divider type={'vertical'} />
          )}

          {can(actions.CREATE) && can(actions.EDIT) && props.showApproveBtn && (
            <Tooltip
              title={approveAction === 'invoice' ? 'Facturar' : 'Aprobar'}
            >
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
