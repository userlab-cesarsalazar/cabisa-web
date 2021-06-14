import React from 'react'
import { Table, Col, Input, Row, Card, Tag } from 'antd'
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import ActionOptions from '../../../components/actionOptions'

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

  const handlerEditPermissions = row => {
    props.handlerEditPermissions(row)
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
        <ActionOptions
          editPermissions={true}
          showDeleteBtn
          data={data}
          permissionId={2}
          handlerDeleteRow={handlerDeleteRow}
          handlerEditRow={handlerEditRow}
          handlerEditPermissions={handlerEditPermissions}
        />
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
