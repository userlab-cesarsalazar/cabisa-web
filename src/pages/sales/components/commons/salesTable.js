import React, { useContext } from 'react'
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
} from 'antd'
import RightOutlined from '@ant-design/icons/lib/icons/RightOutlined'
import DownOutlined from '@ant-design/icons/lib/icons/DownOutlined'
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import MoreOutlined from '@ant-design/icons/lib/icons/MoreOutlined'

// Context
// import { Context, useStore } from '../../../context'
import { Context, useStore } from '../../../../context'

const { Search } = Input

function SalesTable(props) {
  const [state] = useContext(Context)
  const { hasPermissions } = useStore(state)

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
      title: 'No. de boleta',
      dataIndex: '_ticketId', // Field that is goint to be rendered
      key: '_ticketId',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Empresa',
      dataIndex: '_enterprise', // Field that is goint to be rendered
      key: '_enterprise',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Proyecto',
      dataIndex: '_project', // Field that is goint to be rendered
      key: '_project',
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
                  {hasPermissions([63]) && (
                    <span
                      className={'user-options-items'}
                      onClick={() => handlerEditRow(data)}
                    >
                      Ver Detalles
                    </span>
                  )}
                  {hasPermissions([63]) && hasPermissions([64]) && (
                    <Divider
                      className={'divider-enterprise-margins'}
                      type={'horizontal'}
                    />
                  )}
                  {hasPermissions([64]) && (
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
              {(hasPermissions([63]) || hasPermissions([64])) && (
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
        <Col xs={6} sm={6} md={6} lg={6} className='text-right'>
          <Button className='title-cabisa new-button' onClick={props.newNote}>
            {props.buttonTitle}
          </Button>
        </Col>
      </Row>
      <Row>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Card className={'card-border-radius margin-top-15'}>
            <Row>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Table
                  scroll={{ y: 250 }}
                  loading={props.loading}
                  className={'CustomTableClass'}
                  dataSource={props.dataSource}
                  columns={columns}
                  pagination={false}
                  rowKey='id'
                  expandable={{
                    expandedRowRender: record => (
                      <div className={'text-left'}>
                        <p>
                          <b>Encargado </b>{' '}
                          {record._manager !== null ? record._manager : ''}{' '}
                        </p>
                        <p>
                          <b>Direccion: </b>{' '}
                          {record._address !== null ? record._address : ''}{' '}
                        </p>
                        <p>
                          <b>Telefono: </b>{' '}
                          {record._phone !== null ? record._phone : ''}{' '}
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

export default SalesTable
