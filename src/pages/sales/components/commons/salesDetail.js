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
  Button,
  Popconfirm,
  message,
} from 'antd'
import FooterButtons from '../../../../components/FooterButtons'
import DynamicTable from '../../../../components/DynamicTable'
import Tag from '../../../../components/Tag'
import {
  productsStatus,
  stakeholdersStatus,
  productsTypes,
  documentsServiceType,
} from '../../../../commons/types'
import { useSale, saleActions } from '../../context'
import { useEditableList } from '../../../../hooks'
import {
  showErrors,
  roundNumber,
  validateDynamicTableProducts,
} from '../../../../utils'
import { appConfig, documentsStatus } from '../../../../commons/types'

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

const getColumnsDynamicTable = ({
  handleChangeDetail,
  handleRemoveDetail,
  handleSearchProduct,
  handleSearchChildProduct,
  productsOptionsList,
  childProductsOptionsList,
  status,
  loading,
  forbidEdition,
  isAdmin,
  serviceType,
}) => {
  const columns = [
    {
      title: 'Codigo',
      dataIndex: 'code', // Field that is goint to be rendered
      key: 'code',
      render: (_, record) => (
        <Input
          value={record.code}
          size={'large'}
          placeholder={'Codigo'}
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
          style={{ width: '100%', height: '40px', maxWidth: '300px' }}
          getPopupContainer={trigger => trigger.parentNode}
          showSearch
          onSearch={debounce(handleSearchProduct, 400)}
          value={record.id}
          onChange={value => handleChangeDetail('id', value, rowIndex)}
          loading={status === 'LOADING' && loading === 'fetchProductsOptions'}
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
            <Option value={record.id}>{record.description}</Option>
          )}
        </Select>
      ),
    },
  ]

  const quantityColumn = {
    title: 'Cantidad',
    dataIndex: 'product_quantity', // Field that is goint to be rendered
    key: 'product_quantity',
    render: (_, record, rowIndex) => (
      <Input
        placeholder={'Cantidad'}
        size={'large'}
        value={record.quantity}
        onChange={e => handleChangeDetail('quantity', e.target.value, rowIndex)}
        min={1}
        type='number'
        disabled={forbidEdition || !isAdmin}
      />
    ),
  }

  const priceColumn = {
    width: '30%',
    title: 'Precio',
    dataIndex: 'unit_price', // Field that is goint to be rendered
    key: 'unit_price',
    render: (_, record, rowIndex) => (
      <Input
        placeholder={'Precio'}
        size={'large'}
        value={record.unit_price}
        onChange={e =>
          handleChangeDetail('unit_price', e.target.value, rowIndex)
        }
        min={0}
        type='number'
        disabled
      />
    ),
  }

  const deleteButtonColumn = {
    title: '',
    render: (_, __, rowIndex) =>
      !forbidEdition && (
        <Popconfirm
          title={'¿Seguro de eliminar?'}
          onConfirm={() => handleRemoveDetail(rowIndex)}
        >
          <span style={{ color: 'red' }}>Eliminar</span>
        </Popconfirm>
      ),
  }

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
        optionFilterProp='children'
        loading={
          status === 'LOADING' && loading === 'fetchChildProductsOptions'
        }
        disabled={!record.id}
      >
        {childProductsOptionsList?.length > 0 ? (
          childProductsOptionsList.map(value => (
            <Option key={value.id} value={value.id}>
              {value.description}
            </Option>
          ))
        ) : (
          <Option value={record.child_id}>{record.child_description}</Option>
        )}
      </Select>
    ),
  }

  const columnsWithProduct =
    serviceType === productsTypes.SERVICE
      ? [...columns, productColumn, quantityColumn]
      : [...columns, quantityColumn]

  const columnsWithPrice = isAdmin
    ? [...columnsWithProduct, priceColumn]
    : columnsWithProduct

  return [...columnsWithPrice, deleteButtonColumn]
}

function SalesDetail({ closable, visible, isAdmin }) {
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
      closable()
    }
  }, [error, status, loading, saleDispatch, closable, visible])

  const getServiceDaysLength = (startDate, endDate) => {
    if (!startDate || !endDate) return null
    else return moment(endDate).diff(moment(startDate), 'days')
  }

  useEffect(() => {
    const getChildProduct = (products, parentProduct) => {
      const childProduct = products.find(
        p => Number(p.parent_product_id) === Number(parentProduct.id)
      )

      if (!childProduct) return {}

      return {
        child_id: childProduct.id,
        child_description: childProduct.description,
        child_unit_price: roundNumber(childProduct.unit_price),
        quantity: childProduct.quantity,
        unit_price: roundNumber(
          parentProduct.unit_price + childProduct.unit_price
        ),
      }
    }

    const productsDetails =
      currentSale.products?.length > 0
        ? currentSale.products.flatMap(p => {
            if (p.parent_product_id) return []

            return {
              ...p,
              parent_unit_price: roundNumber(p.unit_price),
              unit_price: roundNumber(p.unit_price),
              ...getChildProduct(currentSale.products, p),
            }
          })
        : []

    setDataSourceTable(productsDetails)
    setForbidEdition(currentSale.status !== documentsStatus.PENDING)
    setSale(currentSale)
    setServiceDaysLength(
      getServiceDaysLength(currentSale.start_date, currentSale.end_date)
    )
  }, [currentSale, saleDispatch])

  const setProductData = (field, value, rowIndex) => {
    if (field !== 'id' && field !== 'child_id') return

    if (field === 'id' && saleState.childProductsOptionsList.length === 0) {
      handleSearchChildProduct(null, {
        $limit: appConfig.selectsInitLimit,
        description: { $like: '%25%25' },
      })
    }

    const productsArray =
      field === 'id'
        ? saleState.productsOptionsList
        : saleState.childProductsOptionsList

    const product = productsArray.find(
      option => Number(option.id) === Number(value)
    )

    setDataSourceTable(prevState => {
      const row = prevState[rowIndex]

      const newRow = {
        ...row,
        id: field === 'id' ? product.id : row.id,
        code: field === 'id' ? product.code : row.code,
        child_id: field === 'child_id' ? product.id : row.child_id,
        parent_unit_price:
          field === 'id' ? product.unit_price : row.parent_unit_price,
        child_unit_price:
          field === 'child_id' ? product.unit_price : row.child_unit_price,
        unit_price:
          field === 'id'
            ? product.unit_price + row.child_unit_price
            : row.parent_unit_price + product.unit_price,
        quantity: 1,
      }

      return prevState.map((row, index) => (index === rowIndex ? newRow : row))
    })
  }

  const {
    handleAdd: handleAddDetail,
    handleRemove: handleRemoveDetail,
    handleChange: handleChangeDetail,
  } = useEditableList({
    state: dataSourceTable,
    setState: setDataSourceTable,
    initRow: {
      id: '',
      code: '',
      child_id: '',
      description: '',
      quantity: 0,
      parent_unit_price: 0,
      child_unit_price: 0,
      unit_price: 0,
    },
    onChange: setProductData,
  })

  const handleSearchProduct = product_description => {
    if (product_description === '') return

    const product_type =
      sale.service_type === productsTypes.SERVICE
        ? productsTypes.SERVICE
        : productsTypes.PRODUCT

    const params = {
      status: productsStatus.ACTIVE,
      stock: { $gt: 0 },
      description: { $like: `%25${product_description}%25` },
      product_type,
    }

    fetchProductsOptions(saleDispatch, params)
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

  const columnsDynamicTable = getColumnsDynamicTable({
    handleChangeDetail,
    handleRemoveDetail,
    handleSearchProduct,
    handleSearchChildProduct,
    productsOptionsList: saleState.productsOptionsList,
    childProductsOptionsList: saleState.childProductsOptionsList,
    status,
    loading,
    forbidEdition,
    isAdmin,
    serviceType: sale.service_type,
  })

  const getSaveData = () => ({
    document_id: sale.id,
    project_id: sale.project_id,
    start_date: sale.start_date,
    end_date: sale.end_date,
    dispatched_by: sale.dispatched_by,
    received_by: sale.received_by,
    comments: sale.comments,
    service_type: sale.service_type,
    related_external_document_id: null,
    products: dataSourceTable.reduce((r, p) => {
      const parentProduct = {
        product_id: p.id,
        product_quantity: !p.child_id ? Number(p.quantity) : 1,
        product_price: Number(p.parent_unit_price),
      }

      const childProduct = {
        product_id: p.child_id,
        product_quantity: Number(p.quantity),
        product_price: Number(p.child_unit_price),
        parent_product_id: p.id,
      }

      const products = !p.child_id
        ? [parentProduct]
        : [parentProduct, childProduct]

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
        stakeholder_phone: stakeholder.phone,
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
      name: { $like: `%25${stakeholder_name}%25` },
    }

    fetchStakeholdersOptions(saleDispatch, params)
  }

  const handleCancelButton = () => {
    setSaleState(saleDispatch, { currentSale: {} })
    closable()
  }

  return (
    <>
      <Drawer
        placement='right'
        closable={false}
        onClose={closable}
        visible={visible}
        width={850}
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
                    <Tag
                      type='documentsServiceType'
                      value={sale.service_type}
                    />
                  </Option>
                )}
              </Select>
            </Col>
          </Row>
          <Divider className={'divider-custom-margins-users'} />
          <h2>Detalle Entrega:</h2>
          <Row gutter={16} className={'section-space-field'}>
            <Col xs={24} sm={24} md={24} lg={24}>
              <DynamicTable
                columns={columnsDynamicTable}
                data={dataSourceTable}
              />
            </Col>
            {!forbidEdition && isAdmin && (
              <Col xs={24} sm={24} md={24} lg={24}>
                <Button
                  type='dashed'
                  className={'shop-add-turn'}
                  onClick={handleAddDetail}
                >
                  Agregar Detalle
                </Button>
              </Col>
            )}
            <Divider className={'divider-custom-margins-users'} />
          </Row>
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
            cancelButton={handleCancelButton}
            edit={true}
            cancelLink=''
          />
        )}
      </Drawer>
    </>
  )
}
export default SalesDetail
