import React from 'react'
import {
  Table,
  Col,
  Input,
  Button,
  Row,
  Card,
  Popover,
  Divider,
  Popconfirm,
  Tag,
} from 'antd'
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import MoreOutlined from '@ant-design/icons/lib/icons/MoreOutlined'
import { Cache } from 'aws-amplify'
import { permissionsButton, validatePermissions } from '../../../utils/Utils'

const { Search } = Input

function UserTable(props) {
  const getFilteredData = data => {
    props.handlerTextSearch(data)
  }

  const handlerEditRow = row => {
    props.handlerEditRow(row)
  }

  const handlerDeleteRow = row => {
    props.handlerDeleteRow(row)
  }

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'full_name', // Field that is goint to be rendered
      key: 'full_name',
    },
    {
      title: 'Email',
      dataIndex: 'email', // Field that is goint to be rendered
      key: 'email',
    },
    {
      title: 'Rol',
      dataIndex: 'rol_id', // Field that is goint to be rendered
      key: 'rol_id',
      render: text => (
        <span>
          {text === 1 ? (
            <Tag color='#187fce'>Administrador</Tag>
          ) : text === 2 ? (
            <Tag color='#87d067'>Vendedor</Tag>
          ) : text === 3 ? (
            <Tag color='#f50'>Bodega</Tag>
          ) : text === 4 ? (
            <Tag color='#fec842'>Operador</Tag>
          ) : (
            ''
          )}
        </span>
      ),
    },
    {
      title: '',
      dataIndex: '_id', // Field that is goint to be rendered
      key: '_id',
      render: (row, data) => (
        <span>
          {
            <Popover
              placement='left'
              content={
                <div>
                  {validatePermissions(
                    Cache.getItem('currentSession').userPermissions,
                    2
                  ).permissionsSection[0].edit && (
                    <>
                      <span
                        className={'user-options-items'}
                        onClick={() => handlerEditRow(data)}
                      >
                        Editar
                      </span>
                      <Divider
                        className={'divider-enterprise-margins'}
                        type={'horizontal'}
                      />
                      <span
                        className={'user-options-items'}
                        onClick={() => props.handlerEditPermissions(data)}
                      >
                        Editar permisos
                      </span>{' '}
                    </>
                  )}
                  {validatePermissions(
                    Cache.getItem('currentSession').userPermissions,
                    2
                  ).permissionsSection[0].edit && (
                    <Divider
                      className={'divider-enterprise-margins'}
                      type={'horizontal'}
                    />
                  )}
                  {validatePermissions(
                    Cache.getItem('currentSession').userPermissions,
                    2
                  ).permissionsSection[0].delete && (
                    <Popconfirm
                      title='Estas seguro de borrar el elemento selccionado?'
                      onConfirm={() => handlerDeleteRow(data)}
                      okText='Si'
                      cancelText='No'
                    >
                      <span className={'user-options-items'}>Eliminar</span>
                    </Popconfirm>
                  )}
                </div>
              }
            >
              {permissionsButton(2, Cache.getItem('currentSession')) && (
                <Button
                  shape={'circle'}
                  className={'enterprise-settings-button'}
                >
                  <MoreOutlined />
                </Button>
              )}
            </Popover>
          }
        </span>
      ),
    },
  ]

  return (
    <>
      <Row>
        <Col xs={18} sm={18} md={18} lg={18}>
          <Search
            className={'customSearch'}
            prefix={<SearchOutlined className={'cabisa-table-search-icon'} />}
            placeholder='Presiona enter para buscar'
            style={{ width: '70%', height: '40px' }}
            size={'large'}
            onSearch={e => getFilteredData(e)}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Card className={'card-border-radius margin-top-15'}>
            <Row>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Table
                  scroll={{ y: 320 }}
                  loading={props.loading}
                  className={'CustomTableClass'}
                  dataSource={props.dataSource}
                  columns={columns}
                  rowKey='id'
                  pagination={{ pageSize: 5 }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default UserTable
