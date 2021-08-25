import React from 'react'
import debounce from 'lodash/debounce'
import { List, Col, Input, Row, Button, Select, Popconfirm } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import CurrencyInput from '../components/CurrencyInput'
import Tag from '../components/Tag'
import { documentsServiceType } from '../commons/types'

const { Option } = Select

const getColumnsConfig = () => {
  return {
    serviceType: { col: 3, visible: true, label: 'Tipo de Servicio' },
    code: { col: 4, visible: true, label: 'Codigo' },
    parentProduct: {
      col: 4,
      visible: true,
      label: 'Servicio',
    },
    parentProductPrice: {
      col: 2,
      visible: true,
      label: 'Precio Servicio (Q)',
    },
    childProduct: {
      col: 4,
      visible: true,
      label: 'Producto',
    },
    childProductPrice: {
      col: 2,
      visible: true,
      label: 'Precio Producto (Q)',
    },
    quantity: { col: 2, visible: true, label: 'Cantidad' },
    subtotal: { col: 3, visible: true, label: 'Subtotal' },
  }
}

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
  const config = getColumnsConfig()
  const showDeleteButton = !isEditing && !isInvoiceFromSale

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
          {config.serviceType.visible && (
            <Col sm={config.serviceType.col}>
              <b className='center-flex-div'>{config.serviceType.label}</b>
            </Col>
          )}
          {config.code.visible && (
            <Col sm={config.code.col}>
              <b className='center-flex-div'>{config.code.label}</b>
            </Col>
          )}
          {config.parentProduct.visible && (
            <Col sm={config.parentProduct.col}>
              <b className='center-flex-div'>{config.parentProduct.label}</b>
            </Col>
          )}
          {config.parentProductPrice.visible && (
            <Col sm={config.parentProductPrice.col}>
              <b className='center-flex-div'>
                {config.parentProductPrice.label}
              </b>
            </Col>
          )}
          {config.childProduct.visible && (
            <Col sm={config.childProduct.col}>
              <b className='center-flex-div'>{config.childProduct.label}</b>
            </Col>
          )}
          {config.childProductPrice.visible && (
            <Col sm={config.childProductPrice.col}>
              <b className='center-flex-div'>
                {config.childProductPrice.label}
              </b>
            </Col>
          )}
          {config.quantity.visible && (
            <Col sm={config.quantity.col}>
              <b className='center-flex-div'>{config.quantity.label}</b>
            </Col>
          )}
          {config.subtotal.visible && (
            <Col sm={config.subtotal.col}>
              <b className='center-flex-div'>{config.subtotal.label}</b>
            </Col>
          )}
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
            {config.serviceType.visible && (
              <Col sm={config.serviceType.col}>
                <Select
                  className={'single-select'}
                  placeholder={'Elegir tipo servicio'}
                  size={'large'}
                  style={{ width: '100%', height: '40px' }}
                  getPopupContainer={trigger => trigger.parentNode}
                  onChange={value =>
                    handleChangeDetail('service_type', value, index)
                  }
                  value={row.service_type}
                  disabled={isEditing || isInvoiceFromSale}
                >
                  {serviceTypesOptionsList?.length > 0 ? (
                    serviceTypesOptionsList.map(value => (
                      <Option key={value} value={value}>
                        <Tag type='documentsServiceType' value={value} />
                      </Option>
                    ))
                  ) : (
                    <Option value={row.service_type}>
                      <Tag
                        type='documentsServiceType'
                        value={row.service_type}
                      />
                    </Option>
                  )}
                </Select>
              </Col>
            )}
            {config.code.visible && (
              <Col sm={config.code.col}>
                <Input
                  className='product-list-input'
                  value={row.code}
                  size={'large'}
                  placeholder={config.code.label}
                  disabled
                />
              </Col>
            )}
            {config.parentProduct.visible && (
              <Col sm={config.parentProduct.col}>
                <Select
                  className={'single-select'}
                  placeholder={config.parentProduct.label}
                  size={'large'}
                  style={{ width: '100%', height: '40px' }}
                  getPopupContainer={trigger => trigger.parentNode}
                  showSearch
                  onSearch={debounce(handleSearchProduct(index), 400)}
                  value={row.id}
                  onChange={value => handleChangeDetail('id', value, index)}
                  loading={loading}
                  optionFilterProp='children'
                  disabled={
                    row.service_type !== documentsServiceType.SERVICE ||
                    isEditing ||
                    isInvoiceFromSale
                  }
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
            )}
            {config.parentProductPrice.visible && (
              <Col sm={config.parentProductPrice.col}>
                <CurrencyInput
                  className='product-list-input'
                  placeholder={config.parentProductPrice.label}
                  value={row.parent_unit_price}
                  disabled={
                    row.service_type !== documentsServiceType.SERVICE ||
                    !row.id ||
                    isEditing ||
                    isInvoiceFromSale
                  }
                  onChange={value =>
                    handleChangeDetail('parent_unit_price', value, index)
                  }
                  onFocus={() =>
                    handleChangeDetail('parent_unit_price', '', index)
                  }
                  onBlur={() =>
                    handleBlurDetail('parent_unit_price', '', index)
                  }
                />
              </Col>
            )}
            {config.childProduct.visible && (
              <Col sm={config.childProduct.col}>
                <Select
                  className={'single-select'}
                  placeholder={config.childProduct.label}
                  size={'large'}
                  style={{ width: '100%', height: '40px' }}
                  getPopupContainer={trigger => trigger.parentNode}
                  showSearch
                  onSearch={debounce(handleSearchChildProduct(index), 400)}
                  value={row.child_id}
                  onChange={value =>
                    handleChangeDetail('child_id', value, index)
                  }
                  optionFilterProp='children'
                  loading={loading}
                  disabled={
                    !row.service_type ||
                    (!row.id &&
                      row.service_type === documentsServiceType.SERVICE) ||
                    isEditing ||
                    isInvoiceFromSale
                  }
                >
                  {childProductsOptionsList?.length > 0 ? (
                    childProductsOptionsList.map(value => (
                      <Option key={value.id} value={value.id}>
                        {value.description}
                      </Option>
                    ))
                  ) : (
                    <Option value={row.child_id}>
                      {row.child_description}
                    </Option>
                  )}
                </Select>
              </Col>
            )}
            {config.childProductPrice.visible && (
              <Col sm={config.childProductPrice.col}>
                <CurrencyInput
                  className='product-list-input'
                  placeholder={config.childProductPrice.label}
                  value={row.child_unit_price}
                  disabled={!row.child_id || isEditing || isInvoiceFromSale}
                  onChange={value =>
                    handleChangeDetail('child_unit_price', value, index)
                  }
                  onFocus={() =>
                    handleChangeDetail('child_unit_price', '', index)
                  }
                  onBlur={_ => handleBlurDetail('child_unit_price', '', index)}
                />
              </Col>
            )}
            {config.quantity.visible && (
              <Col sm={config.quantity.col}>
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
                  disabled={isEditing || isInvoiceFromSale || !row.child_id}
                />
              </Col>
            )}
            {config.subtotal.visible && (
              <Col sm={config.subtotal.col}>
                <CurrencyInput
                  className='product-list-input'
                  placeholder={config.subtotal.label}
                  value={row.subtotal}
                  disabled
                  onChange={value =>
                    handleChangeDetail('subtotal', value, index)
                  }
                  onFocus={() => handleChangeDetail('subtotal', '', index)}
                />
              </Col>
            )}
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
        !isEditing &&
        !isInvoiceFromSale && (
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
        )
      }
    />
  )
}

export default BillingProductsList
