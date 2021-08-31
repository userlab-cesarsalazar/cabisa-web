import React from 'react'
import debounce from 'lodash/debounce'
import { List, Col, Input, Row, Button, Select, Popconfirm } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import CurrencyInput from '../../../components/CurrencyInput'

const { Option } = Select

function BillingProductsList({
  dataSource,
  handleAddDetail,
  handleChangeDetail,
  handleRemoveDetail,
  handleBlurDetail,
  handleSearchProduct,
  productsOptionsList,
  handleSearchChildProduct,
  childProductsOptionsList,
  isInvoiceFromSale,
  loading,
  isEditing,
  isAdmin,
  serviceTypesOptionsList,
  ...props
}) {
  const showDeleteButton = true

  return (
    <List
      {...props}
      className={'products-list'}
      size='small'
      rowKey='index'
      dataSource={dataSource}
      header={
        <Row
          className={`section-space-field ${
            showDeleteButton ? 'show-delete-btn' : ''
          }`}
        >
          <Col sm={4}>
            <b className='center-flex-div'>Codigo</b>
          </Col>
          <Col sm={6}>
            <b className='center-flex-div'>Producto</b>
          </Col>
          <Col sm={5}>
            <b className='center-flex-div'>Costo Producto (Q)</b>
          </Col>
          <Col sm={4}>
            <b className='center-flex-div'>Cantidad</b>
          </Col>
          <Col sm={5}>
            <b className='center-flex-div'>Subtotal (Q)</b>
          </Col>
        </Row>
      }
      renderItem={(row, index) => (
        <List.Item>
          <Row
            gutter={16}
            className={`list-item-padding w-100 list-item-row ${
              showDeleteButton ? 'show-delete-btn' : ''
            }`}
          >
            <Col sm={4}>
              <Input
                className='product-list-input'
                value={row.code}
                size={'large'}
                placeholder='Codigo'
                disabled
              />
            </Col>
            <Col sm={6}>
              <Select
                className={'single-select'}
                placeholder='Producto'
                size={'large'}
                style={{ width: '100%', height: '40px' }}
                getPopupContainer={trigger => trigger.parentNode}
                showSearch
                onSearch={debounce(handleSearchProduct, 400)}
                value={row.id}
                onChange={value => handleChangeDetail('id', value, index)}
                loading={loading}
                optionFilterProp='children'
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
            <Col sm={5}>
              <CurrencyInput
                className='product-list-input'
                placeholder='Costo Producto (Q)'
                value={row.parent_unit_price}
                onChange={value =>
                  handleChangeDetail('parent_unit_price', value, index)
                }
                onFocus={() =>
                  handleChangeDetail('parent_unit_price', '', index)
                }
                onBlur={() => handleBlurDetail('parent_unit_price', '', index)}
                disabled
              />
            </Col>

            <Col sm={4}>
              <Input
                className='product-list-input'
                placeholder={'Cantidad'}
                size={'large'}
                value={row.quantity}
                onChange={e =>
                  handleChangeDetail('quantity', e.target.value, index)
                }
                min={1}
                type='tel'
                disabled={!row.id}
              />
            </Col>
            <Col sm={5}>
              <CurrencyInput
                className='product-list-input'
                value={row.subtotal}
                disabled
                onChange={value => handleChangeDetail('subtotal', value, index)}
              />
            </Col>

            {showDeleteButton && (
              <Popconfirm
                title={'¿Seguro de eliminar?'}
                onConfirm={() => handleRemoveDetail(index)}
              >
                <span className='delete-btn'>
                  <DeleteOutlined />
                </span>
              </Popconfirm>
            )}
          </Row>
        </List.Item>
      )}
      footer={
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
        </Row>
      }
    />
  )
}

export default BillingProductsList
