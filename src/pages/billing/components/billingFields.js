import React, { useEffect, useState, useCallback } from 'react'
import debounce from 'lodash/debounce'
import {
  Button,
  Col,
  Divider,
  Input,
  message,
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
import {
  appConfig,
  documentsServiceType,
  productsTypes,
} from '../../../commons/types'

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
  handleSearchChildProduct,
  childProductsOptionsList,
  isInvoiceFromSale,
  serviceType,
}) => {
  const leftColumns = [
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
  ]

  const rightColumns = [
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
          type={'number'}
          value={edit ? record.product_quantity : record.quantity}
          size={'large'}
          placeholder={'Cantidad'}
          onChange={event =>
            handleChangeDetail('quantity', event.target.value, rowIndex)
          }
          min={1}
          disabled={
            edit ||
            isInvoiceFromSale ||
            (serviceType === productsTypes.SERVICE &&
              (!record.id || !record.child_id))
          }
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

  const productColumn = {
    width: '30%',
    title: 'Producto',
    dataIndex: 'id', // Field that is goint to be rendered
    key: 'id',
    render: (_, record, rowIndex) => (
      <Select
        className={'single-select'}
        placeholder={'Producto'}
        size={'large'}
        style={{ width: '100%', height: '40px' }}
        getPopupContainer={trigger => trigger.parentNode}
        showSearch
        onSearch={debounce(handleSearchChildProduct, 400)}
        value={record.child_id}
        onChange={value => handleChangeDetail('child_id', value, rowIndex)}
        loading={loading}
        optionFilterProp='children'
        disabled={edit || isInvoiceFromSale || !record.id}
      >
        {childProductsOptionsList?.length > 0 ? (
          childProductsOptionsList.map(value => (
            <Option key={value.id} value={value.id}>
              {value.description}
            </Option>
          ))
        ) : (
          <Option value={record.id}>{record.description}</Option>
        )}
      </Select>
    ),
  }

  return serviceType === documentsServiceType.SERVICE
    ? [...leftColumns, productColumn, ...rightColumns]
    : [...leftColumns, ...rightColumns]
}

function BillingFields({ setLoading, editData, isInvoiceFromSale, ...props }) {
  const [stakeholdersOptionsList, setStakeholdersOptionsList] = useState([])
  const [projectsOptionsList, setProjectsOptionsList] = useState([])
  const [productsOptionsList, setProductsOptionsList] = useState([])
  const [childProductsOptionsList, setChildProductsOptionsList] = useState([])
  const [data, setData] = useState({})
  const [productsData, setProductsData] = useState([])
  const [discountInputValue, setDiscountInputValue] = useState(0)

  useEffect(() => {
    if (editData && !isInvoiceFromSale) return

    setData(prevState => {
      const getProductDiscount = p =>
        data.service_type === productsTypes.SERVICE
          ? p.parent_unit_discount + p.child_unit_discount * p.quantity
          : p.unit_discount * p.quantity

      const getProductSubtotal = p =>
        data.service_type === productsTypes.SERVICE
          ? p.parent_unit_price + p.child_unit_price * p.quantity
          : p.unit_price * p.quantity

      const totals = productsData?.reduce((r, p) => {
        const discount = (r.discount || 0) + getProductDiscount(p)
        const subtotal = (r.subtotal || 0) + getProductSubtotal(p)
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
  }, [setData, productsData, editData, isInvoiceFromSale, data.service_type])

  const handleSearchStakeholder = useCallback(
    (stakeholder_name, additionalParams = {}) => {
      if (isInvoiceFromSale) return
      if (stakeholder_name === '') return

      const params = {
        name: { $like: `%25${stakeholder_name}%25` },
        ...additionalParams,
      }

      setLoading(true)

      billingSrc
        .getStakeholdersOptions(params)
        .then(stakeholders => setStakeholdersOptionsList(stakeholders))
        .catch(error => showErrors(error))
        .finally(() => setLoading(false))
    },
    [setLoading, isInvoiceFromSale]
  )

  const handleSearchProduct = useCallback(
    (product_description, additionalParams = {}) => {
      if (isInvoiceFromSale) return
      if (product_description === '') return
      if (!data.service_type && product_description !== null)
        return message.warning('Debe seleccionar el Tipo de servicio')

      const product_type =
        data.service_type === productsTypes.SERVICE
          ? productsTypes.SERVICE
          : productsTypes.PRODUCT

      const params = {
        stock: { $gt: 0 },
        description: { $like: `%25${product_description}%25` },
        product_type,
        ...additionalParams,
      }

      setLoading(true)

      billingSrc
        .getProductsOptions(params)
        .then(data => setProductsOptionsList(data))
        .catch(error => showErrors(error))
        .finally(() => setLoading(false))
    },
    [setLoading, isInvoiceFromSale, data.service_type]
  )

  const handleSearchChildProduct = useCallback(
    (product_description, additionalParams = {}) => {
      if (isInvoiceFromSale) return
      if (product_description === '') return
      if (data.service_type !== productsTypes.SERVICE) return

      const params = {
        stock: { $gt: 0 },
        description: { $like: `%25${product_description}%25` },
        product_type: productsTypes.PRODUCT,
        ...additionalParams,
      }

      setLoading(true)

      billingSrc
        .getProductsOptions(params)
        .then(data => setChildProductsOptionsList(data))
        .catch(error => showErrors(error))
        .finally(() => setLoading(false))
    },
    [setLoading, isInvoiceFromSale, data.service_type]
  )

  useEffect(() => {
    handleSearchProduct(null, {
      $limit: appConfig.selectsInitLimit,
      description: { $like: '%25%25' },
    })

    handleSearchChildProduct(null, {
      $limit: appConfig.selectsInitLimit,
      description: { $like: '%25%25' },
    })
  }, [handleSearchProduct, handleSearchChildProduct])

  useEffect(() => {
    handleSearchStakeholder(null, {
      $limit: appConfig.selectsInitLimit,
      name: { $like: '%25%25' },
    })

    if (!editData) return

    setData(editData)
    setProductsData(editData.products)
    setDiscountInputValue(editData.discount_percentage || 0)
  }, [editData, handleSearchStakeholder])

  const updateInvoiceTotals = (field, value, rowIndex) => {
    const getParentProduct = (field, value, row) =>
      productsOptionsList.find(o =>
        field === 'id'
          ? Number(o.id) === Number(value)
          : Number(o.id) === row.id
      )

    const getChildProduct = (field, value, row) => {
      if (data.service_type !== productsTypes.SERVICE)
        return { unit_price: 0, tax_fee: 0 }

      return childProductsOptionsList.find(o =>
        field === 'child_id'
          ? Number(o.id) === Number(value)
          : Number(o.id) === row.child_id
      )
    }

    setProductsData(prevState => {
      const row = prevState[rowIndex]
      const parentProduct = getParentProduct(field, value, row)
      const childProduct = getChildProduct(field, value, row)

      const updatedRow = handleUpdateProductsData({
        parentProduct,
        childProduct,
        row,
        discountValue: discountInputValue,
        field,
      })

      return prevState.map((prevRow, index) =>
        index === rowIndex ? updatedRow : prevRow
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
      // common fields
      id: '',
      code: '',
      child_id: '',
      quantity: 0,
      unit_price: 0,
      base_unit_price: 0,
      unit_tax_amount: 0,
      // parentProduct
      parent_tax_fee: 0,
      parent_unit_price: 0,
      parent_base_unit_price: 0,
      parent_unit_tax_amount: 0,
      // childProduct
      child_tax_fee: 0,
      child_unit_price: 0,
      child_base_unit_price: 0,
      child_unit_tax_amount: 0,
      subtotal: 0,
    },
    onChange: updateInvoiceTotals,
  })

  const handleDiscountChange = e => {
    const getParentProduct = p => ({
      id: p.id,
      code: p.code,
      tax_fee: p.parent_tax_fee,
      unit_tax_amount: p.parent_unit_tax_amount,
      unit_discount: p.parent_unit_discount,
    })

    const getChildProduct = p => ({
      id: p.child_id,
      tax_fee: p.child_tax_fee,
      unit_tax_amount: p.child_unit_tax_amount,
      unit_discount: p.child_unit_discount,
    })

    setDiscountInputValue(e?.target?.value || 0)

    setProductsData(prevState => {
      return prevState.map(p => {
        const parentProduct = getParentProduct(p)
        const childProduct = getChildProduct(p)

        const updatedProduct = handleUpdateProductsData({
          parentProduct,
          childProduct,
          row: p,
          discountValue: e?.target?.value,
        })

        return updatedProduct
      })
    })
  }

  const handleUpdateProductsData = ({
    parentProduct,
    childProduct,
    row,
    discountValue,
    field = '',
  }) => {
    console.log({ parentProduct, childProduct, row, discountValue })
    // parentProduct
    const parentBaseUnitPrice = parentProduct?.unit_price
      ? parentProduct.unit_price
      : row.parent_base_unit_price
    const parent_tax_fee = parentProduct?.tax_fee
      ? parentProduct.tax_fee
      : row.parent_tax_fee
    const parent_unit_discount = parentBaseUnitPrice * getPercent(discountValue)
    const parent_unit_price = parentBaseUnitPrice - parent_unit_discount
    const parent_unit_tax_amount =
      parent_unit_price * getPercent(parent_tax_fee)
    const parent_base_unit_price =
      field === 'id' || field === 'child_id'
        ? parent_unit_price + parent_unit_discount
        : row.parent_base_unit_price || parent_unit_price
    // childProduct
    const childBaseUnitPrice = childProduct?.unit_price
      ? childProduct.unit_price
      : row.child_base_unit_price
    const child_tax_fee = childProduct?.tax_fee
      ? Number(childProduct.tax_fee)
      : Number(row.child_tax_fee)
    const child_unit_discount = childBaseUnitPrice * getPercent(discountValue)
    const child_unit_price = childBaseUnitPrice - child_unit_discount
    const child_unit_tax_amount = child_unit_price * getPercent(child_tax_fee)
    const child_base_unit_price =
      field === 'id' || field === 'child_id'
        ? child_unit_price + child_unit_discount
        : row.child_base_unit_price || child_unit_price
    // common fields
    const unit_discount = roundNumber(
      child_unit_discount + parent_unit_discount
    )
    const unit_price = roundNumber(child_unit_price + parent_unit_price)
    const unit_tax_amount = roundNumber(
      child_unit_tax_amount + parent_unit_tax_amount
    )

    const newRow = {
      ...row,
      // parentProduct
      parent_tax_fee,
      parent_unit_price,
      parent_unit_tax_amount,
      parent_unit_discount,
      parent_base_unit_price,
      // childProduct
      child_tax_fee,
      child_unit_price,
      child_unit_tax_amount,
      child_unit_discount,
      child_base_unit_price,
      // common fields
      id: parentProduct ? Number(parentProduct.id) : row.id,
      code: parentProduct ? parentProduct.code : row.code,
      child_id: childProduct ? Number(childProduct.id) : row.child_id,
      quantity: field === 'id' || field === 'child_id' ? 1 : row.quantity,
      tax_fee:
        unit_tax_amount && unit_price
          ? (unit_tax_amount / unit_price) * 100
          : 0,
      unit_tax_amount,
      unit_price,
      unit_discount,
      base_unit_price: child_base_unit_price + parent_base_unit_price,
    }

    const subtotal =
      data.service_type === productsTypes.SERVICE
        ? roundNumber(child_unit_price * newRow.quantity + parent_unit_price)
        : roundNumber(newRow.unit_price * newRow.quantity)
    console.log({ ...newRow, subtotal })
    return { ...newRow, subtotal }
  }

  const handleChange = field => e => {
    const value = e?.target?.value === undefined ? e : e.target.value

    if (field === 'stakeholder_id') {
      if (!projectsOptionsList || projectsOptionsList?.length === 0) {
        handleSearchProject(null, {
          $limit: appConfig.selectsInitLimit,
          name: { $like: '%25%25' },
        })
      }

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

    if (field === 'service_type') {
      const prevTypeIsService =
        data.service_type === documentsServiceType.SERVICE
      const nextTypeIsService = value === documentsServiceType.SERVICE

      if (prevTypeIsService !== nextTypeIsService) {
        setProductsData([])
        setProductsOptionsList([])
        setChildProductsOptionsList([])
        handleAddDetail()
      }
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

  const handleSearchProject = (name, additionalParams = {}) => {
    if (name === '' || (!data.stakeholder_id && name !== null)) return

    const params = {
      stakeholder_id: data.stakeholder_id,
      name: { $like: `%25${name}%25` },
      ...additionalParams,
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
    handleSearchChildProduct,
    childProductsOptionsList,
    isInvoiceFromSale,
    serviceType: data.service_type,
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
