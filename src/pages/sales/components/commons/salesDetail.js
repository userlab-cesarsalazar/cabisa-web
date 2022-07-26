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
  Button,
} from 'antd'
import FooterButtons from '../../../../components/FooterButtons'
import SaleProductsListTwo from './saleProductListTwo'
import {
  productsStatus,
  stakeholdersStatus,
  stakeholdersTypes,
  productsTypes,
} from '../../../../commons/types'
import { useSale, saleActions } from '../../context'
import { useEditableList } from '../../../../hooks'
import {
  showErrors,
  formatPhone,
  numberFormat,
  roundNumber,
} from '../../../../utils'
import { documentsStatus } from '../../../../commons/types'
import {
  editableListInitRow,
  getOnChangeProductsListCallback,
  getStatisticFromProductWithTaxes,
  billingLogicFactory,
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

  const { saveData } = billingLogicFactory({
    productsData: dataSourceTable,
    setData: setSale,
    data: sale,
    handleSaveData: saveData => updateSale(saleDispatch, saveData),
    isSaleValidation: true,
  })

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
    function updateStatistics() {
      const getStatistics = getStatisticFromProductWithTaxes(0)

      setSale(prevState => {
        const totals = dataSourceTable?.reduce((r, p) => {
          // Esta es la implementacion normal (calcula subtotal de cada producto SIN impuesto)
          // const discount = (r.discount || 0) + getProductDiscount(p)
          // const subtotal = (r.subtotal || 0) + getProductSubtotal(p)
          // const total_tax = (r.total_tax || 0) + p.unit_tax_amount * p.quantity
          // const total = subtotal + total_tax

          // Esta es la implementacion que pidio el cliente (calcula subtotal de cada producto CON impuestos)
          const {
            discountFromProductWithTaxes,
            subtotalFromProductWithTaxes,
            totalTaxFromProductWithTaxes,
          } = getStatistics(p)
          const discount = (r.discount || 0) + discountFromProductWithTaxes
          const subtotal = (r.subtotal || 0) + subtotalFromProductWithTaxes
          const total_tax = (r.total_tax || 0) + totalTaxFromProductWithTaxes
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
    },
    [setSale, dataSourceTable]
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
          <Row>
            <Col xs={24} sm={24} md={16} lg={16}>
              <Title> {'Detalle Nota de servicio'} </Title>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} style={{ textAlign: 'right' }}>
              <Button className='title-cabisa new-button'>
                Boleta No. {sale.id}
              </Button>
            </Col>
          </Row>

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
              <SaleProductsListTwo
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
                  title='Subtotal :'
                  value={getFormattedValue(sale.subtotal)}
                />
              </div>
            </Col>
            <Col span={6} style={{ textAlign: 'right' }}>
              <div className={'title-space-field'}>
                <Statistic
                  title='Impuesto :'
                  value={getFormattedValue(sale.total_tax)}
                />
              </div>
            </Col>
            <Col span={6} style={{ textAlign: 'right' }}>
              <div className={'title-space-field'}>
                <Statistic
                  title='Total :'
                  value={getFormattedValue(sale.total)}
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
