import React, { useEffect, useState, useCallback } from 'react'
import debounce from 'lodash/debounce'
import {
  Button,
  Col,
  Divider,
  Input,
  message,
  Row,
  Select,
  Statistic,
  Typography,
} from 'antd'
import BillingProductsList from './billingProductsList'
import Tag from '../../../components/Tag'
import { useEditableList } from '../../../hooks'
import {
  showErrors,
  roundNumber,
  getPercent,
  validateSaleOrBillingProducts,
  formatPhone,
  numberFormat,
} from '../../../utils'
import billingSrc from '../billingSrc'
import FooterButtons from '../../../components/FooterButtons'
import {
  appConfig,
  documentsServiceType,
  productsTypes,
  productsStatus,
  documentsStatus,
  stakeholdersStatus,
  stakeholdersTypes,
} from '../../../commons/types'

const { Title } = Typography
const { Option } = Select
const { TextArea } = Input

const { getValue, getFormattedValue } = numberFormat()

export const getProductDiscount = product =>
  product.service_type === productsTypes.SERVICE
    ? product.parent_unit_discount +
      product.child_unit_discount * product.quantity
    : product.unit_discount * product.quantity

export const getProductSubtotal = product => {
  const result =
    product.service_type === productsTypes.SERVICE
      ? Number(product.parent_unit_price) +
        Number(product.child_unit_price) * product.quantity
      : Number(product.unit_price) * product.quantity

  return roundNumber(result)
}

export const handleUpdateProductsData = ({
  parentProduct,
  childProduct,
  row,
  discountValue,
  field = '',
}) => {
  // parentProduct
  const parentBaseUnitPrice =
    parentProduct?.unit_price && field !== ''
      ? getValue(parentProduct.unit_price)
      : getValue(row.parent_base_unit_price)
  const parent_tax_fee = parentProduct?.tax_fee
    ? parentProduct.tax_fee
    : row.parent_tax_fee
  const parent_unit_discount = parentBaseUnitPrice * getPercent(discountValue)
  const parent_unit_price = roundNumber(
    parentBaseUnitPrice - parent_unit_discount
  )
  const parent_unit_tax_amount =
    Number(parent_unit_price) * getPercent(parent_tax_fee)
  const parent_base_unit_price =
    field === 'id' || field === 'child_id' || field === 'parent_unit_price'
      ? Number(parent_unit_price) + parent_unit_discount
      : row.parent_base_unit_price || Number(parent_unit_price)
  // childProduct
  const childBaseUnitPrice =
    childProduct?.unit_price && field !== ''
      ? getValue(childProduct.unit_price)
      : getValue(row.child_base_unit_price)
  const child_tax_fee = childProduct?.tax_fee
    ? Number(childProduct.tax_fee)
    : Number(row.child_tax_fee)
  const child_unit_discount = childBaseUnitPrice * getPercent(discountValue)
  const child_unit_price = roundNumber(childBaseUnitPrice - child_unit_discount)
  const child_unit_tax_amount =
    Number(child_unit_price) * getPercent(child_tax_fee)
  const child_base_unit_price =
    field === 'id' || field === 'child_id' || field === 'child_unit_price'
      ? Number(child_unit_price) + child_unit_discount
      : row.child_base_unit_price || Number(child_unit_price)
  // common fields
  const unit_discount = roundNumber(child_unit_discount + parent_unit_discount)
  const unit_price = roundNumber(child_unit_price + Number(parent_unit_price))
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
    parent_inventory_unit_value:
      parentProduct?.inventory_unit_value || row?.parent_inventory_unit_value,
    // childProduct
    child_tax_fee,
    child_unit_price,
    child_unit_tax_amount,
    child_unit_discount,
    child_base_unit_price,
    child_inventory_unit_value:
      childProduct?.inventory_unit_value || row?.child_inventory_unit_value,
    // common fields
    id: parentProduct?.id ? Number(parentProduct.id) : row.id,
    code: parentProduct?.code ? parentProduct.code : row.code,
    child_id: childProduct?.id ? Number(childProduct.id) : row.child_id,
    quantity: field === 'id' || field === 'child_id' ? 1 : row.quantity,
    tax_fee:
      unit_tax_amount && unit_price ? (unit_tax_amount / unit_price) * 100 : 0,
    unit_tax_amount,
    unit_price,
    unit_discount,
    base_unit_price: child_base_unit_price + parent_base_unit_price,
  }

  const subtotal = getProductSubtotal(newRow)

  return { ...newRow, subtotal }
}

export const getOnChangeProductsListCallback = ({
  productsOptionsList,
  childProductsOptionsList,
  discountValue,
}) => (field, value, rowIndex) => {
  const getParentProduct = (field, value) => {
    const product = productsOptionsList.find(
      o => field === 'id' && Number(o.id) === Number(value)
    )

    const unit_price = value === undefined ? '0' : value
    return field === 'parent_unit_price' ? { unit_price } : product
  }

  const getChildProduct = (field, value) => {
    const product = childProductsOptionsList.find(
      o => field === 'child_id' && Number(o.id) === Number(value)
    )

    const unit_price = value === undefined ? '0' : value
    return field === 'child_unit_price' ? { unit_price } : product
  }

  return function setProductsDataCallback(prevState) {
    const row = prevState[rowIndex]
    const parentProduct = getParentProduct(field, value)
    const childProduct = getChildProduct(field, value)

    const updatedRow = handleUpdateProductsData({
      parentProduct,
      childProduct,
      row,
      discountValue,
      field,
    })

    return prevState.map((prevRow, index) =>
      index === rowIndex ? updatedRow : prevRow
    )
  }
}

export const editableListInitRow = {
  // common fields
  service_type: '',
  id: '',
  description: '',
  code: '',
  child_id: '',
  child_description: '',
  quantity: 0,
  unit_price: 0,
  base_unit_price: 0,
  unit_tax_amount: 0,
  tax_fee: 0,
  // parentProduct
  parent_tax_fee: 0,
  parent_unit_price: 0,
  parent_base_unit_price: 0,
  parent_unit_tax_amount: 0,
  parent_inventory_unit_value: 0,
  // childProduct
  child_tax_fee: 0,
  child_unit_price: 0,
  child_base_unit_price: 0,
  child_unit_tax_amount: 0,
  child_inventory_unit_value: 0,
  subtotal: 0,
}

export const billingLogicFactory = ({
  stakeholdersOptionsList,
  setProjectsOptionsList,
  productsData,
  isInvoiceFromSale,
  discountInputValue,
  setLoading,
  setData,
  data,
  setProductsOptionsList,
  setChildProductsOptionsList,
  setDiscountInputValue,
  setProductsData,
  handleSaveData,
  isSaleValidation = false,
}) => {
  const handleSearchProject = stakeholder_id => name => {
    if (name === '' || (!stakeholder_id && name !== null)) return

    const params = {
      stakeholder_id,
      name: { $like: `%25${name || ''}%25` },
    }

    setLoading(true)

    billingSrc
      .getProjectsOptions(params)
      .then(data => setProjectsOptionsList(data))
      .catch(error => showErrors(error))
      .finally(() => setLoading(false))
  }

  const getSaveData = () => ({
    document_id: data.id,
    stakeholder_id: data.stakeholder_id,
    project_id: data.project_id,
    start_date: data.start_date,
    end_date: data.end_date,
    payment_method: data.payment_method,
    credit_days: data.credit_days,
    dispatched_by: data.dispatched_by,
    received_by: data.received_by,
    comments: data.comments,
    subtotal_amount: data.subtotal,
    total_discount_amount: data.discount,
    total_tax_amount: data.total_tax,
    total_amount: data.total,
    description: data.description,
    products: productsData.reduce((r, p) => {
      const parentProduct = {
        product_id: p.id,
        product_quantity:
          !p.child_id || isNaN(p.child_id) ? Number(p.quantity) : 1,
        product_price: Number(p.parent_unit_price),
        product_discount_percentage: discountInputValue
          ? Number(discountInputValue)
          : null,
        product_discount: p.parent_unit_discount
          ? Number(p.parent_unit_discount)
          : null,
        service_type: p.service_type,
      }

      const childProduct = {
        product_id: p.child_id,
        product_quantity: Number(p.quantity),
        product_price: Number(p.child_unit_price),
        product_discount_percentage: discountInputValue
          ? Number(discountInputValue)
          : null,
        product_discount: p.child_unit_discount
          ? Number(p.child_unit_discount)
          : null,
        parent_product_id: p.id || null,
        service_type: p.service_type,
      }

      const products =
        !p.id || isNaN(p.id) ? [childProduct] : [childProduct, parentProduct]

      return [...(r || []), ...products]
    }, []),
  })

  const validateSaveData = data => {
    const errors = []
    const billRequiredFields = [
      { key: 'stakeholder_id', value: 'Empresa' },
      { key: 'payment_method', value: 'Metodo de pago' },
      { key: 'project_id', value: 'Proyecto' },
    ]
    const saleRequiredFields = [
      { key: 'stakeholder_id', value: 'Empresa' },
      { key: 'project_id', value: 'Proyecto' },
      { key: 'start_date', value: 'Fecha Inicio' },
      { key: 'end_date', value: 'Fecha Final' },
    ]
    const requiredFields = isSaleValidation
      ? saleRequiredFields
      : billRequiredFields

    const requiredErrors = requiredFields.flatMap(field =>
      !data[field.key] ? field.value : []
    )
    if (requiredErrors.length > 0) {
      requiredErrors.forEach(k => {
        errors.push(`El campo ${k} es obligatorio`)
      })
    }
    const productsRequiredFields = ['product_quantity', 'product_price']

    const productErrors = validateSaleOrBillingProducts(
      data.products,
      productsRequiredFields,
      documentsServiceType.SERVICE
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

    if (!isSaleValidation && discountInputValue < 0) {
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

  return {
    handleSearchProject,

    handleDiscountChange: e => {
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
    },

    handleSearchProduct: rowIndex => product_description => {
      if (isInvoiceFromSale) return
      if (product_description === '') return
      if (!productsData[rowIndex].service_type)
        return message.warning('Debe seleccionar el Tipo de servicio')

      const params = {
        status: productsStatus.ACTIVE,
        stock: { $gt: 0 },
        description: { $like: `%25${product_description}%25` },
        product_type: productsTypes.SERVICE,
      }

      setLoading(true)

      billingSrc
        .getProductsOptions(params)
        .then(data => setProductsOptionsList(data))
        .catch(error => showErrors(error))
        .finally(() => setLoading(false))
    },

    handleSearchChildProduct: rowIndex => product_description => {
      if (isInvoiceFromSale) return
      if (product_description === '') return
      if (!productsData[rowIndex].service_type)
        return message.warning('Debe seleccionar el Tipo de servicio')

      const params = {
        status: productsStatus.ACTIVE,
        stock: { $gt: 0 },
        description: { $like: `%25${product_description}%25` },
        product_type: productsTypes.PRODUCT,
      }

      setLoading(true)

      billingSrc
        .getProductsOptions(params)
        .then(data => setChildProductsOptionsList(data))
        .catch(error => showErrors(error))
        .finally(() => setLoading(false))
    },

    handleChange: field => e => {
      const value = e?.target?.value === undefined ? e : e.target.value

      if (field === 'stakeholder_id') {
        handleSearchProject(value)()

        const stakeholder = stakeholdersOptionsList.find(
          option => option.id === value
        )

        return setData(prevState => ({
          ...prevState,
          project_id: null,
          stakeholder_id: stakeholder.id,
          stakeholder_name: stakeholder.stakeholder_name,
          stakeholder_type: stakeholder.stakeholder_type,
          stakeholder_nit: stakeholder.nit,
          stakeholder_email: stakeholder.email,
          stakeholder_phone: formatPhone(stakeholder.phone),
          stakeholder_address: stakeholder.address,
        }))
      }

      setData(prevState => ({
        ...prevState,
        [field]: value,
      }))
    },

    getSaveData,

    validateSaveData,

    saveData: async () => {
      const saveData = getSaveData()

      const { isInvalid, error } = validateSaveData(saveData)

      if (isInvalid) return showErrors(error)

      await handleSaveData(saveData)
    },
  }
}

function BillingFields({ setLoading, editData, isInvoiceFromSale, ...props }) {
  const [stakeholdersOptionsList, setStakeholdersOptionsList] = useState([])
  const [projectsOptionsList, setProjectsOptionsList] = useState([])
  const [productsOptionsList, setProductsOptionsList] = useState([])
  const [childProductsOptionsList, setChildProductsOptionsList] = useState([])
  const [data, setData] = useState({})
  const [productsData, setProductsData] = useState([])
  const [discountInputValue, setDiscountInputValue] = useState(0)

  const {
    saveData,
    handleChange,
    handleSearchChildProduct,
    handleSearchProduct,
    handleDiscountChange,
    handleSearchProject,
  } = billingLogicFactory({
    stakeholdersOptionsList,
    setProjectsOptionsList,
    productsData,
    isInvoiceFromSale,
    discountInputValue,
    setLoading,
    setData,
    data,
    setProductsOptionsList,
    setChildProductsOptionsList,
    setDiscountInputValue,
    setProductsData,
    handleSaveData: props.handleSaveData,
  })

  const handleSearchStakeholder = useCallback(
    (stakeholder_name, additionalParams = {}) => {
      if (isInvoiceFromSale) return
      if (stakeholder_name === '') return

      const params = {
        name: { $like: `%25${stakeholder_name}%25` },
        status: stakeholdersStatus.ACTIVE,
        stakeholder_type: { $ne: stakeholdersTypes.PROVIDER },
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

  useEffect(
    function updateStatistics() {
      if (editData && !isInvoiceFromSale) return

      setData(prevDataState => {
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
            credit_days: prevDataState.credit_days
              ? prevDataState.credit_days
              : 0,
          }
        }, {})

        return { ...prevDataState, ...totals }
      })
    },
    [setData, productsData, editData, isInvoiceFromSale]
  )

  useEffect(() => {
    if (editData && !isInvoiceFromSale) return

    handleSearchStakeholder(null, {
      $limit: appConfig.selectsInitLimit,
      name: { $like: '%25%25' },
    })
  }, [handleSearchStakeholder, editData, isInvoiceFromSale])

  useEffect(() => {
    if (!editData) return

    setData(prevState => ({
      ...editData,
      stakeholder_phone: formatPhone(editData.stakeholder_phone),
      ...prevState,
    }))

    setProductsData(prevState =>
      prevState?.length > 1 ? prevState : editData.products
    )
    setDiscountInputValue(prevState =>
      prevState ? prevState : editData.discount_percentage || 0
    )
  }, [editData])

  useEffect(function cleanUp() {
    return () => {
      setData({})
      setProductsData([])
      setDiscountInputValue(0)
    }
  }, [])

  const updateInvoiceTotals = (field, value, rowIndex) => {
    if (field === 'service_type') {
      setProductsData(prevState => {
        const row = prevState[rowIndex]
        const newRow = { ...row, ...initRow, service_type: value }

        return prevState.map((v, i) => (i === rowIndex ? newRow : v))
      })

      return
    }

    const onChangeListCallback = getOnChangeProductsListCallback({
      productsOptionsList,
      childProductsOptionsList,
      discountValue:
        field !== 'parent_unit_price' && field !== 'child_unit_price'
          ? discountInputValue
          : 0,
    })

    const setProductsDataCallback = onChangeListCallback(field, value, rowIndex)

    setProductsData(setProductsDataCallback)
  }

  const updateInvoiceOnBlurPrice = (field, value, rowIndex) => {
    const onChangeListCallback = getOnChangeProductsListCallback({
      productsOptionsList,
      childProductsOptionsList,
      discountValue: discountInputValue,
    })

    const setProductsDataCallback = onChangeListCallback(field, value, rowIndex)

    setProductsData(setProductsDataCallback)
  }

  const {
    handleChange: handleChangeDetail,
    handleAdd: handleAddDetail,
    handleRemove: handleRemoveDetail,
    handleBlur: handleBlurDetail,
    rowModel: initRow,
  } = useEditableList({
    state: productsData,
    setState: setProductsData,
    initRow: editableListInitRow,
    onChange: updateInvoiceTotals,
    onBlur: updateInvoiceOnBlurPrice,
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
                  Serie No. {data.id}
                </Button>
              </Col>
            </Row>

            {data.credit_status && data.status !== documentsStatus.CANCELLED && (
              <Row>
                <Col xs={24} sm={24} md={16} lg={16}></Col>
                <Col
                  xs={24}
                  sm={24}
                  md={8}
                  lg={8}
                  className='show-flex-component'
                >
                  <b
                    style={{ paddingRight: '1em' }}
                    className={'title-space-field'}
                  >
                    Estado de Credito
                  </b>
                  <Tag type='creditStatus' value={data.credit_status} />
                </Col>
              </Row>
            )}

            <Divider className={'divider-custom-margins-users'} />
          </>
        )}

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
              onSearch={debounce(handleSearchProject(data.stakeholder_id), 400)}
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
                  type='tel'
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

        <BillingProductsList
          dataSource={productsData}
          handleAddDetail={handleAddDetail}
          handleChangeDetail={handleChangeDetail}
          handleRemoveDetail={handleRemoveDetail}
          handleBlurDetail={handleBlurDetail}
          handleSearchProduct={handleSearchProduct}
          productsOptionsList={productsOptionsList}
          handleSearchChildProduct={handleSearchChildProduct}
          childProductsOptionsList={childProductsOptionsList}
          isInvoiceFromSale={isInvoiceFromSale}
          isEditing={props.edit}
          serviceTypesOptionsList={props.serviceTypesOptionsList}
        />

        <Divider className={'divider-custom-margins-users'} />

        <Row gutter={16} style={{ textAlign: 'right' }} justify='end'>
          <Col span={6} style={{ textAlign: 'right' }}>
            {!props.edit || data.discount ? (
              <div className={'title-space-field'}>
                <Statistic
                  title='Descuento :'
                  value={getFormattedValue(data.discount)}
                />
              </div>
            ) : null}
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            <div className={'title-space-field'}>
              <Statistic
                title='Subtotal :'
                value={getFormattedValue(data.subtotal)}
              />
            </div>
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            <div className={'title-space-field'}>
              <Statistic
                title='Impuesto :'
                value={getFormattedValue(data.total_tax)}
              />
            </div>
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            <div className={'title-space-field'}>
              <Statistic
                title='Total :'
                value={getFormattedValue(data.total)}
              />
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
