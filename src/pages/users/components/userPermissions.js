import React, { useState, useEffect, useContext } from 'react'
import { Table, Checkbox, Button, Col, Divider, Drawer, message, Row, Typography } from 'antd'
import { Context } from '../../../context'
const { Title } = Typography

const dataDummy = [
        {
            "id":1,
            "name":"Ver",
            "group":"Configurar Informaci\u00f3n General",
            "level":2,
            "guard_name":"api",
            "created_at":"2021-01-22T18:41:16.000000Z",
            "updated_at":"2021-01-22T18:41:16.000000Z"
        },
        {
            "id":2,
            "name":"Crear",
            "group":"Configurar Informaci\u00f3n General",
            "level":1,
            "guard_name":"api",
            "created_at":"2021-01-22T18:41:16.000000Z",
            "updated_at":"2021-01-22T18:41:16.000000Z"
        },
        {
            "id":3,
            "name":"Editar",
            "group":"Configurar Informaci\u00f3n General",
            "level":2,
            "guard_name":"api",
            "created_at":"2021-01-22T18:41:16.000000Z",
            "updated_at":"2021-01-22T18:41:16.000000Z"
        },
        {
            "id":4,
            "name":"Eliminar",
            "group":"Configurar Informaci\u00f3n General",
            "level":1,
            "guard_name":"api",
            "created_at":"2021-01-22T18:41:16.000000Z",
            "updated_at":"2021-01-22T18:41:16.000000Z"
        },
        {
            "id":5,
            "name":"Ver",
            "group":"Manejo de Usuarios",
            "level":2,
            "guard_name":"api",
            "created_at":"2021-01-22T18:41:16.000000Z",
            "updated_at":"2021-01-22T18:41:16.000000Z"
        },
        {
            "id":6,
            "name":"Crear",
            "group":"Manejo de Usuarios",
            "level":2,
            "guard_name":"api",
            "created_at":"2021-01-22T18:41:16.000000Z",
            "updated_at":"2021-01-22T18:41:16.000000Z"
        },
        {
            "id":7,
            "name":"Editar",
            "group":"Manejo de Usuarios",
            "level":2,
            "guard_name":"api",
            "created_at":"2021-01-22T18:41:16.000000Z",
            "updated_at":"2021-01-22T18:41:16.000000Z"
        },
        {
            "id":8,
            "name":"Eliminar",
            "group":"Manejo de Usuarios",
            "level":2,
            "guard_name":"api",
            "created_at":"2021-01-22T18:41:16.000000Z",
            "updated_at":"2021-01-22T18:41:16.000000Z"
        },
        {
            "id":9,
            "name":"Ver",
            "group":"Manejo de Reportes",
            "level":2,
            "guard_name":"api",
            "created_at":"2021-01-22T18:41:16.000000Z",
            "updated_at":"2021-01-22T18:41:16.000000Z",
        },
        {
            "id":10,
            "name":"Crear",
            "group":"Manejo de Reportes",
            "level":2,
            "guard_name":"api",
            "created_at":"2021-01-22T18:41:16.000000Z",
            "updated_at":"2021-01-22T18:41:16.000000Z",
        },
        {
            "id":11,
            "name":"Editar",
            "group":"Manejo de Reportes",
            "level":2,
            "guard_name":"api",
            "created_at":"2021-01-22T18:41:16.000000Z",
            "updated_at":"2021-01-22T18:41:16.000000Z",
        },
        {
            "id":12,
            "name":"Eliminar",
            "group":"Manejo de Reportes",
            "level":2,
            "guard_name":"api",
            "created_at":"2021-01-22T18:41:16.000000Z",
            "updated_at":"2021-01-22T18:41:16.000000Z",
        },
        {
            "id":13,
            "name":"Ver",
            "group":"Manejo de M\u00e9todos de Pago",
            "level":2,
            "guard_name":"api",
            "created_at":"2021-01-22T18:41:16.000000Z",
            "updated_at":"2021-01-22T18:41:16.000000Z",
        },
        {
            "id":14,
            "name":"Crear",
            "group":"Manejo de M\u00e9todos de Pago",
            "level":2,
            "guard_name":"api",
            "created_at":"2021-01-22T18:41:16.000000Z",
            "updated_at":"2021-01-22T18:41:16.000000Z",
            "pivot":{
                "model_id":6,
                "permission_id":14,
                "model_type":"App\\Http\\Modules\\User\\User"
            }
        },
        {
            "id":15,
            "name":"Editar",
            "group":"Manejo de M\u00e9todos de Pago",
            "level":2,
            "guard_name":"api",
            "created_at":"2021-01-22T18:41:16.000000Z",
            "updated_at":"2021-01-22T18:41:16.000000Z",
        },
        {
            "id":16,
            "name":"Eliminar",
            "group":"Manejo de M\u00e9todos de Pago",
            "level":2,
            "guard_name":"api",
            "created_at":"2021-01-22T18:41:16.000000Z",
            "updated_at":"2021-01-22T18:41:16.000000Z",
        },
        {
            "id":17,
            "name":"Ver",
            "group":"Facturaci\u00f3n",
            "level":2,
            "guard_name":"api",
            "created_at":"2021-01-22T18:41:16.000000Z",
            "updated_at":"2021-01-22T18:41:16.000000Z",
        },
        {
            "id":18,
            "name":"Crear",
            "group":"Facturaci\u00f3n",
            "level":2,
            "guard_name":"api",
            "created_at":"2021-01-22T18:41:16.000000Z",
            "updated_at":"2021-01-22T18:41:16.000000Z",
        },
        {
            "id":19,
            "name":"Editar",
            "group":"Facturaci\u00f3n",
            "level":2,
            "guard_name":"api",
            "created_at":"2021-01-22T18:41:16.000000Z",
            "updated_at":"2021-01-22T18:41:16.000000Z",
        },
        {
            "id":20,
            "name":"Eliminar",
            "group":"Facturaci\u00f3n",
            "level":2,
            "guard_name":"api",
            "created_at":"2021-01-22T18:41:16.000000Z",
            "updated_at":"2021-01-22T18:41:16.000000Z"
        },
        {
            "id":21,
            "name":"Ver",
            "group":"Inventario",
            "level":3,
            "guard_name":"api",
            "created_at":"2021-01-22T18:41:16.000000Z",
            "updated_at":"2021-01-22T18:41:16.000000Z"
        },
        {
            "id":22,
            "name":"Crear",
            "group":"Inventario",
            "level":3,
            "guard_name":"api",
            "created_at":"2021-01-22T18:41:16.000000Z",
            "updated_at":"2021-01-22T18:41:16.000000Z"
        },
        {
            "id":23,
            "name":"Editar",
            "group":"Inventario",
            "level":3,
            "guard_name":"api",
            "created_at":"2021-01-22T18:41:16.000000Z",
            "updated_at":"2021-01-22T18:41:16.000000Z"
        },
        {
            "id":24,
            "name":"Eliminar",
            "group":"Inventario",
            "level":3,
            "guard_name":"api",
            "created_at":"2021-01-22T18:41:16.000000Z",
            "updated_at":"2021-01-22T18:41:16.000000Z"
        },
        {
            "id":25,
            "name":"Ver",
            "group":"Registro de Ventas",
            "level":4,
            "guard_name":"api",
            "created_at":"2021-01-22T18:41:16.000000Z",
            "updated_at":"2021-01-22T18:41:16.000000Z"
        },
        {
            "id":26,
            "name":"Crear",
            "group":"Registro de Ventas",
            "level":4,
            "guard_name":"api",
            "created_at":"2021-01-22T18:41:16.000000Z",
            "updated_at":"2021-01-22T18:41:16.000000Z"
        },
        {
            "id":27,
            "name":"Editar",
            "group":"Registro de Ventas",
            "level":3,
            "guard_name":"api",
            "created_at":"2021-01-22T18:41:16.000000Z",
            "updated_at":"2021-01-22T18:41:16.000000Z"
        },
        {
            "id":28,
            "name":"Eliminar",
            "group":"Registro de Ventas",
            "level":3,
            "guard_name":"api",
            "created_at":"2021-01-22T18:41:16.000000Z",
            "updated_at":"2021-01-22T18:41:16.000000Z"
        },
        {
            "id":29,
            "name":"Ver",
            "group":"Manejo de Datos de Clientes",
            "level":3,
            "guard_name":"api",
            "created_at":"2021-01-22T18:41:16.000000Z",
            "updated_at":"2021-01-22T18:41:16.000000Z"
        },
        {
            "id":30,
            "name":"Crear",
            "group":"Manejo de Datos de Clientes",
            "level":3,
            "guard_name":"api",
            "created_at":"2021-01-22T18:41:16.000000Z",
            "updated_at":"2021-01-22T18:41:16.000000Z"
        },
        {
            "id":31,
            "name":"Editar",
            "group":"Manejo de Datos de Clientes",
            "level":3,
            "guard_name":"api",
            "created_at":"2021-01-22T18:41:16.000000Z",
            "updated_at":"2021-01-22T18:41:16.000000Z"
        },
        {
            "id":32,
            "name":"Eliminar",
            "group":"Manejo de Datos de Clientes",
            "level":1,
            "guard_name":"api",
            "created_at":"2021-01-22T18:41:16.000000Z",
            "updated_at":"2021-01-22T18:41:16.000000Z"
        },
        {
            "id":33,
            "name":"Ver",
            "group":"Informaci\u00f3n B\u00e1sica del Sistema",
            "level":1,
            "guard_name":"api",
            "created_at":"2021-01-22T18:41:16.000000Z",
            "updated_at":"2021-01-22T18:41:16.000000Z"
        },
        {
            "id":34,
            "name":"Crear",
            "group":"Informaci\u00f3n B\u00e1sica del Sistema",
            "level":1,
            "guard_name":"api",
            "created_at":"2021-01-22T18:41:16.000000Z",
            "updated_at":"2021-01-22T18:41:16.000000Z"
        },
        {
            "id":35,
            "name":"Editar",
            "group":"Informaci\u00f3n B\u00e1sica del Sistema",
            "level":1,
            "guard_name":"api",
            "created_at":"2021-01-22T18:41:16.000000Z",
            "updated_at":"2021-01-22T18:41:16.000000Z"
        },
        {
            "id":36,
            "name":"Eliminar",
            "group":"Informaci\u00f3n B\u00e1sica del Sistema",
            "level":1,
            "guard_name":"api",
            "created_at":"2021-01-22T18:41:16.000000Z",
            "updated_at":"2021-01-22T18:41:16.000000Z"
        }
    ]

function UserPermissions(props) {
  const [{ auth }] = useContext(Context)
  const [permissionsList, setPermissionsList] = useState(dataDummy)
  const [userPermissions, setUserPermissions] = useState(dataDummy)
  const [tableDataSource, setTableDataSource] = useState([])
  const [loading, setLoading] = useState(true)

  const columns = [
    {
      title: 'Acción',
      dataIndex: 'accion',
      key: 'key',
      align: 'left',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Ver',
      dataIndex: 'ver',
      render: (isChecked, record) => (
        <Checkbox
          tdCentered
          checked={isChecked}
          name="ver"
          onChange={e => {
            handlePermissionsChange(e, record)
          }}
        />
      ),
    },
    {
      title: 'Crear',
      dataIndex: 'crear',
      render: (isChecked, record) => (
        <Checkbox
          tdCentered
          checked={isChecked}
          name="crear"
          onChange={e => {
            handlePermissionsChange(e, record)
          }}
        />
      ),
    },
    {
      title: 'Editar',
      dataIndex: 'editar',
      render: (isChecked, record) => (
        <Checkbox
          tdCentered
          checked={isChecked}
          name="editar"
          onChange={e => {
            handlePermissionsChange(e, record)
          }}
        />
      ),
    },
    {
      title: 'Eliminar',
      dataIndex: 'eliminar',
      render: (isChecked, record) => (
        <Checkbox
          tdCentered
          checked={isChecked}
          name="eliminar"
          onChange={e => {
            handlePermissionsChange(e, record)
          }}
        />
      ),
    },
  ]

  const generateTableDataSource = () => {
    return permissionsList.reduce((result, val, index) => {
      const rowDTO = value => {
        const valueName = value.name.toLowerCase()
        return {
          key: value.group,
          accion: value.group,
          [`${valueName}Id`]: value.id,
          [valueName]: userPermissions.length > 0 ? userPermissions.some(v => v.id === value.id) : false,
        }
      }

      if (index === 1) result = [rowDTO(result)]
      const permission = rowDTO(val)

      if (!result.some(v => v.key === permission.key)) {
        result.push(permission)
        return result
      }
      return result.map(rowData => {
        if (rowData.key === permission.key) return Object.assign(rowData, permission)
        return rowData
      })
    })
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible, props.userId])

  useEffect(() => {
    if (permissionsList.length > 0 && userPermissions) {
      const dataSource = generateTableDataSource()
      setTableDataSource(dataSource)
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPermissions, permissionsList])

  const onCancel = () => {
    props.closable()
  }

  const savePermissions = () => {
    setLoading(false)
  }

  const handlePermissionsChange = (e, changedRow) => {
    const changedTableDataSource = tableDataSource.map(row => {
      if (row.key === changedRow.key) return Object.assign(row, { [e.target.name]: e.target.checked })
      return row
    })

    setTableDataSource(changedTableDataSource)
  }

  return (
    <Drawer placement="right" closable={false} onClose={props.closable} visible={props.visible} width={800}>
      <Title> {'Editar permisos'} </Title>
      <Divider className={'divider-cxustom-margins-users'} />
      <Row gutter={16} className={'section-space-field'}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Table
            id="edit-permissions-table"
            loading={loading}
            className={'CustomTableClass'}
            dataSource={tableDataSource}
            columns={columns}
            pagination={false}
          />
        </Col>
      </Row>
      <Divider className={'divider-custom-margins-users'} />
      <Row gutter={16}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <div className="text-right">
            <div>
              <Button type={'link'} className="cancel-button" onClick={onCancel}>
                Cancelar
              </Button>

              <Button className="title-cabisa new-button" onClick={savePermissions}>
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
