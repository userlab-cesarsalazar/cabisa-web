import React, { useEffect, useState } from 'react'
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
import {
  productsStatus,
  projectsStatus,
  stakeholdersStatus,
} from '../../../../commons/types'
import { useSale, saleActions } from '../../context'
import { useEditableList } from '../../../../hooks'
import { showErrors } from '../../../../utils'
import { documentsStatus } from '../../../../commons/types'

const { Title } = Typography
const { TextArea } = Input
const { Option } = Select
const {
  fetchProductsOptions,
  fetchProjectsOptions,
  fetchStakeholdersOptions,
  updateSale,
  fetchSales,
  setSaleState,
} = saleActions

const getColumnsDynamicTable = ({
  handleChangeDetail,
  handleRemoveDetail,
  handleSearchProduct,
  productsOptionsList,
  status,
  loading,
  forbidEdition,
  canViewPrice,
}) => {
  const columns = [
    {
      width: '25%',
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
      width: '40%',
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
          disabled={forbidEdition || !canViewPrice}
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
    {
      width: '15%',
      title: 'Cantidad',
      dataIndex: 'product_quantity', // Field that is goint to be rendered
      key: 'product_quantity',
      render: (_, record, rowIndex) => (
        <Input
          placeholder={'Cantidad'}
          size={'large'}
          value={record.quantity}
          onChange={e =>
            handleChangeDetail('quantity', e.target.value, rowIndex)
          }
          min={0}
          type='number'
          disabled={forbidEdition || !canViewPrice}
        />
      ),
    },
  ]

  const priceColumn = {
    width: '20%',
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

  return canViewPrice ? [...columns, priceColumn, deleteButtonColumn] : columns
}

function SalesDetail({ setExistMoreInfo, closable, visible, canViewPrice }) {
  const [forbidEdition, setForbidEdition] = useState(false)
  const [sale, setSale] = useState([])
  const [dataSourceTable, setDataSourceTable] = useState([])
  const [serviceDaysLength, setServiceDaysLength] = useState(null)

  const [
    { error, loading, status, currentSale, ...saleState },
    saleDispatch,
  ] = useSale()

  useEffect(() => {
    if (!visible) return

    if (status === 'ERROR') {
      showErrors(error)
      setSaleState(saleDispatch, { loading: null, error: null, status: 'IDLE' })
    }

    if (status === 'SUCCESS' && loading === 'updateSale') {
      fetchSales(saleDispatch)
      message.success('Nota de Servicio actualizada exitosamente')
      setExistMoreInfo(false)
      closable()
    }
  }, [
    error,
    status,
    loading,
    saleDispatch,
    setExistMoreInfo,
    closable,
    visible,
  ])

  const getServiceDaysLength = (startDate, endDate) => {
    if (!startDate || !endDate) return null
    else return moment(endDate).diff(moment(startDate), 'days')
  }

  useEffect(() => {
    setForbidEdition(currentSale.status !== documentsStatus.PENDING)
    setSale(currentSale)
    setDataSourceTable(currentSale.products)

    setServiceDaysLength(
      getServiceDaysLength(currentSale.start_date, currentSale.end_date)
    )
  }, [currentSale, saleDispatch])

  const setProductData = (field, value, rowIndex) => {
    if (field !== 'id') return

    const product = saleState.productsOptionsList.find(
      option => option.id === value
    )

    setDataSourceTable(prevState => {
      const newRow = {
        ...prevState[rowIndex],
        id: product.id,
        code: product.code,
        unit_price: product.unit_price,
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
      code: '',
      description: '',
      quantity: 0,
      unit_price: 0,
    },
    onChange: setProductData,
  })

  const handleSearchProduct = product_description => {
    if (product_description === '') return

    const params = {
      status: productsStatus.ACTIVE,
      stock: { $gt: 0 },
      description: { $like: `%25${product_description}%25` },
    }

    fetchProductsOptions(saleDispatch, params)
  }

  const columnsDynamicTable = getColumnsDynamicTable({
    handleChangeDetail,
    handleRemoveDetail,
    handleSearchProduct,
    productsOptionsList: saleState.productsOptionsList,
    status,
    loading,
    forbidEdition,
    canViewPrice,
  })

  const getSaveData = () => ({
    document_id: sale.id,
    project_id: sale.project_id,
    start_date: sale.start_date,
    end_date: sale.end_date,
    received_by: sale.received_by,
    comments: sale.comments,
    related_external_document_id: null,
    products: dataSourceTable.map(p => ({
      product_id: p.id,
      product_quantity: p.quantity,
      product_price: p.unit_price,
    })),
  })

  const validateSaveData = data => {
    const errors = []
    const requiredFields = [
      { key: 'project_id', value: 'Proyecto' },
      { key: 'start_date', value: 'Fecha Inicio' },
      { key: 'end_date', value: 'Fecha Final' },
      { key: 'received_by', value: 'Quien Recibe' },
    ]
    const requiredErrors = requiredFields.flatMap(field =>
      !data[field.key] ? field.value : []
    )

    if (requiredErrors.length > 0) {
      requiredErrors.forEach(k => {
        errors.push(`El campo ${k} es obligatorio`)
      })
    }

    const productsRequiredFields = [
      'product_id',
      'product_quantity',
      'product_price',
    ]
    const productRequiredPositions = data.products.flatMap((p, i) =>
      productsRequiredFields.some(k => !p[k]) ? i + 1 : []
    )

    if (productRequiredPositions.length > 0) {
      productRequiredPositions.forEach(p => {
        errors.push(`Todos los campos del producto ${p} son obligatorios`)
      })
    }

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

    setSale(prevState => ({
      ...prevState,
      [field]: value,
    }))
  }

  const handleSearchProject = project_name => {
    if (project_name === '') return

    const params = {
      status: { $ne: projectsStatus.FINISHED },
      stakeholder_id: sale.stakeholder_id,
      name: { $like: `%25${project_name}%25` },
    }

    fetchProjectsOptions(saleDispatch, params)
  }

  const handleSearchStakeholder = stakeholder_name => {
    if (stakeholder_name === '') return

    const params = {
      status: stakeholdersStatus.ACTIVE,
      name: { $like: `$%25{stakeholder_name}%25` },
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
                disabled={forbidEdition || !canViewPrice}
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
          <Divider className={'divider-custom-margins-users'} />
          <h2>Detalle Entrega:</h2>
          <Row gutter={16} className={'section-space-field'}>
            <Col xs={24} sm={24} md={24} lg={24}>
              <DynamicTable
                columns={columnsDynamicTable}
                data={dataSourceTable}
              />
            </Col>
            {!forbidEdition && canViewPrice && (
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
                disabled={forbidEdition || !canViewPrice}
              />
            </Col>
          </Row>
          <Row gutter={16} className={'section-space-field'}>
            <Col xs={12} sm={12} md={12} lg={12}>
              <h3>Quien Entrega:</h3>
              <Input
                placeholder={'Entrega'}
                size={'large'}
                value={sale.creator_name}
                onChange={handleChange('creator_name')}
                disabled
              />
            </Col>
            <Col xs={12} sm={12} md={12} lg={12}>
              <h3>Quien Recibe:</h3>
              <Input
                placeholder={'Recibe'}
                size={'large'}
                value={sale.received_by}
                onChange={handleChange('received_by')}
                disabled={forbidEdition || !canViewPrice}
              />
            </Col>
          </Row>
        </div>
        {!forbidEdition && canViewPrice && (
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
