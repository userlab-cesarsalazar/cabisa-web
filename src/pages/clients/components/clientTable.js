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
import RightOutlined from '@ant-design/icons/lib/icons/RightOutlined'
import DownOutlined from '@ant-design/icons/lib/icons/DownOutlined'
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import MoreOutlined from '@ant-design/icons/lib/icons/MoreOutlined'
import { Cache } from 'aws-amplify'
import { validatePermissions } from '../../../utils/Utils'

const { Search } = Input

function ClientTable(props) {
  const columns = [
    {
      title: 'Nombre o Razón social',
      dataIndex: 'name', // Field that is goint to be rendered
      key: 'name',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Tipo',
      dataIndex: 'client_type', // Field that is goint to be rendered
      key: 'client_type',
      render: text => (
        <span>
          {text === 'INDIVIDUAL' ? (
            <Tag color='geekblue'>Persona individual</Tag>
          ) : text === 'COMPANY' ? (
            <Tag color='cyan'>Empresa</Tag>
          ) : (
            ''
          )}
        </span>
      ),
    },
    {
      title: 'NIT',
      dataIndex: 'nit', // Field that is goint to be rendered
      key: 'nit',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Email',
      dataIndex: 'email', // Field that is goint to be rendered
      key: 'email',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Telefono',
      dataIndex: 'phone', // Field that is goint to be rendered
      key: 'phone',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Direccion',
      dataIndex: 'address', // Field that is goint to be rendered
      key: 'address',
      render: text => <span>{text}</span>,
    },
    {
      title: '',
      dataIndex: 'id', // Field that is goint to be rendered
      key: 'id',
      render: (row, data) => (
        <span>
          {
            <Popover
              placement='left'
              style={{ zIndex: 'auto' }}
              content={
                <div>
                  {validatePermissions(
                    Cache.getItem('currentSession').userPermissions,
                    7
                  ).permissionsSection[0].edit && (
                    <span
                      className={'user-options-items'}
                      onClick={() => handlerEditRow(data)}
                    >
                      Editar
                    </span>
                  )}
                  {validatePermissions(
                    Cache.getItem('currentSession').userPermissions,
                    7
                  ).permissionsSection[0].delete &&
                    validatePermissions(
                      Cache.getItem('currentSession').userPermissions,
                      7
                    ).permissionsSection[0].edit && (
                      <Divider
                        className={'divider-enterprise-margins'}
                        type={'horizontal'}
                      />
                    )}
                  {validatePermissions(
                    Cache.getItem('currentSession').userPermissions,
                    7
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
              trigger='click'
            >
              <Button shape={'circle'} className={'enterprise-settings-button'}>
                <MoreOutlined />
              </Button>
            </Popover>
          }
        </span>
      ),
    },
  ]

  const getFilteredData = data => {
    props.handlerTextSearch(data)
  }

  const handlerEditRow = row => {
    props.handlerEditRow(row)
  }

  const handlerDeleteRow = row => {
    props.handlerDeleteRow(row)
  }

  return (
    <>
      <Row>
        <Col xs={18} sm={18} md={18} lg={18}>
          <Search
            prefix={<SearchOutlined className={'cabisa-table-search-icon'} />}
            placeholder='Busca por Nombre o Nit'
            className={'cabisa-table-search customSearch'}
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
                  pagination={{ pageSize: 5 }}
                  className={'CustomTableClass'}
                  dataSource={props.dataSource}
                  columns={columns}
                  loading={props.loading}
                  rowKey='id'
                  expandable={{
                    expandedRowRender: record => (
                      <div className={'text-left'}>
                        <p>
                          <b>Encargado Compras: </b>{' '}
                          {record.sales !== null ? record.business_man : ''}{' '}
                        </p>
                        <p>
                          <b>Encargado Pagos: </b>{' '}
                          {record.shops !== null ? record.payments_man : ''}{' '}
                        </p>
                      </div>
                    ),
                    expandIcon: ({ expanded, onExpand, record }) =>
                      expanded ? (
                        <DownOutlined onClick={e => onExpand(record, e)} />
                      ) : (
                        <RightOutlined onClick={e => onExpand(record, e)} />
                      ),
                  }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default ClientTable
