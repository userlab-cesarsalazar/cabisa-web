import React, { useEffect, useState } from 'react'
import debounce from 'lodash/debounce'
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
import { useEditableList } from '../../../hooks'
import {
  showErrors,
  roundNumber,
  getPercent,
  validateDynamicTableProducts,
} from '../../../utils'
import billingSrc from '../billingSrc'
import FooterButtons from '../../../components/FooterButtons'

const { Title } = Typography
const { Option } = Select
const { TextArea } = Input

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

function BillingFields({ setLoading, editData, isInvoiceFromSale, ...props }) {
  const [stakeholdersOptionsList, setStakeholdersOptionsList] = useState([])
  const [productsOptionsList, setProductsOptionsList] = useState([])
  const [projectsOptionsList, setProjectsOptionsList] = useState([])
  const [data, setData] = useState({})
  const [productsData, setProductsData] = useState([])
  const [discountInputValue, setDiscountInputValue] = useState(0)

  useEffect(() => {
    if (editData && !isInvoiceFromSale) return

    setData(prevState => {
      const totals = productsData?.reduce((r, p) => {
        const discount = (r.discount || 0) + p.unit_discount * p.quantity
        const subtotal = (r.subtotal || 0) + p.unit_price * p.quantity
        const total_tax = (r.total_tax || 0) + p.unit_tax_amount * p.quantity
        const total = subtotal + total_tax

        return {
          discount: roundNumber(discount) || 0,
          subtotal: roundNumber(subtotal) || 0,
          total_tax: roundNumber(total_tax) || 0,
          total: roundNumber(total) || 0,
          credit_days: prevState.credit_days ? prevState.credit_days : 0,
        }
      }, {})

      return { ...prevState, ...totals }
    })
  }, [setData, productsData, editData, isInvoiceFromSale])

  useEffect(() => {
    if (!editData) return

    setData(editData)
    setProductsData(editData.products)
    setDiscountInputValue(editData.discount_percentage || 0)
  }, [editData])

  const updateInvoiceTotals = (field, value, rowIndex) => {
    const getProductSubtotal = (field, value, row, unit_discount) => {
      if (field === 'unit_price')
        return roundNumber(row.quantity * (value - unit_discount))

      if (field === 'quantity')
        return roundNumber(value * (row.unit_price - unit_discount))

      return 0
    }

    const product = productsOptionsList.find(option => option.id === value)

    setProductsData(prevState => {
      const row = prevState[rowIndex]
      const baseUnitPrice = product ? product.unit_price : row.base_unit_price
      const tax_fee = product ? product.tax_fee : row.tax_fee
      const unit_discount = baseUnitPrice * getPercent(discountInputValue)
      const unit_price = baseUnitPrice - unit_discount

      const newRow = {
        ...row,
        id: product ? product.id : row.id,
        code: product ? product.code : row.code,
        tax_fee,
        base_unit_price: row.base_unit_price || unit_price,
        unit_price: roundNumber(unit_price),
        unit_tax_amount: roundNumber(unit_price * getPercent(tax_fee)),
        unit_discount: roundNumber(unit_discount),
        subtotal: getProductSubtotal(field, value, row, unit_discount),
        quantity: field === 'id' ? 1 : row.quantity,
      }

      return prevState.map((prevRow, index) =>
        index === rowIndex ? newRow : prevRow
      )
    })
  }

  const {
    handleChange: handleChangeDetail,
    handleAdd: handleAddDetail,
    handleRemove: handleRemoveDetail,
  } = useEditableList({
    state: productsData,
    setState: setProductsData,
    initRow: {
      id: '',
      code: '',
      quantity: 0,
      tax_fee: 12,
      unit_price: 0,
      base_unit_price: 0,
      unit_tax_amount: 0,
      subtotal: 0,
    },
    onChange: updateInvoiceTotals,
  })

  const handleDiscountChange = e => {
    setDiscountInputValue(e?.target?.value || 0)

    setProductsData(prevState =>
      prevState.map(p => {
        const unit_discount = p.base_unit_price * getPercent(e.target.value)
        const unit_price = p.base_unit_price - unit_discount
        const unit_tax_amount = unit_price * getPercent(p.tax_fee)
        const subtotal = p.quantity * unit_price

        return {
          ...p,
          unit_price: roundNumber(unit_price),
          unit_discount: roundNumber(unit_discount),
          unit_tax_amount: roundNumber(unit_tax_amount),
          subtotal: roundNumber(subtotal),
        }
      })
    )
  }

  const handleChange = field => e => {
    const value = e?.target?.value === undefined ? e : e.target.value

    if (field === 'stakeholder_id') {
      const stakeholder = stakeholdersOptionsList.find(
        option => option.id === value
      )

      return setData(prevState => ({
        ...prevState,
        stakeholder_id: stakeholder.id,
        stakeholder_name: stakeholder.stakeholder_name,
        stakeholder_type: stakeholder.stakeholder_type,
        stakeholder_nit: stakeholder.nit,
        stakeholder_email: stakeholder.email,
        stakeholder_phone: stakeholder.phone,
        stakeholder_address: stakeholder.address,
      }))
    }

    setData(prevState => ({
      ...prevState,
      [field]: value,
    }))
  }

  const getSaveData = () => ({
    document_id: data?.id,
    stakeholder_id: data.stakeholder_id,
    project_id: data.project_id,
    payment_method: data.payment_method,
    service_type: data.service_type,
    credit_days: data.credit_days,
    total_invoice: data.total,
    description: data.description,
    products: productsData.map(p => ({
      product_id: p.id,
      product_quantity: p.quantity,
      product_price: p.unit_price,
      product_discount_percentage: discountInputValue,
      product_discount: p.unit_discount,
    })),
  })

  const validateSaveData = data => {
    const errors = []
    const requiredFields = [
      { key: 'stakeholder_id', value: 'Empresa' },
      { key: 'payment_method', value: 'Metodo de pago' },
      { key: 'project_id', value: 'Proyecto' },
      { key: 'service_type', value: 'Tipo de Servicio' },
    ]
    const requiredErrors = requiredFields.flatMap(field =>
      !data[field.key] ? field.value : []
    )
    if (requiredErrors.length > 0) {
      requiredErrors.forEach(k => {
        errors.push(`El campo ${k} es obligatorio`)
      })
    }
    const productsRequiredFields = ['product_quantity', 'product_price']

    const productErrors = validateDynamicTableProducts(
      data.products,
      productsRequiredFields
    )

    if (productErrors.required.length > 0) {
      errors.push(
        `Los campos Precio y Cantidad de los productos en posicion ${productErrors.required.join(
          ', '
        )} deben ser mayor a cero`
      )
    }

    Object.keys(productErrors.duplicate).forEach(k => {
      if (productErrors.duplicate[k]?.length > 1) {
        errors.push(
          `Los productos en posicion ${productErrors.duplicate[k].join(
            ', '
          )} no pueden estar duplicados`
        )
      }
    })

    if (discountInputValue < 0) {
      errors.push(
        `El campo Descuento (%) debe contener un valor mayor o igual a cero`
      )
    }

    return {
      isInvalid: errors.length > 0,
      error: {
        message: errors,
      },
    }
  }

  const saveData = () => {
    const saveData = getSaveData()

    const { isInvalid, error } = validateSaveData(saveData)

    if (isInvalid) return showErrors(error)

    props.handleSaveData(saveData)
  }

  const handleSearchStakeholder = stakeholder_name => {
    if (stakeholder_name === '') return

    const params = {
      name: { $like: `%25${stakeholder_name}%25` },
    }

    setLoading(true)

    billingSrc
      .getStakeholdersOptions(params)
      .then(stakeholders => setStakeholdersOptionsList(stakeholders))
      .catch(error => showErrors(error))
      .finally(() => setLoading(false))
  }

  const handleSearchProduct = description => {
    if (description === '') return

    const params = {
      stock: { $gt: 0 },
      description: { $like: `%25${description}%25` },
    }

    setLoading(true)

    billingSrc
      .getProductsOptions(params)
      .then(data => setProductsOptionsList(data))
      .catch(error => showErrors(error))
      .finally(() => setLoading(false))
  }

  const handleSearchProject = name => {
    if (name === '' || !data.stakeholder_id) return

    const params = {
      stakeholder_id: data.stakeholder_id,
      name: { $like: `%25${name}%25` },
    }

    setLoading(true)

    billingSrc
      .getProjectsOptions(params)
      .then(data => setProjectsOptionsList(data))
      .catch(error => showErrors(error))
      .finally(() => setLoading(false))
  }

  const columnsDynamicTable = getColumnsDynamicTable({
    edit: props.edit,
    handleRemoveDetail,
    handleChangeDetail,
    handleSearchProduct,
    productsOptionsList,
    isInvoiceFromSale,
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
              disabled={props.edit || isInvoiceFromSale}
              className={'single-select'}
              placeholder={'Buscar cliente'}
              size={'large'}
              style={{ width: '100%' }}
              getPopupContainer={trigger => trigger.parentNode}
              optionFilterProp='children'
              showSearch
              onSearch={debounce(handleSearchStakeholder, 400)}
              onChange={handleChange('stakeholder_id')}
              value={data.stakeholder_id}
            >
              {stakeholdersOptionsList?.length > 0 ? (
                stakeholdersOptionsList.map(value => (
                  <Option key={value.id} value={value.id}>
                    {value.name}
                  </Option>
                ))
              ) : (
                <Option value={data.stakeholder_id}>
                  {data.stakeholder_name}
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
              value={data.stakeholder_nit}
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
              value={data.stakeholder_type}
              disabled
            >
              {props.stakeholderTypesOptionsList?.length > 0 ? (
                props.stakeholderTypesOptionsList.map(value => (
                  <Option key={value} value={value}>
                    <Tag type='stakeholderTypes' value={value} />
                  </Option>
                ))
              ) : (
                <Option value={data.stakeholder_type}>
                  <Tag type='stakeholderTypes' value={data.stakeholder_type} />
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
              value={data.stakeholder_email}
              disabled
            />
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Telefono</div>
            <Input
              placeholder={'Escribir telefono'}
              size={'large'}
              style={{ height: '40px' }}
              value={data.stakeholder_phone}
              disabled
            />
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Direccion</div>
            <Input
              placeholder={'Escribir direccion'}
              size={'large'}
              style={{ height: '40px' }}
              value={data.stakeholder_address}
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
              onSearch={debounce(handleSearchProject, 400)}
              value={data.project_id}
              onChange={handleChange('project_id')}
              loading={props.loading}
              optionFilterProp='children'
              disabled={props.edit || isInvoiceFromSale || !data.stakeholder_id}
            >
              {projectsOptionsList?.length > 0 ? (
                projectsOptionsList.map(value => (
                  <Option key={value.id} value={value.id}>
                    {value.name}
                  </Option>
                ))
              ) : (
                <Option value={data.project_id}>{data.project_name}</Option>
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
              onChange={handleChange('service_type')}
              value={data.service_type}
              disabled={props.edit}
            >
              {props.serviceTypesOptionsList?.length > 0 ? (
                props.serviceTypesOptionsList.map(value => (
                  <Option key={value} value={value}>
                    <Tag type='documentsServiceType' value={value} />
                  </Option>
                ))
              ) : (
                <Option value={data.service_type}>
                  <Tag type='documentsServiceType' value={data.service_type} />
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
              onChange={handleChange('payment_method')}
              value={data.payment_method}
              disabled={props.edit}
            >
              {props.paymentMethodsOptionsList?.length > 0 ? (
                props.paymentMethodsOptionsList.map(value => (
                  <Option key={value} value={value}>
                    <Tag type='documentsPaymentMethods' value={value} />
                  </Option>
                ))
              ) : (
                <Option value={data.payment_method}>
                  <Tag
                    type='documentsPaymentMethods'
                    value={data.payment_method}
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
            {!props.edit || data.credit_days ? (
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
                  onChange={handleChange('credit_days')}
                  value={data.credit_days}
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
                    <Option value={data.credit_days}>{data.credit_days}</Option>
                  )}
                </Select>
              </>
            ) : null}
          </Col>
          <Col
            xs={6}
            sm={6}
            md={6}
            lg={7}
            style={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            {!props.edit || discountInputValue ? (
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
                  onChange={handleDiscountChange}
                  value={discountInputValue}
                  disabled={props.edit}
                />
              </>
            ) : null}
          </Col>
        </Row>

        <Divider className={'divider-custom-margins-users'} />

        <DynamicTable columns={columnsDynamicTable} data={productsData} />

        {!props.edit && !isInvoiceFromSale && (
          <Row gutter={16} className={'section-space-list'}>
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
        )}

        <Divider className={'divider-custom-margins-users'} />

        <Row gutter={16} style={{ textAlign: 'right' }} justify='end'>
          <Col span={6} style={{ textAlign: 'right' }}>
            {!props.edit || data.discount ? (
              <div className={'title-space-field'}>
                <Statistic title='Descuento :' value={data.discount} />
              </div>
            ) : null}
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            <div className={'title-space-field'}>
              <Statistic title='Subtotal :' value={data.subtotal} />
            </div>
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            <div className={'title-space-field'}>
              <Statistic title='Impuesto :' value={data.total_tax} />
            </div>
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            <div className={'title-space-field'}>
              <Statistic title='Total :' value={data.total} />
            </div>
          </Col>
        </Row>

        <Divider className={'divider-custom-margins-users'} />
      </div>

      <Row gutter={16} className={'section-space-field'}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <div className={'title-space-field'}>
            <b>Descripcion</b>
          </div>
          <TextArea
            rows={4}
            value={data.description}
            onChange={handleChange('description')}
            disabled={props.edit}
          />
        </Col>
      </Row>

      {!props.edit && (
        <FooterButtons
          saveData={saveData}
          edit={props.edit}
          cancelLink={props.cancelLink}
          loading={props.loading}
        />
      )}
    </>
  )
}
export default BillingFields
