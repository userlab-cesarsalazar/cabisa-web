import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import debounce from 'lodash/debounce'
import moment from 'moment'
import {
  Col,
  Divider,
  Input,
  Row,
  DatePicker,
  Button,
  Select,
  Popconfirm,
  message,
  Spin,
} from 'antd'
import FooterButtons from '../../../../components/FooterButtons'
import HeaderPage from '../../../../components/HeaderPage'
import DynamicTable from '../../../../components/DynamicTable'
import { useSale, saleActions } from '../../context'
import { showErrors, validateDynamicTableProducts } from '../../../../utils'
import { productsStatus } from '../../../../commons/types'
import { useEditableList } from '../../../../hooks'
const {
  fetchProductsOptions,
  fetchProjectsOptions,
  fetchStakeholdersOptions,
  createSale,
  setSaleState,
} = saleActions

const { TextArea } = Input
const { Option } = Select

const getColumnsDynamicTable = ({
  handleChangeDetail,
  handleRemoveDetail,
  handleSearchProduct,
  productsOptionsList,
  status,
  loading,
  isAdmin,
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
    render: (_, __, rowIndex) => (
      <>
        <Popconfirm
          title={'¿Seguro de eliminar?'}
          onConfirm={() => handleRemoveDetail(rowIndex)}
        >
          <span style={{ color: 'red' }}>Eliminar</span>
        </Popconfirm>
      </>
    ),
  }

  const columnsWithPrice = isAdmin ? [...columns, priceColumn] : columns

  return [...columnsWithPrice, deleteButtonColumn]
}

function NewNoteView({ isAdmin }) {
  const history = useHistory()
  const [sale, setSale] = useState([])
  const [dataSourceTable, setDataSourceTable] = useState([])
  const [serviceDaysLength, setServiceDaysLength] = useState(null)

  const [{ error, loading, status, ...saleState }, saleDispatch] = useSale()

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
      code: '',
      description: '',
      quantity: 0,
      unit_price: 0,
    },
    onChange: setProductData,
  })

  const getServiceDaysLength = (startDate, endDate) => {
    if (!startDate || !endDate) return null
    else return moment(endDate).diff(moment(startDate), 'days')
  }

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
    isAdmin,
  })

  const getSaveData = () => ({
    stakeholder_id: sale.stakeholder_id,
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
      { key: 'stakeholder_id', value: 'Empresa' },
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
    if (project_name === '' || !sale.stakeholder_id) return

    const params = {
      stakeholder_id: sale.stakeholder_id,
      name: { $like: `%25${project_name}%25` },
    }

    fetchProjectsOptions(saleDispatch, params)
  }

  const handleSearchStakeholder = stakeholder_name => {
    if (stakeholder_name === '') return

    const params = {
      name: { $like: `%25${stakeholder_name}%25` },
    }

    fetchStakeholdersOptions(saleDispatch, params)
  }

  const handleCancelButton = () => history.push('/sales')

  // Can not select days before today
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
                status === 'LOADING' && loading === 'fetchProjectsOptions'
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
              onSearch={debounce(handleSearchProject, 400)}
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
          <Col xs={24} sm={24} md={24} lg={24}>
            <Button
              type='dashed'
              className={'shop-add-turn'}
              onClick={handleAddDetail}
            >
              Agregar Detalle
            </Button>
          </Col>
          <Divider className={'divider-custom-margins-users'} />
        </Row>
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
