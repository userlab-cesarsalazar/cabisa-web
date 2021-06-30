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
import { validatePermissions } from '../../../../utils'
import {
  documentsStatus,
  permissions,
  actions,
} from '../../../../commons/types'
import Tag from '../../../../components/Tag'

const { Search } = Input
const { Option } = Select

function InventoryMovementTable(props) {
  const getFilteredData = data => {
    props.handlerTextSearch(data)
  }

  const filterCategory = data => {
    props.handlerCategoryService(data)
  }

  const can = validatePermissions(permissions.INVENTARIO)

  return (
    <>
      <Row gutter={16}>
        <Col xs={10} sm={10} md={10} lg={10}>
          <Search
            prefix={<SearchOutlined className={'cabisa-table-search-icon'} />}
            placeholder='Buscar por Nro de Documento'
            className={'cabisa-table-search customSearch'}
            style={{ width: '100%', height: '40px' }}
            size={'large'}
            onSearch={e => getFilteredData(e)}
          />
        </Col>
        <Col xs={8} sm={8} md={8} lg={8}>
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
              <AntTag color='grey'>Todo</AntTag>
            </Option>
            <Option value={documentsStatus.APPROVED}>
              <Tag type='documentStatus' value={documentsStatus.APPROVED} />
            </Option>
            <Option value={documentsStatus.CANCELLED}>
              <Tag type='documentStatus' value={documentsStatus.CANCELLED} />
            </Option>
          </Select>
        </Col>
        <Col xs={6} sm={6} md={6} lg={6} style={{ textAlign: 'right' }}>
          {can(actions.CREATE) && (
            <Button
              className='title-cabisa new-button'
              onClick={props.goCreateNewItem}
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

export default InventoryMovementTable
