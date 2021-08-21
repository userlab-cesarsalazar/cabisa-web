import React from 'react'
import debounce from 'lodash/debounce'
import { List, Col, Input, Row, Button, Select, Popconfirm } from 'antd'
import CurrencyInput from '../components/CurrencyInput'
import { productsTypes } from '../commons/types'

const { Option } = Select

const getColumnsConfig = ({ serviceType }) => {
  const isService = serviceType === productsTypes.SERVICE
  const parentProductLabel = isService ? 'Servicio' : 'Producto'

  // Columns config (deben sumar 24 en total):
  //   Para serviceType === 'SERVICE':
  //     { code: 3, parentProduct: 4, parentProductPrice: 3, childProduct: 4, childProductPrice: 3, quantity: 2, subtotal: 3, deleteButton: 2 }
  //
  //   Para serviceType !== 'SERVICE':
  //     { code: 4, parentProduct: 6, parentProductPrice: 4, quantity: 3, subtotal: 5, deleteButton: 2 }
  return {
    code: { col: isService ? 3 : 4, visible: true, label: 'Codigo' },
    parentProduct: {
      col: isService ? 4 : 6,
      visible: true,
      label: parentProductLabel,
    },
    parentProductPrice: {
      col: isService ? 3 : 4,
      visible: true,
      label: `Precio ${parentProductLabel} (Q)`,
    },
    childProduct: {
      col: 4,
      visible: isService,
      label: 'Producto',
    },
    childProductPrice: {
      col: 3,
      visible: isService,
      label: 'Precio Producto (Q)',
    },
    quantity: { col: isService ? 2 : 3, visible: true, label: 'Cantidad' },
    subtotal: { col: isService ? 3 : 5, visible: true, label: 'Subtotal' },
    deleteButton: { col: 2, visible: true, label: '' },
  }
}

function SaleProductsList({
  dataSource,
  handleAddDetail,
  handleChangeDetail,
  handleRemoveDetail,
  handleSearchProduct,
  productsOptionsList,
  handleSearchChildProduct,
  childProductsOptionsList,
  serviceType,
  status,
  loading,
  isAdmin,
  forbidEdition,
  ...props
}) {
  const config = getColumnsConfig({ serviceType })

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
                  loading={
                    status === 'LOADING' && loading === 'fetchProductsOptions'
                  }
                  optionFilterProp='children'
                  disabled={forbidEdition || !isAdmin}
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
                  disabled={!row.id || forbidEdition || !isAdmin}
                  onValueChange={value =>
                    handleChangeDetail('parent_unit_price', value, index)
                  }
                  onFocus={() =>
                    handleChangeDetail('parent_unit_price', '', index)
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
                  loading={
                    status === 'LOADING' &&
                    loading === 'fetchChildProductsOptions'
                  }
                  disabled={!row.id || forbidEdition || !isAdmin}
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
                  disabled={!row.child_id || forbidEdition || !isAdmin}
                  onValueChange={value =>
                    handleChangeDetail('child_unit_price', value, index)
                  }
                  onFocus={() =>
                    handleChangeDetail('child_unit_price', '', index)
                  }
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
                    forbidEdition ||
                    !isAdmin ||
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

export default SaleProductsList
