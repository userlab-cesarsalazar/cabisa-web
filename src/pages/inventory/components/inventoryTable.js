import React from 'react'
import {
  Table,
  Col,
  Input,
  Button,
  Row,
  Card,
  Tag as AntTag,
  Select,
} from 'antd'
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import { validatePermissions } from '../../../utils'
import { Cache } from 'aws-amplify'
import Tag from '../../../components/Tag'

const { Search } = Input
const { Option } = Select

function InventoryTable(props) {
  const getFilteredData = data => props.handlerTextSearch(data)

  const filterCategory = data => props.handlerCategorySearch(data)

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
            onSearch={getFilteredData}
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
            defaultValue={''}
            className={'single-select'}
            placeholder={'Categoria'}
            size={'large'}
            style={{ width: '100%', height: '40px' }}
            getPopupContainer={trigger => trigger.parentNode}
            onChange={value => filterCategory(value)}
          >
            <Option value={''}>
              <AntTag color='cyan'>Todo</AntTag>
            </Option>
            {props.productCategoriesList?.map(value => (
              <Option key={value} value={value}>
                <Tag type='productCategories' value={value} />
              </Option>
            ))}
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
