import React from 'react'
import { Table, Col, Input, Button, Row, Card, DatePicker } from 'antd'
import RightOutlined from '@ant-design/icons/lib/icons/RightOutlined'
import DownOutlined from '@ant-design/icons/lib/icons/DownOutlined'
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import { Cache } from 'aws-amplify'
import { validatePermissions } from '../../../../utils/Utils'
import ActionOptions from '../../../../components/actionOptions'

const { Search } = Input

function SalesTable(props) {
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
        <ActionOptions
          editPermissions={false}
          data={data}
          permissionId={props.permissions}
          handlerDeleteRow={handlerDeleteRow}
          handlerEditRow={handlerEditRow}
        />
      ),
    },
  ]

  return (
    <>
      <Row gutter={16}>
        <Col xs={10} sm={10} md={10} lg={10}>
          <Search
            className={'customSearch'}
            prefix={<SearchOutlined className={'cabisa-table-search-icon'} />}
            placeholder='Presiona enter para buscar'
            style={{ height: '40px' }}
            size={'large'}
            onSearch={e => getFilteredData(e)}
          />
        </Col>
        <Col xs={8} sm={8} md={8} lg={8}>
          <DatePicker
            placeholder={'Fecha'}
            style={{ width: '100%', height: '40px', borderRadius: '8px' }}
          />
        </Col>
        <Col xs={6} sm={6} md={6} lg={6} className='text-right'>
          <Button
            className={
              validatePermissions(
                Cache.getItem('currentSession').userPermissions,
                props.permissions
              ).permissionsSection[0].create
                ? 'title-cabisa new-button'
                : 'hide-component title-cabisa new-button'
            }
            // className='title-cabisa new-button'
            onClick={props.newNote}
          >
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
