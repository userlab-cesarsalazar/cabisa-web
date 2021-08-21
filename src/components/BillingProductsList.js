import React from 'react'
import debounce from 'lodash/debounce'
import { List, Col, Input, Row, Button, Select, Popconfirm } from 'antd'
import CurrencyInput from '../components/CurrencyInput'
import { productsTypes } from '../commons/types'

const { Option } = Select

const getColumnsConfig = ({ serviceType, isEditing, isInvoiceFromSale }) => {
  const isService = serviceType === productsTypes.SERVICE
  const parentProductLabel = isService ? 'Servicio' : 'Producto'
  const showDeleteButton = !isEditing && !isInvoiceFromSale

  function getProductCol() {
    if (isService) return showDeleteButton ? 4 : 5
    else return showDeleteButton ? 6 : 7
  }

  function getProductPriceCol() {
    if (isService) return showDeleteButton ? 3 : 3
    else return showDeleteButton ? 4 : 5
  }

  // Columns config (deben sumar 24 en total):
  //   Para serviceType === 'SERVICE' && showDeleteButton:
  //     { code: 3, parentProduct: 4, parentProductPrice: 3, childProduct: 4, childProductPrice: 3, quantity: 2, subtotal: 3, deleteButton: 2 }
  //
  //   Para serviceType === 'SERVICE' && !showDeleteButton:
  //     { code: 3, parentProduct: 5, parentProductPrice: 3, childProduct: 5, childProductPrice: 3, quantity: 2, subtotal: 3 }
  //
  //   Para serviceType !== 'SERVICE' && showDeleteButton:
  //     { code: 4, parentProduct: 6, parentProductPrice: 4, quantity: 3, subtotal: 5, deleteButton: 2 }
  //
  //   Para serviceType !== 'SERVICE' && !showDeleteButton:
  //     { code: 4, parentProduct: 7, parentProductPrice: 5, quantity: 3, subtotal: 5 }
  return {
    code: { col: isService ? 3 : 4, visible: true, label: 'Codigo' },
    parentProduct: {
      col: getProductCol(),
      visible: true,
      label: parentProductLabel,
    },
    parentProductPrice: {
      col: getProductPriceCol(),
      visible: true,
      label: `Precio ${parentProductLabel} (Q)`,
    },
    childProduct: {
      col: getProductCol(),
      visible: isService,
      label: 'Producto',
    },
    childProductPrice: {
      col: getProductPriceCol(),
      visible: isService,
      label: 'Precio Producto (Q)',
    },
    quantity: { col: isService ? 2 : 3, visible: true, label: 'Cantidad' },
    subtotal: { col: isService ? 3 : 5, visible: true, label: 'Subtotal' },
    deleteButton: { col: 2, visible: showDeleteButton, label: '' },
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
  serviceType,
  loading,
  isEditing,
  isAdmin,
  ...props
}) {
  const config = getColumnsConfig({ serviceType, isEditing, isInvoiceFromSale })

  return (
    <List
      {...props}
      className={'products-list'}
      size='small'
      rowKey='index'
      dataSource={dataSource}
      header={
        <Row className={'section-space-field'}>
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
          {config.deleteButton.visible && (
            <Col sm={config.deleteButton.col}>
              <b className='center-flex-div'>{config.deleteButton.label}</b>
            </Col>
          )}
        </Row>
      }
      renderItem={(row, index) => (
        <List.Item>
          <Row gutter={16} className={'list-item-padding w-100'}>
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
                  onSearch={debounce(handleSearchProduct, 400)}
                  value={row.id}
                  onChange={value => handleChangeDetail('id', value, index)}
                  loading={loading}
                  optionFilterProp='children'
                  disabled={isEditing || isInvoiceFromSale}
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
                  disabled={!row.id || isEditing || isInvoiceFromSale}
                  onValueChange={value =>
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
                  onSearch={debounce(handleSearchChildProduct, 400)}
                  value={row.child_id}
                  onChange={value =>
                    handleChangeDetail('child_id', value, index)
                  }
                  optionFilterProp='children'
                  loading={loading}
                  disabled={!row.id || isEditing || isInvoiceFromSale}
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
                  onValueChange={value =>
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
                  type='number'
                  disabled={
                    isEditing ||
                    isInvoiceFromSale ||
                    !row.id ||
                    (serviceType === productsTypes.SERVICE && !row.child_id)
                  }
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
                  onValueChange={value =>
                    handleChangeDetail('subtotal', value, index)
                  }
                  onFocus={() => handleChangeDetail('subtotal', '', index)}
                />
              </Col>
            )}
            {config.deleteButton.visible && (
              <Col sm={config.deleteButton.col} className='center-flex-div'>
                <Popconfirm
                  title={'¿Seguro de eliminar?'}
                  onConfirm={() => handleRemoveDetail(index)}
                >
                  <span style={{ color: 'red', cursor: 'pointer' }}>
                    Eliminar
                  </span>
                </Popconfirm>
              </Col>
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
