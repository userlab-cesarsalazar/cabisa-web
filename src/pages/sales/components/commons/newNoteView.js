import React, { useEffect, useState, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import debounce from 'lodash/debounce'
import moment from 'moment'
import {
  Col,
  Divider,
  Input,
  Row,
  DatePicker,
  Select,
  message,
  Spin,
  Statistic,
} from 'antd'
import FooterButtons from '../../../../components/FooterButtons'
import HeaderPage from '../../../../components/HeaderPage'
import Tag from '../../../../components/Tag'
import SaleProductsList from '../../../../components/SaleProductsList'
import { useSale, saleActions } from '../../context'
import {
  showErrors,
  validateDynamicTableProducts,
  formatPhone,
  numberFormat,
} from '../../../../utils'
import {
  productsTypes,
  productsStatus,
  appConfig,
  documentsServiceType,
  stakeholdersTypes,
  stakeholdersStatus,
} from '../../../../commons/types'
import { useEditableList } from '../../../../hooks'
import { getProductSubtotal } from '../../../billing/components/billingFields'
import { getOnChangeProductsListCallback } from '../../../billing/components/billingFields'

const { getFormattedValue } = numberFormat()

const {
  fetchChildProductsOptions,
  fetchProductsOptions,
  fetchProjectsOptions,
  fetchStakeholdersOptions,
  fetchDocumentServiceTypeOptions,
  createSale,
  setSaleState,
} = saleActions

const { TextArea } = Input
const { Option } = Select

function NewNoteView({ isAdmin }) {
  const history = useHistory()
  const [sale, setSale] = useState([])
  const [dataSourceTable, setDataSourceTable] = useState([])
  const [serviceDaysLength, setServiceDaysLength] = useState(null)

  const [{ error, loading, status, ...saleState }, saleDispatch] = useSale()

  const handleSearchStakeholder = useCallback(
    (stakeholder_name, additionalParams = {}) => {
      if (stakeholder_name === '') return

      const params = {
        name: { $like: `%25${stakeholder_name}%25` },
        status: stakeholdersStatus.ACTIVE,
        stakeholder_type: { $ne: stakeholdersTypes.PROVIDER },
        ...additionalParams,
      }

      fetchStakeholdersOptions(saleDispatch, params)
    },
    [saleDispatch]
  )

  const handleSearchProduct = (product_description, additionalParams = {}) => {
    if (product_description === '') return
    if (!sale.service_type && product_description !== null)
      return message.warning('Debe seleccionar el Tipo de servicio')

    const product_type =
      sale.service_type === productsTypes.SERVICE
        ? productsTypes.SERVICE
        : productsTypes.PRODUCT

    const params = {
      status: productsStatus.ACTIVE,
      stock: { $gt: 0 },
      description: { $like: `%25${product_description}%25` },
      product_type,
      ...additionalParams,
    }

    fetchProductsOptions(saleDispatch, params)
  }

  const fetchServiceTypeOptionsList = useCallback(() => {
    fetchDocumentServiceTypeOptions(saleDispatch)
  }, [saleDispatch])

  useEffect(
    function updateDataSourceTable() {
      const subtotal_amount = dataSourceTable?.reduce(
        (r, p) => r + getProductSubtotal(sale.service_type, p),
        0
      )

      setSale(prevState => ({ ...prevState, subtotal_amount }))
    },
    [dataSourceTable, sale.service_type]
  )

  useEffect(() => {
    handleSearchStakeholder(null, {
      $limit: appConfig.selectsInitLimit,
      name: { $like: '%25%25' },
    })

    fetchServiceTypeOptionsList()
  }, [handleSearchStakeholder, fetchServiceTypeOptionsList])

  useEffect(() => {
    if (status === 'ERROR') {
      showErrors(error)
      setSaleState(saleDispatch, { loading: null, error: null, status: 'IDLE' })
    }

    if (status === 'SUCCESS' && loading === 'createSale') {
      message.success('Nota de Servicio creada exitosamente')
      history.push('/sales')
    }
  }, [error, status, loading, saleDispatch, history])

  useEffect(function cleanUp() {
    return () => {
      setSale([])
      setDataSourceTable([])
      setServiceDaysLength(null)
    }
  }, [])

  const updateSaleTotals = (field, value, rowIndex) => {
    if (field === 'id' && saleState.childProductsOptionsList.length === 0) {
      handleSearchChildProduct(null, {
        $limit: appConfig.selectsInitLimit,
        description: { $like: '%25%25' },
      })
    }

    const onChangeListCallback = getOnChangeProductsListCallback({
      productsOptionsList: saleState.productsOptionsList,
      childProductsOptionsList: saleState.childProductsOptionsList,
      serviceType: sale.service_type,
      discountValue: 0,
    })

    const setProductsDataCallback = onChangeListCallback(field, value, rowIndex)

    setDataSourceTable(setProductsDataCallback)
  }

  const {
    handleChange: handleChangeDetail,
    handleAdd: handleAddDetail,
    handleRemove: handleRemoveDetail,
  } = useEditableList({
    state: dataSourceTable,
    setState: setDataSourceTable,
    initRow: {
      // common fields
      id: '',
      code: '',
      child_id: '',
      child_description: '',
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
    onChange: updateSaleTotals,
  })

  const getServiceDaysLength = (startDate, endDate) => {
    if (!startDate || !endDate) return null
    else return moment(endDate).diff(moment(startDate), 'days')
  }

  const handleSearchChildProduct = (
    product_description,
    additionalParams = {}
  ) => {
    if (product_description === '') return

    const params = {
      status: productsStatus.ACTIVE,
      stock: { $gt: 0 },
      description: { $like: `%25${product_description}%25` },
      product_type: productsTypes.PRODUCT,
      ...additionalParams,
    }

    fetchChildProductsOptions(saleDispatch, params)
  }

  const getSaveData = () => ({
    stakeholder_id: sale.stakeholder_id,
    project_id: sale.project_id,
    start_date: sale.start_date,
    end_date: sale.end_date,
    dispatched_by: sale.dispatched_by,
    received_by: sale.received_by,
    comments: sale.comments,
    service_type: sale.service_type,
    related_external_document_id: null,
    subtotal_amount: sale.subtotal_amount,
    products: dataSourceTable.reduce((r, p) => {
      const parentProduct = {
        product_id: p.id,
        product_quantity:
          !p.child_id || isNaN(p.child_id) ? Number(p.quantity) : 1,
        product_price: Number(p.parent_unit_price),
      }

      const childProduct = {
        product_id: p.child_id,
        product_quantity: Number(p.quantity),
        product_price: Number(p.child_unit_price),
        parent_product_id: p.id,
      }

      const products =
        !p.child_id || isNaN(p.child_id)
          ? [parentProduct]
          : [parentProduct, childProduct]

      return [...(r || []), ...products]
    }, []),
  })

  const validateSaveData = data => {
    const errors = []
    const requiredFields = [
      { key: 'stakeholder_id', value: 'Empresa' },
      { key: 'project_id', value: 'Proyecto' },
      { key: 'start_date', value: 'Fecha Inicio' },
      { key: 'end_date', value: 'Fecha Final' },
      // { key: 'dispatched_by', value: 'Quien Entrega' },
      // { key: 'received_by', value: 'Quien Recibe' },
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

    return {
      isInvalid: errors.length > 0,
      error: {
        message: errors,
      },
    }
  }
  const saveData = async () => {
    const data = getSaveData()

    const { isInvalid, error } = validateSaveData(data)

    if (isInvalid) return showErrors(error)

    await createSale(saleDispatch, data)
  }

  const getHandleChangeValue = (field, e) => {
    if ((field === 'start_date' || field === 'end_date') && e)
      return moment(e).format()

    return e?.target?.value === undefined ? e : e.target.value
  }

  const handleChange = field => e => {
    const value = getHandleChangeValue(field, e)

    if (field === 'start_date') {
      const serviceDaysLength = getServiceDaysLength(value, sale.end_date)
      setServiceDaysLength(serviceDaysLength)
    }

    if (field === 'end_date') {
      const serviceDaysLength = getServiceDaysLength(sale.start_date, value)
      setServiceDaysLength(serviceDaysLength)
    }

    if (field === 'stakeholder_id') {
      handleSearchProject(value)()

      const stakeholder = saleState.stakeholdersOptionsList.find(
        option => option.id === value
      )

      return setSale(prevState => ({
        ...prevState,
        project_id: null,
        stakeholder_id: stakeholder.id,
        stakeholder_address: stakeholder.address,
        stakeholder_phone: formatPhone(stakeholder.phone),
        stakeholder_business_man: stakeholder.business_man,
      }))
    }

    if (field === 'service_type') {
      const prevTypeIsService =
        sale.service_type === documentsServiceType.SERVICE
      const nextTypeIsService = value === documentsServiceType.SERVICE

      if (prevTypeIsService !== nextTypeIsService) {
        setDataSourceTable([])
        setSaleState(saleDispatch, {
          childProductsOptionsList: [],
          productsOptionsList: [],
        })
        handleAddDetail()
      }

      handleSearchProduct(null, {
        $limit: appConfig.selectsInitLimit,
        description: { $like: '%25%25' },
        product_type: nextTypeIsService
          ? productsTypes.SERVICE
          : productsTypes.PRODUCT,
      })
    }

    setSale(prevState => ({
      ...prevState,
      [field]: value,
    }))
  }

  const handleSearchProject = stakeholder_id => name => {
    if (name === '' || (!stakeholder_id && name !== null)) return

    const params = {
      stakeholder_id,
      name: { $like: `%25${name || ''}%25` },
    }

    fetchProjectsOptions(saleDispatch, params)
  }

  const handleCancelButton = () => history.push('/sales')

  // Cannot select days before today
  const disabledDate = current =>
    current && moment(current).add(1, 'days') < moment().endOf('day')

  return (
    <Spin spinning={status === 'LOADING'}>
      <HeaderPage titleButton={''} title={'Nueva nota de servicio'} />
      <div>
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Empresa</div>
            <Select
              className={'single-select'}
              placeholder={'Empresa'}
              size={'large'}
              style={{ width: '100%', height: '40px' }}
              getPopupContainer={trigger => trigger.parentNode}
              showSearch
              onSearch={debounce(handleSearchStakeholder, 400)}
              value={sale.stakeholder_id}
              onChange={handleChange('stakeholder_id')}
              loading={
                status === 'LOADING' && loading === 'fetchStakeholdersOptions'
              }
              optionFilterProp='children'
            >
              {saleState.stakeholdersOptionsList.length > 0 ? (
                saleState.stakeholdersOptionsList.map(value => (
                  <Option key={value.id} value={value.id}>
                    {value.name}
                  </Option>
                ))
              ) : (
                <Option value={sale.stakeholder_id}>
                  {sale.stakeholder_name}
                </Option>
              )}
            </Select>
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Direccion</div>
            <Input
              placeholder={'Direccion'}
              size={'large'}
              value={sale.stakeholder_address}
              onChange={handleChange('stakeholder_address')}
              disabled
            />
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Telefono</div>
            <Input
              placeholder={'Telefono'}
              size={'large'}
              value={sale.stakeholder_phone}
              onChange={handleChange('stakeholder_phone')}
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
              onSearch={debounce(handleSearchProject(sale.stakeholder_id), 400)}
              value={sale.project_id}
              onChange={handleChange('project_id')}
              loading={
                status === 'LOADING' && loading === 'fetchProjectsOptions'
              }
              optionFilterProp='children'
              disabled={!sale.stakeholder_id}
            >
              {saleState.projectsOptionsList.length > 0 ? (
                saleState.projectsOptionsList.map(value => (
                  <Option key={value.id} value={value.id}>
                    {value.name}
                  </Option>
                ))
              ) : (
                <Option value={sale.project_id}>{sale.project_name}</Option>
              )}
            </Select>
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Encargado</div>
            <Input
              placeholder={'Encargado'}
              size={'large'}
              value={sale.stakeholder_business_man}
              onChange={handleChange('stakeholder_business_man')}
              disabled
            />
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>
              Duracion del servicio (dias)
            </div>
            <Input
              placeholder={'Duracion del servicio'}
              size={'large'}
              value={serviceDaysLength}
              disabled
            />
          </Col>
        </Row>
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Fecha Inicio</div>
            <DatePicker
              style={{ width: '100%', height: '37px', borderRadius: '8px' }}
              value={sale.start_date ? moment(sale.start_date) : ''}
              onChange={handleChange('start_date')}
              format='DD-MM-YYYY'
              disabledDate={disabledDate}
            />
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Fecha Final</div>
            <DatePicker
              style={{ width: '100%', height: '37px', borderRadius: '8px' }}
              value={sale.end_date ? moment(sale.end_date) : ''}
              onChange={handleChange('end_date')}
              format='DD-MM-YYYY'
              disabledDate={disabledDate}
            />
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
              value={sale.service_type}
            >
              {saleState.documentServiceTypesOptionsList?.length > 0 ? (
                saleState.documentServiceTypesOptionsList.map(value => (
                  <Option key={value} value={value}>
                    <Tag type='documentsServiceType' value={value} />
                  </Option>
                ))
              ) : (
                <Option value={sale.service_type}>
                  <Tag type='documentsServiceType' value={sale.service_type} />
                </Option>
              )}
            </Select>
          </Col>
        </Row>
        <Divider className={'divider-custom-margins-users'} />
        <h2>Detalle Entrega:</h2>
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={24} sm={24} md={24} lg={24}>
            <SaleProductsList
              dataSource={dataSourceTable}
              handleAddDetail={handleAddDetail}
              handleChangeDetail={handleChangeDetail}
              handleRemoveDetail={handleRemoveDetail}
              handleSearchProduct={handleSearchProduct}
              handleSearchChildProduct={handleSearchChildProduct}
              productsOptionsList={saleState.productsOptionsList}
              childProductsOptionsList={saleState.childProductsOptionsList}
              serviceType={sale.service_type}
              status={status}
              loading={loading}
              isAdmin={isAdmin}
            />
          </Col>
        </Row>

        <Divider className={'divider-custom-margins-users'} />

        <Row gutter={16} style={{ textAlign: 'right' }} justify='end'>
          <Col span={6} style={{ textAlign: 'right' }}>
            <div className={'title-space-field'}>
              <Statistic
                title='Total :'
                value={getFormattedValue(sale.subtotal_amount)}
              />
            </div>
          </Col>
        </Row>

        <Divider className={'divider-custom-margins-users'} />

        <Row gutter={16} className={'section-space-field'}>
          <Col xs={24} sm={24} md={24} lg={24}>
            <div className={'title-space-field'}>Observaciones</div>
            <TextArea
              rows={4}
              value={sale.comments}
              onChange={handleChange('comments')}
            />
          </Col>
        </Row>
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={12} sm={12} md={12} lg={12}>
            <h3>Quien Entrega:</h3>
            <Input
              placeholder={'Entrega'}
              size={'large'}
              value={sale.dispatched_by}
              onChange={handleChange('dispatched_by')}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <h3>Quien Recibe:</h3>
            <Input
              placeholder={'Recibe'}
              size={'large'}
              value={sale.received_by}
              onChange={handleChange('received_by')}
            />
          </Col>
        </Row>
      </div>
      <FooterButtons
        saveData={saveData}
        cancelButton={handleCancelButton}
        edit={true}
        cancelLink=''
      />
    </Spin>
  )
}

export default NewNoteView
