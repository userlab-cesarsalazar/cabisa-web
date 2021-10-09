import React, { useEffect, useState, useCallback } from 'react'
import debounce from 'lodash/debounce'
import moment from 'moment'
import {
  Col,
  Divider,
  Drawer,
  Input,
  Row,
  Typography,
  DatePicker,
  Select,
  message,
  Statistic,
} from 'antd'
import FooterButtons from '../../../../components/FooterButtons'
import SaleProductsList from './saleProductsList'
import {
  productsStatus,
  stakeholdersStatus,
  stakeholdersTypes,
  productsTypes,
  documentsServiceType,
} from '../../../../commons/types'
import { useSale, saleActions } from '../../context'
import { useEditableList } from '../../../../hooks'
import {
  showErrors,
  validateSaleOrBillingProducts,
  formatPhone,
  numberFormat,
} from '../../../../utils'
import { documentsStatus } from '../../../../commons/types'
import {
  editableListInitRow,
  getOnChangeProductsListCallback,
  getProductSubtotal,
} from '../../../billing/components/billingFields'
import { getDetailData } from '../../../billing/billingIndex'

const { getFormattedValue } = numberFormat()

const { Title } = Typography
const { TextArea } = Input
const { Option } = Select
const {
  fetchProductsOptions,
  fetchProjectsOptions,
  fetchStakeholdersOptions,
  fetchChildProductsOptions,
  fetchDocumentServiceTypeOptions,
  updateSale,
  fetchSales,
  setSaleState,
} = saleActions

function SalesDetail({ closable, visible, isAdmin, canEditAndCreate }) {
  const [forbidEdition, setForbidEdition] = useState(false)
  const [sale, setSale] = useState([])
  const [dataSourceTable, setDataSourceTable] = useState([])
  const [serviceDaysLength, setServiceDaysLength] = useState(null)

  const [
    { error, loading, status, currentSale, ...saleState },
    saleDispatch,
  ] = useSale()

  const fetchServiceTypeOptionsList = useCallback(() => {
    fetchDocumentServiceTypeOptions(saleDispatch)
  }, [saleDispatch])

  const handleClose = useCallback(() => {
    setSaleState(saleDispatch, {
      currentSale: {},
      childProductsOptionsList: [],
      productsOptionsList: [],
    })
    closable()
  }, [saleDispatch, closable])

  useEffect(
    function updateDataSourceTable() {
      const subtotal_amount = dataSourceTable?.reduce(
        (r, p) => r + getProductSubtotal(p),
        0
      )

      setSale(prevState => ({ ...prevState, subtotal_amount }))
    },
    [dataSourceTable]
  )

  useEffect(() => {
    fetchServiceTypeOptionsList()
  }, [fetchServiceTypeOptionsList])

  useEffect(() => {
    if (!visible) return

    if (status === 'ERROR') {
      showErrors(error)
      setSaleState(saleDispatch, { loading: null, error: null, status: 'IDLE' })
    }

    if (status === 'SUCCESS' && loading === 'updateSale') {
      fetchSales(saleDispatch)
      message.success('Nota de Servicio actualizada exitosamente')
      handleClose()
    }
  }, [error, status, loading, saleDispatch, handleClose, visible])

  const getServiceDaysLength = (startDate, endDate) => {
    if (!startDate || !endDate) return null
    else return moment(endDate).diff(moment(startDate), 'days')
  }

  useEffect(() => {
    const { products: newDataSourceTable } = getDetailData(currentSale)

    setDataSourceTable(newDataSourceTable)
    setForbidEdition(currentSale.status !== documentsStatus.PENDING)
    setSale({
      ...currentSale,
      stakeholder_phone: formatPhone(currentSale.stakeholder_phone),
    })
    setServiceDaysLength(
      getServiceDaysLength(currentSale.start_date, currentSale.end_date)
    )
  }, [currentSale, saleDispatch])

  useEffect(function cleanUp() {
    return () => {
      setSale([])
      setDataSourceTable([])
      setServiceDaysLength(null)
    }
  }, [])

  const updateSaleTotals = (field, value, rowIndex) => {
    if (field === 'service_type') {
      setDataSourceTable(prevState => {
        const row = prevState[rowIndex]
        const newRow = { ...row, ...initRow, service_type: value }

        return prevState.map((v, i) => (i === rowIndex ? newRow : v))
      })

      return
    }

    const onChangeListCallback = getOnChangeProductsListCallback({
      productsOptionsList: saleState.productsOptionsList,
      childProductsOptionsList: saleState.childProductsOptionsList,
      discountValue: 0,
    })

    const setProductsDataCallback = onChangeListCallback(field, value, rowIndex)

    setDataSourceTable(setProductsDataCallback)
  }

  const {
    handleChange: handleChangeDetail,
    handleAdd: handleAddDetail,
    handleRemove: handleRemoveDetail,
    rowModel: initRow,
  } = useEditableList({
    state: dataSourceTable,
    setState: setDataSourceTable,
    initRow: editableListInitRow,
    onChange: updateSaleTotals,
  })

  const handleSearchProduct = rowIndex => product_description => {
    if (product_description === '') return
    if (!dataSourceTable[rowIndex].service_type)
      return message.warning('Debe seleccionar el Tipo de servicio')

    const params = {
      status: productsStatus.ACTIVE,
      stock: { $gt: 0 },
      description: { $like: `%25${product_description || ''}%25` },
      product_type: productsTypes.SERVICE,
    }

    fetchProductsOptions(saleDispatch, params)
  }

  const handleSearchChildProduct = rowIndex => product_description => {
    if (product_description === '') return
    if (!dataSourceTable[rowIndex].service_type)
      return message.warning('Debe seleccionar el Tipo de servicio')

    const params = {
      status: productsStatus.ACTIVE,
      stock: { $gt: 0 },
      description: { $like: `%25${product_description}%25` },
      product_type: productsTypes.PRODUCT,
    }

    fetchChildProductsOptions(saleDispatch, params)
  }

  const getSaveData = () => ({
    document_id: sale.id,
    project_id: sale.project_id,
    start_date: sale.start_date,
    end_date: sale.end_date,
    dispatched_by: sale.dispatched_by,
    received_by: sale.received_by,
    comments: sale.comments,
    related_external_document_id: null,
    subtotal_amount: sale.subtotal_amount,
    products: dataSourceTable.reduce((r, p) => {
      const parentProduct = {
        product_id: p.id,
        product_quantity:
          !p.child_id || isNaN(p.child_id) ? Number(p.quantity) : 1,
        product_price: Number(p.parent_unit_price),
        service_type: p.service_type,
      }

      const childProduct = {
        product_id: p.child_id,
        product_quantity: Number(p.quantity),
        product_price: Number(p.child_unit_price),
        parent_product_id: p.id,
        service_type: p.service_type,
      }

      const products =
        !p.id || isNaN(p.id) ? [childProduct] : [childProduct, parentProduct]

      return [...(r || []), ...products]
    }, []),
  })

  const validateSaveData = data => {
    const errors = []
    const requiredFields = [
      { key: 'project_id', value: 'Proyecto' },
      { key: 'start_date', value: 'Fecha Inicio' },
      { key: 'end_date', value: 'Fecha Final' },
      // { key: 'received_by', value: 'Quien Recibe' },
      // { key: 'dispatched_by', value: 'Quien Entrega' },
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

    await updateSale(saleDispatch, data)
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
      const stakeholder = saleState.stakeholdersOptionsList.find(
        option => option.id === value
      )

      return setSale(prevState => ({
        ...prevState,
        stakeholder_id: stakeholder.id,
        stakeholder_address: stakeholder.address,
        stakeholder_phone: formatPhone(stakeholder.phone),
        stakeholder_business_man: stakeholder.business_man,
      }))
    }

    setSale(prevState => ({
      ...prevState,
      [field]: value,
    }))
  }

  const handleSearchProject = project_name => {
    if (project_name === '') return

    const params = {
      name: { $like: `%25${project_name}%25` },
    }

    fetchProjectsOptions(saleDispatch, params)
  }

  const handleSearchStakeholder = stakeholder_name => {
    if (stakeholder_name === '') return

    const params = {
      status: stakeholdersStatus.ACTIVE,
      stakeholder_type: { $ne: stakeholdersTypes.PROVIDER },
      name: { $like: `%25${stakeholder_name}%25` },
    }

    fetchStakeholdersOptions(saleDispatch, params)
  }

  return (
    <>
      <Drawer
        placement='right'
        closable={false}
        onClose={handleClose}
        visible={visible}
        width='80%'
        destroyOnClose
      >
        <div>
          <Title> {'Detalle Nota de servicio'} </Title>
          <Divider className={'divider-custom-margins-users'} />
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
                  status === 'LOADING' && loading === 'fetchProjectsOptions'
                }
                optionFilterProp='children'
                disabled
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
                onSearch={debounce(handleSearchProject, 400)}
                value={sale.project_id}
                onChange={handleChange('project_id')}
                loading={
                  status === 'LOADING' && loading === 'fetchProjectsOptions'
                }
                optionFilterProp='children'
                disabled
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
                disabled
              />
            </Col>
            <Col xs={8} sm={8} md={8} lg={8}>
              <div className={'title-space-field'}>Fecha Final</div>
              <DatePicker
                style={{ width: '100%', height: '37px', borderRadius: '8px' }}
                value={sale.end_date ? moment(sale.end_date) : ''}
                onChange={handleChange('end_date')}
                format='DD-MM-YYYY'
                disabled={forbidEdition || !isAdmin}
              />
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
                status={status}
                loading={loading}
                forbidEdition={forbidEdition}
                documentServiceTypesOptionsList={
                  saleState.documentServiceTypesOptionsList
                }
                canEditAndCreate={canEditAndCreate}
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
                disabled={forbidEdition || !isAdmin}
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
                disabled={forbidEdition || !isAdmin}
              />
            </Col>
            <Col xs={12} sm={12} md={12} lg={12}>
              <h3>Quien Recibe:</h3>
              <Input
                placeholder={'Recibe'}
                size={'large'}
                value={sale.received_by}
                onChange={handleChange('received_by')}
                disabled={forbidEdition || !isAdmin}
              />
            </Col>
          </Row>
        </div>
        {!forbidEdition && isAdmin && (
          <FooterButtons
            saveData={saveData}
            cancelButton={handleClose}
            edit={true}
            cancelLink=''
          />
        )}
      </Drawer>
    </>
  )
}
export default SalesDetail
