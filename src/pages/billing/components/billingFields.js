import React from 'react'
import {
  Button,
  Col,
  Divider,
  Input,
  Popconfirm,
  Row,
  Select,
  Statistic,
  Typography,
} from 'antd'
import DynamicTable from '../../../components/DynamicTable'
import Tag from '../../../components/Tag'
import debounce from 'lodash/debounce'

const { Title } = Typography
const { Option } = Select

const getColumnsDynamicTable = ({
  edit,
  loading,
  handleRemoveDetail,
  handleChangeDetail,
  handleSearchProduct,
  productsOptionsList,
  isInvoiceFromSale,
}) => [
  {
    title: 'Codigo',
    dataIndex: 'code', // Field that is goint to be rendered
    key: 'code',
    render: (_, record) => (
      <Input
        value={record.code}
        size={'large'}
        placeholder={'Codigo'}
        style={{ minWidth: '120px' }}
        disabled
      />
    ),
  },
  {
    width: '30%',
    title: 'Descripcion',
    dataIndex: 'id', // Field that is goint to be rendered
    key: 'id',
    render: (_, record, rowIndex) => (
      <Select
        className={'single-select'}
        placeholder={'Descripcion'}
        size={'large'}
        style={{ width: '100%', height: '40px' }}
        getPopupContainer={trigger => trigger.parentNode}
        showSearch
        onSearch={debounce(handleSearchProduct, 400)}
        value={record.id}
        onChange={value => handleChangeDetail('id', value, rowIndex)}
        loading={loading}
        optionFilterProp='children'
        disabled={edit || isInvoiceFromSale}
      >
        {productsOptionsList?.length > 0 ? (
          productsOptionsList.map(value => (
            <Option key={value.id} value={value.id}>
              {value.description}
            </Option>
          ))
        ) : (
          <Option value={record.id}>{record.description}</Option>
        )}
      </Select>
    ),
  },
  {
    title: 'Precio Unitario',
    dataIndex: 'unit_price', // Field that is goint to be rendered
    key: 'unit_price',
    render: (_, record, rowIndex) => (
      <Input
        style={{ minWidth: '80px' }}
        type={'number'}
        value={edit ? record.product_price : record.unit_price}
        size={'large'}
        placeholder={'Precio unitario'}
        onChange={event =>
          handleChangeDetail('unit_price', event.target.value, rowIndex)
        }
        disabled
      />
    ),
  },
  {
    title: 'Cantidad',
    dataIndex: 'quantity', // Field that is goint to be rendered
    key: 'quantity',
    render: (_, record, rowIndex) => (
      <Input
        style={{ minWidth: '40px' }}
        disabled={edit || isInvoiceFromSale}
        type={'number'}
        value={edit ? record.product_quantity : record.quantity}
        size={'large'}
        placeholder={'Cantidad'}
        onChange={event =>
          handleChangeDetail('quantity', event.target.value, rowIndex)
        }
        min={0}
      />
    ),
  },
  {
    title: 'Subtotal',
    dataIndex: 'subtotal', // Field that is goint to be rendered
    key: 'subtotal',
    render: (_, record) => (
      <Input
        style={{ minWidth: '80px' }}
        disabled
        type={'number'}
        size={'large'}
        placeholder={'Subtotal'}
        value={record.subtotal}
      />
    ),
  },
  {
    title: '',
    dataIndex: 'id',
    render: (_, __, rowIndex) =>
      !edit &&
      !isInvoiceFromSale && (
        <Popconfirm
          disabled={edit}
          title={'¿Seguro de eliminar?'}
          onConfirm={() => handleRemoveDetail(rowIndex)}
        >
          <span style={{ color: 'red' }}>Eliminar</span>
        </Popconfirm>
      ),
  },
]

function BillingFields(props) {
  const columnsDynamicTable = getColumnsDynamicTable({
    edit: props.edit,
    handleRemoveDetail: props.editableList?.handleRemove,
    handleChangeDetail: props.editableList?.handleChange,
    handleSearchProduct: props.handleSearchProduct,
    productsOptionsList: props.productsOptionsList,
    isInvoiceFromSale: props.isInvoiceFromSale,
  })

  return (
    <>
      <div>
        {props.edit && (
          <>
            <Row>
              <Col xs={24} sm={24} md={12} lg={12}>
                <Title>{props.edit ? 'Factura' : 'Nueva Factura'}</Title>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={12}
                lg={12}
                style={{ textAlign: 'right' }}
              >
                <Button className='title-cabisa new-button'>
                  Serie No. A-12312
                </Button>
              </Col>
            </Row>
            <Divider className={'divider-custom-margins-users'} />
          </>
        )}
        {/*Fields section*/}
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Selecciona Cliente</div>
            <Select
              disabled={props.edit || props.isInvoiceFromSale}
              className={'single-select'}
              placeholder={'Buscar cliente'}
              size={'large'}
              style={{ width: '100%' }}
              getPopupContainer={trigger => trigger.parentNode}
              optionFilterProp='children'
              showSearch
              onSearch={debounce(props.handleSearchStakeholder, 400)}
              onChange={props.handleChange('stakeholder_id')}
              value={props.data.stakeholder_id}
            >
              {props.stakeholdersOptionsList?.length > 0 ? (
                props.stakeholdersOptionsList.map(value => (
                  <Option key={value.id} value={value.id}>
                    {value.name}
                  </Option>
                ))
              ) : (
                <Option value={props.data.stakeholder_id}>
                  {props.data.stakeholder_name}
                </Option>
              )}
            </Select>
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>NIT</div>
            <Input
              placeholder={'Escribir NIT'}
              size={'large'}
              style={{ height: '40px' }}
              value={props.data.stakeholder_nit}
              disabled
            />
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Tipo de cliente</div>
            <Select
              className={'single-select'}
              placeholder={'Elegir tipo'}
              size={'large'}
              style={{ width: '100%' }}
              getPopupContainer={trigger => trigger.parentNode}
              value={props.data.stakeholder_type}
              disabled
            >
              {props.stakeholderTypesOptionsList?.length > 0 ? (
                props.stakeholderTypesOptionsList.map(value => (
                  <Option key={value} value={value}>
                    <Tag type='stakeholderTypes' value={value} />
                  </Option>
                ))
              ) : (
                <Option value={props.data.stakeholder_type}>
                  <Tag
                    type='stakeholderTypes'
                    value={props.data.stakeholder_type}
                  />
                </Option>
              )}
            </Select>
          </Col>
        </Row>
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Email</div>
            <Input
              placeholder={'Escribir email'}
              size={'large'}
              type={'email'}
              style={{ height: '40px' }}
              value={props.data.stakeholder_email}
              disabled
            />
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Telefono</div>
            <Input
              placeholder={'Escribir telefono'}
              size={'large'}
              style={{ height: '40px' }}
              value={props.data.stakeholder_phone}
              disabled
            />
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Direccion</div>
            <Input
              placeholder={'Escribir direccion'}
              size={'large'}
              style={{ height: '40px' }}
              value={props.data.stakeholder_address}
              disabled
            />
          </Col>
        </Row>
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Proyecto</div>
            <Select
              className={'single-select'}
              placeholder={'Proyecto'}
              size={'large'}
              style={{ width: '100%', height: '40px' }}
              getPopupContainer={trigger => trigger.parentNode}
              showSearch
              onSearch={debounce(props.handleSearchProject, 400)}
              value={props.data.project_id}
              onChange={props.handleChange('project_id')}
              loading={props.loading}
              optionFilterProp='children'
              disabled={props.edit || props.isInvoiceFromSale}
            >
              {props.projectsOptionsList?.length > 0 ? (
                props.projectsOptionsList.map(value => (
                  <Option key={value.id} value={value.id}>
                    {value.name}
                  </Option>
                ))
              ) : (
                <Option value={props.data.project_id}>
                  {props.data.project_name}
                </Option>
              )}
            </Select>
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Tipo de servicio</div>
            <Select
              className={'single-select'}
              placeholder={'Elegir tipo servicio'}
              size={'large'}
              style={{ width: '100%', height: '40px' }}
              getPopupContainer={trigger => trigger.parentNode}
              onChange={props.handleChange('service_type')}
              value={props.data.service_type}
              disabled={props.edit}
            >
              {props.serviceTypesOptionsList?.length > 0 ? (
                props.serviceTypesOptionsList.map(value => (
                  <Option key={value} value={value}>
                    <Tag type='documentsServiceType' value={value} />
                  </Option>
                ))
              ) : (
                <Option value={props.data.service_type}>
                  <Tag
                    type='documentsServiceType'
                    value={props.data.service_type}
                  />
                </Option>
              )}
            </Select>
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Metodo de pago</div>
            <Select
              className={'single-select'}
              placeholder={'Metodo de pago'}
              size={'large'}
              style={{ width: '100%', height: '40px' }}
              getPopupContainer={trigger => trigger.parentNode}
              onChange={props.handleChange('payment_method')}
              value={props.data.payment_method}
              disabled={props.edit}
            >
              {props.paymentMethodsOptionsList?.length > 0 ? (
                props.paymentMethodsOptionsList.map(value => (
                  <Option key={value} value={value}>
                    <Tag type='documentsPaymentMethods' value={value} />
                  </Option>
                ))
              ) : (
                <Option value={props.data.payment_method}>
                  <Tag
                    type='documentsPaymentMethods'
                    value={props.data.payment_method}
                  />
                </Option>
              )}
            </Select>
          </Col>
        </Row>
        {/*End Fields section*/}
        <Divider className={'divider-custom-margins-users'} />
        <Row
          gutter={16}
          className={'section-space-list'}
          justify='space-between'
          align='middle'
        >
          <Col xs={12} sm={12} md={12} lg={10}>
            <h1>Detalle Factura</h1>
          </Col>
          <Col
            xs={6}
            sm={6}
            md={6}
            lg={7}
            style={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            {(!props.edit || props.discountInputValue) && (
              <>
                <div
                  style={{
                    marginRight: '15px',
                    marginTop: '10px',
                    minWidth: '120px',
                  }}
                  className={'title-space-field'}
                >
                  <b>Dias de credito:</b>
                </div>
                <Select
                  className={'single-select'}
                  placeholder={'Dias de credito'}
                  size={'large'}
                  style={{ width: '100%', height: '40px', maxWidth: '150px' }}
                  getPopupContainer={trigger => trigger.parentNode}
                  onChange={props.handleChange('credit_days')}
                  value={props.data.credit_days}
                  disabled={props.edit}
                >
                  {props.creditDaysOptionsList?.length > 0 ? (
                    <>
                      <Option value={0}>0</Option>
                      {props.creditDaysOptionsList.map(value => (
                        <Option key={value} value={value}>
                          {value}
                        </Option>
                      ))}
                    </>
                  ) : (
                    <Option value={props.data.credit_days}>
                      {props.data.credit_days}
                    </Option>
                  )}
                </Select>
              </>
            )}
          </Col>
          <Col
            xs={6}
            sm={6}
            md={6}
            lg={7}
            style={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            {(!props.edit || props.discountInputValue) && (
              <>
                <div
                  style={{
                    marginRight: '15px',
                    marginTop: '10px',
                    minWidth: '120px',
                  }}
                  className={'title-space-field'}
                >
                  <b>Descuento (%):</b>
                </div>
                <Input
                  type={'number'}
                  placeholder={'Aplicar Descuento'}
                  size={'large'}
                  style={{
                    height: '40px',
                    width: '75%',
                    minWidth: '100px',
                    maxWidth: '150px',
                  }}
                  min={0}
                  onChange={props.handleDiscountChange}
                  value={props.discountInputValue}
                  disabled={props.edit}
                />
              </>
            )}
          </Col>
        </Row>

        <Divider className={'divider-custom-margins-users'} />

        <DynamicTable columns={columnsDynamicTable} data={props.productsData} />

        {!props.edit && !props.isInvoiceFromSale && (
          <Row gutter={16} className={'section-space-list'}>
            <Col xs={24} sm={24} md={24} lg={24}>
              <Button
                disabled={props.edit}
                type='dashed'
                className={'shop-add-turn'}
                onClick={props.editableList?.handleAdd}
              >
                Agregar Detalle
              </Button>
            </Col>
          </Row>
        )}
        <Divider className={'divider-custom-margins-users'} />
        <Row gutter={16} style={{ textAlign: 'right' }} justify='end'>
          <Col span={6} style={{ textAlign: 'right' }}>
            {!props.edit || props.data.discount ? (
              <div className={'title-space-field'}>
                <Statistic title='Descuento :' value={props.data.discount} />
              </div>
            ) : null}
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            <div className={'title-space-field'}>
              <Statistic title='Subtotal :' value={props.data.subtotal} />
            </div>
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            <div className={'title-space-field'}>
              <Statistic title='Impuesto :' value={props.data.total_tax} />
            </div>
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            <div className={'title-space-field'}>
              <Statistic title='Total :' value={props.data.total} />
            </div>
          </Col>
        </Row>
        <Divider className={'divider-custom-margins-users'} />
      </div>
    </>
  )
}
export default BillingFields
