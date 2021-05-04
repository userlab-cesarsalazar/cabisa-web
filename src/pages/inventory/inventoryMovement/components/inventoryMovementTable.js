import React from 'react'
import { Table, Col, Input, Button, Row, Card, Tag, Select } from 'antd'
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import { validatePermissions } from '../../../../utils/Utils'
import { Cache } from 'aws-amplify'
import DownOutlined from '@ant-design/icons/lib/icons/DownOutlined'
import RightOutlined from '@ant-design/icons/lib/icons/RightOutlined'

const { Search } = Input
const { Option } = Select

function InventoryMovementTable(props) {
  const getFilteredData = data => {
    props.handlerTextSearch(data)
  }

  const filterCategory = data => {
    props.handlerCategoryService(data)
  }

  return (
    <>
      <Row gutter={16}>
        <Col xs={10} sm={10} md={10} lg={10}>
          <Search
            prefix={<SearchOutlined className={'cabisa-table-search-icon'} />}
            placeholder='Presiona enter para buscar'
            className={'cabisa-table-search customSearch'}
            style={{ width: '100%', height: '40px' }}
            size={'large'}
            onSearch={e => getFilteredData(e)}
          />
        </Col>
        <Col xs={8} sm={8} md={8} lg={8}>
          <Select
            defaultValue={99}
            className={'single-select'}
            placeholder={'Categoria'}
            size={'large'}
            style={{ width: '100%', height: '40px' }}
            getPopupContainer={trigger => trigger.parentNode}
            onChange={value => filterCategory(value)}
          >
            <Option value={99}>
              <Tag color='grey'>Todo</Tag>
            </Option>
            <Option value={1}>
              <Tag color='blue'>Compra</Tag>
            </Option>
            <Option value={2}>
              <Tag color='green'>Ingreso</Tag>
            </Option>
            <Option value={3}>
              <Tag color='red'>Egreso</Tag>
            </Option>
          </Select>
        </Col>
        <Col xs={6} sm={6} md={6} lg={6} style={{ textAlign: 'right' }}>
          {validatePermissions(
            Cache.getItem('currentSession').userPermissions,
            5
          ).permissionsSection[0].create && (
            <Button
              className='title-cabisa new-button'
              onClick={props.showDraweTbl}
            >
              Nuevo Item
            </Button>
          )}
        </Col>
      </Row>
      <Row>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Card className={'card-border-radius margin-top-15'}>
            <Row>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Table
                  scroll={{ y: 320 }}
                  className={'CustomTableClass'}
                  dataSource={props.dataSource}
                  columns={props.columns}
                  pagination={{ pageSize: 5 }}
                  loading={props.loading}
                  rowKey='id'
                  expandable={{
                    expandedRowRender: record => (
                      <div className={'text-left'}>
                        <p>
                          <b>Cantidad: </b>{' '}
                          {record.quantity !== null ? record.quantity : ''}{' '}
                        </p>
                        <p>
                          <b>Nro. Documento: </b>{' '}
                          {record.billNumber !== null ? record.billNumber : ''}{' '}
                        </p>
                        <p>
                          <b>Ingresado por: </b>{' '}
                          {record.createdBy !== null ? record.createdBy : ''}{' '}
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

export default InventoryMovementTable
