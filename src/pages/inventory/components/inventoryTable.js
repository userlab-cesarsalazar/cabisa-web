import React from 'react'
import { Table, Col, Input, Button, Row, Card, Tag, Select } from 'antd'
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'

const { Search } = Input
const { Option } = Select

function InventoryTable(props) {
  const getFilteredData = data => {
    props.handlerTextSearch(data)
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
        <Col
          xs={8}
          sm={8}
          md={8}
          lg={8}
          className={props.warehouse ? 'stash-component' : ''}
        >
          <Select
            className={'single-select'}
            placeholder={'Categoria'}
            size={'large'}
            style={{ width: '100%', height: '40px' }}
            getPopupContainer={trigger => trigger.parentNode}
          >
            <Option value={0}>
              <Tag color='#87d068'>Servicio</Tag>
            </Option>
            <Option value={1}>
              <Tag color='#f50'>Equipo</Tag>
            </Option>
          </Select>
        </Col>
        <Col xs={6} sm={6} md={6} lg={6} style={{ textAlign: 'right' }}>
          <Button
            className='title-cabisa new-button'
            onClick={props.showDraweTbl}
          >
            Nuevo Item
          </Button>
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
                  pagination={false}
                  loading={props.loading}
                  rowKey='id'
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default InventoryTable
