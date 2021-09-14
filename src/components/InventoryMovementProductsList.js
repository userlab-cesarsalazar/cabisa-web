import React from 'react'
import debounce from 'lodash/debounce'
import {
  List,
  Col,
  Input,
  Row,
  Button,
  Select,
  Popconfirm,
  Divider,
} from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

const { Option } = Select

function InventoryMovementProductsList({
  dataSource,
  handleAddDetail,
  handleChangeDetail,
  handleRemoveDetail,
  handleSearchProduct,
  productsOptionsList,
  loading,
  forbidEdition,
  ...props
}) {
  return (
    <List
      {...props}
      className={'products-list'}
      size='small'
      rowKey='index'
      dataSource={dataSource}
      header={
        <Row className='section-space-field'>
          <Col sm={6}>
            <b className='center-flex-div'>Codigo</b>
          </Col>
          <Col sm={9}>
            <b className='center-flex-div'>Descripcion</b>
          </Col>
          <Col sm={3}>
            <b className='center-flex-div'>Stock Actual</b>
          </Col>
          <Col sm={5}>
            <b className='center-flex-div'>Nuevo Stock</b>
          </Col>
          <Col sm={1}></Col>
        </Row>
      }
      renderItem={(row, index) => (
        <List.Item>
          <Row gutter={16} className='list-item-padding w-100 list-item-row'>
            <Col sm={6}>
              <Input
                value={row.code}
                size={'large'}
                placeholder={'Codigo'}
                disabled
              />
            </Col>
            <Col sm={9}>
              <Select
                className={'single-select'}
                placeholder={'Descripcion'}
                size={'large'}
                style={{ width: '100%', height: '40px' }}
                getPopupContainer={trigger => trigger.parentNode}
                showSearch
                onSearch={debounce(handleSearchProduct, 400)}
                value={row.id}
                onChange={value => handleChangeDetail('id', value, index)}
                loading={loading === 'productsOptionsList'}
                optionFilterProp='children'
                disabled={forbidEdition}
              >
                {productsOptionsList.length > 0 ? (
                  productsOptionsList?.map(value => (
                    <Option key={value.id} value={value.id}>
                      {value.description}
                    </Option>
                  ))
                ) : (
                  <Option value={row.id}>{row.description}</Option>
                )}
              </Select>
            </Col>
            <Col sm={4}>
              <Input
                placeholder={'Stock Actual'}
                size={'large'}
                value={row.preview_stock}
                onChange={e =>
                  handleChangeDetail('preview_stock', e.target.value, index)
                }
                min={1}
                type='tel'
                disabled={true}
              />
            </Col>
            <Col sm={4}>
              <Input
                placeholder={'Nuevo Stock'}
                value={row.next_stock}
                type='tel'
                onChange={e =>
                  handleChangeDetail('next_stock', e.target.value, index)
                }
                disabled={forbidEdition}
              />
            </Col>
            <Col sm={1}>
              {!forbidEdition && (
                <Popconfirm
                  title={'¿Seguro de eliminar?'}
                  onConfirm={() => handleRemoveDetail(index)}
                >
                  <span className='delete-btn'>
                    <DeleteOutlined />
                  </span>
                </Popconfirm>
              )}
            </Col>
          </Row>
        </List.Item>
      )}
      footer={
        !forbidEdition && (
          <Row gutter={16} className={'section-space-field'}>
            <Col xs={24} sm={24} md={24} lg={24}>
              <Button
                type='dashed'
                className={'shop-add-turn'}
                onClick={handleAddDetail}
              >
                Agregar Detalle
              </Button>
            </Col>
            <Divider className={'divider-custom-margins-users'} />
          </Row>
        )
      }
    />
  )
}

export default InventoryMovementProductsList
