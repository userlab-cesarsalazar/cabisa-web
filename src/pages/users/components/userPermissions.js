import React, { useState, useEffect } from 'react'
import {
  Table,
  Checkbox,
  Button,
  Col,
  Divider,
  Drawer,
  Row,
  Typography,
  message,
} from 'antd'
import UsersSrc from '../usersSrc'
import { showErrors } from '../../../utils'

const { Title } = Typography

function UserPermissions(props) {
  const [tableDataSource, setTableDataSource] = useState([])
  const [loading, setLoading] = useState(true)
  const columns2 = [
    {
      title: 'Acción',
      dataIndex: 'name',
      key: 'name',
      align: 'left',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Ver',
      dataIndex: 'view',
      key: 'id',
      render: (isChecked, record) => (
        <Checkbox
          tdCentered
          checked={isChecked}
          name='view'
          onChange={e => {
            handlePermissionsChange(e, record)
          }}
        />
      ),
    },
    {
      title: 'Crear',
      dataIndex: 'create',
      render: (isChecked, record) => (
        <Checkbox
          tdCentered
          checked={isChecked}
          name='create'
          onChange={e => {
            handlePermissionsChange(e, record)
          }}
        />
      ),
    },
    {
      title: 'Editar',
      dataIndex: 'edit',
      render: (isChecked, record) => (
        <Checkbox
          tdCentered
          checked={isChecked}
          name='edit'
          onChange={e => {
            handlePermissionsChange(e, record)
          }}
        />
      ),
    },
    {
      title: 'Eliminar',
      dataIndex: 'delete',
      render: (isChecked, record) => (
        <Checkbox
          tdCentered
          checked={isChecked}
          name='delete'
          onChange={e => {
            handlePermissionsChange(e, record)
          }}
        />
      ),
    },
  ]

  useEffect(() => {
    if (props.visible) {
      setTableDataSource(props.permissionsData.permissions)
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible])

  const onCancel = () => props.closable()

  const savePermissions = () => {
    const data = {
      id: props.permissionsData.id,
      permissions: tableDataSource,
    }

    setLoading(true)

    UsersSrc.updatePermissions(data)
      .then(() => {
        message.success('Permisos actualizados exitosamente')
      })
      .catch(error => showErrors(error))
      .finally(() => {
        setLoading(false)
        props.closeOnSave()
      })
  }

  const handlePermissionsChange = (e, changedRow) => {
    let tmpData = JSON.parse(JSON.stringify(tableDataSource))
    const changedTableDataSource = tmpData.map(row => {
      if (row.id === changedRow.id)
        return Object.assign(row, { [e.target.name]: e.target.checked })
      return row
    })

    setTableDataSource(changedTableDataSource)
  }

  return (
    <Drawer
      placement='right'
      closable={false}
      onClose={props.closable}
      visible={props.visible}
      width={800}
    >
      <Title>
        {' '}
        {'Editar permisos'}
        <Divider className={'divider-cxustom-margins-users'} />
      </Title>
      <Row
        gutter={16}
        className={'section-space-field'}
        style={{ height: '100%' }}
      >
        <Col xs={24} sm={24} md={24} lg={24}>
          <Table
            id='edit-permissions-table'
            loading={loading}
            className={'CustomTableClass'}
            dataSource={tableDataSource}
            columns={columns2}
            pagination={false}
            rowKey={'id'}
          />
        </Col>
      </Row>
      <Row gutter={16}>
        <Divider className={'divider-custom-margins-users'} />
        <Col xs={24} sm={24} md={24} lg={24}>
          <div className='text-right'>
            <div>
              <Button
                type={'link'}
                className='cancel-button'
                onClick={onCancel}
              >
                Cancelar
              </Button>

              <Button
                className='title-cabisa new-button'
                onClick={savePermissions}
              >
                Guardar
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Drawer>
  )
}

export default UserPermissions
