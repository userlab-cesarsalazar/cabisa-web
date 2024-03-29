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
  Select,
  Typography,
  Spin,
  message,
} from 'antd'
import FooterButtons from '../../../../components/FooterButtons'
import InventoryMovementProductsList from './inventoryMovementProductsList'
import { showErrors, formatPhone } from '../../../../utils'
import {
  productsStatus,
  stakeholdersStatus,
  stakeholdersTypes,
  productsTypes,
  appConfig,
} from '../../../../commons/types'
import { useEditableList } from '../../../../hooks'
import inventorySrc from '../../inventorySrc'

const { Title } = Typography
const { TextArea } = Input
const { Option } = Select

function InventoryMovementFields({ forbidEdition, editData, ...props }) {
  const history = useHistory()
  const [loading, setLoading] = useState([])
  const [data, setData] = useState([])
  const [productsData, setProductsData] = useState([])
  const [productsOptionsList, setProductsOptionsList] = useState([])
  const [stakeholdersOptionsList, setStakeholdersOptionsList] = useState([])

  const getDataFromEditData = editData => {
    const data = {
      document_id: editData.id,
      comments: editData.comments,
      stakeholder_id: editData.stakeholder_id,
      stakeholder_name: editData.stakeholder_name,
      stakeholder_business_man: editData.stakeholder_business_man,
      stakeholder_address: editData.stakeholder_address,
      stakeholder_phone: formatPhone(editData.stakeholder_phone),
      related_external_document_id: editData.related_external_document_id,
      start_date: editData.start_date,
    }

    const productsData = editData.products?.map(p => ({
      code: p.code,
      description: p.description,
      id: p.id,
      quantity: p.product_quantity,
      // inventory_unit_value: Number(p.product_price) + Number(p.unit_tax_amount),
      inventory_unit_value: Number(p.product_price).toFixed(2),
      tax_fee: p.tax_fee,
    }))

    return { data, productsData }
  }

  useEffect(() => {
    handleSearchStakeholder(null, {
      $limit: appConfig.selectsInitLimit,
      name: { $like: '%25%25' },
    })
    handleSearchProduct(null, {
      $limit: appConfig.selectsInitLimit,
      description: { $like: '%25%25' },
    })

    if (!editData) return
    const { data, productsData } = getDataFromEditData(editData)
    setData(data)
    setProductsData(productsData)

    return () => {
      setData([])
      setProductsData([])
    }
  }, [editData])

  const setProductData = (field, value, rowIndex) => {
    if (field !== 'id') return

    const product = productsOptionsList.find(option => option.id === value)

    setProductsData(prevState => {
      const newRow = {
        ...prevState[rowIndex],
        id: product.id,
        code: product.code,
        inventory_unit_value: product.inventory_unit_value,
        tax_fee: product.tax_fee,
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
    state: productsData,
    setState: setProductsData,
    initRow: {
      code: '',
      description: '',
      quantity: 0,
      inventory_unit_value: 0,
      tax_fee: '',
    },
    onChange: setProductData,
  })

  const handleSearchProduct = (product_description, additionalParams = {}) => {
    if (product_description === '') return

    const params = {
      description: { $like: `%25${product_description}%25` },
      status: productsStatus.ACTIVE,
      product_type: { $ne: productsTypes.SERVICE },
      ...additionalParams,
    }

    setLoading('productsOptionsList')

    inventorySrc
      .getProductsOptions(params)
      .then(products => setProductsOptionsList(products))
      .catch(error => showErrors(error))
      .finally(() => setLoading(null))
  }

  const getSaveData = () => ({
    document_id: data?.document_id,
    stakeholder_id: data.stakeholder_id,
    start_date: data.start_date,
    comments: data.comments,
    related_external_document_id: data.related_external_document_id,
    products: productsData.map(p => ({
      product_id: p.id,
      product_quantity: p.quantity,
      product_price:        
        p.inventory_unit_value,
    })),
  })

  const validateSaveData = data => {
    const errors = []
    const requiredFields = [
      { key: 'stakeholder_id', value: 'Empresa' },
      { key: 'start_date', value: 'Fecha Inicio' },
      { key: 'related_external_document_id', value: 'Nro de Documento' },
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

    const productRequiredPositions = data.products.flatMap((p, i) =>
      productsRequiredFields.some(k => !p[k] || p[k] <= 0) ? i + 1 : []
    )

    if (productRequiredPositions.length > 0) {
      productRequiredPositions.forEach(p => {
        errors.push(
          `Los campos Precio y Cantidad del producto ${p} deben ser mayor a cero`
        )
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
    try {
      const saveData = getSaveData()

      const { isInvalid, error } = validateSaveData(saveData)

      if (isInvalid) return showErrors(error)

      setLoading(saveData?.document_id ? 'updatePurchase' : 'createPurchase')

      await props.saveData(saveData)

      message.success('Venta creada exitosamente')
      onCancel()
    } catch (error) {
      showErrors(error)
    } finally {
      setLoading(null)
    }
  }

  const onCancel = () => {
    if (typeof props.onClose === 'function') props.onClose()
    else history.push('/inventoryMovements')
  }

  const getHandleChangeValue = (field, e) => {
    if (field === 'start_date' && e) return moment(e).format()

    return e?.target?.value === undefined ? e : e.target.value
  }

  const handleChange = field => e => {
    const value = getHandleChangeValue(field, e)

    if (field === 'stakeholder_id') {
      const stakeholder = stakeholdersOptionsList.find(
        option => option.id === value
      )

      return setData(prevState => ({
        ...prevState,
        stakeholder_id: stakeholder.id,
        stakeholder_address: stakeholder.address,
        stakeholder_phone: formatPhone(stakeholder.phone),
        stakeholder_business_man: stakeholder.business_man,
      }))
    }

    setData(prevState => ({
      ...prevState,
      [field]: value,
    }))
  }

  const handleSearchStakeholder = (stakeholder_name, additionalParams = {}) => {
    if (stakeholder_name === '') return

    const params = {
      name: { $like: `%25${stakeholder_name}%25` },
      status: stakeholdersStatus.ACTIVE,
      stakeholder_type: stakeholdersTypes.PROVIDER,
      ...additionalParams,
    }

    setLoading('stakeholdersOptionsList')

    inventorySrc
      .getStakeholdersOptions(params)
      .then(stakeholders => setStakeholdersOptionsList(stakeholders))
      .catch(error => showErrors(error))
      .finally(() => setLoading(null))
  }

  return (
    <Spin spinning={loading === 'createPurchase'}>
      <div>
        {props.isEditing && (
          <>
            <Title>{'Detalle de movimiento'}</Title>
            <Divider className={'divider-custom-margins-users'} />
          </>
        )}
        <Row gutter={16}>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Proveedor</div>
            <Select
              className={'single-select'}
              placeholder={'Proveedor'}
              size={'large'}
              style={{ width: '100%', height: '40px' }}
              getPopupContainer={trigger => trigger.parentNode}
              showSearch
              onSearch={debounce(handleSearchStakeholder, 400)}
              value={data.stakeholder_id}
              onChange={handleChange('stakeholder_id')}
              loading={loading === 'stakeholdersOptionsList'}
              optionFilterProp='children'
              disabled={forbidEdition || props.visible}
            >
              {stakeholdersOptionsList.length > 0 ? (
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
            <div className={'title-space-field'}>Fecha</div>
            <DatePicker
              style={{ width: '100%', height: '37px', borderRadius: '8px' }}
              value={data.start_date ? moment(data.start_date) : ''}
              onChange={handleChange('start_date')}
              format='DD-MM-YYYY'
              disabled={forbidEdition}
            />
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Nro de Documento</div>
            <Input
              placeholder={'Documento'}
              size={'large'}
              value={data.related_external_document_id}
              onChange={handleChange('related_external_document_id')}
              disabled={forbidEdition}
            />
          </Col>
        </Row>
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Encargado</div>
            <Input
              placeholder={'Encargado'}
              size={'large'}
              value={data.stakeholder_business_man}
              onChange={handleChange('stakeholder_business_man')}
              disabled
            />
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Direccion</div>
            <Input
              placeholder={'Direccion'}
              size={'large'}
              value={data.stakeholder_address}
              onChange={handleChange('stakeholder_address')}
              disabled
            />
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Telefono</div>
            <Input
              placeholder={'Telefono'}
              size={'large'}
              value={data.stakeholder_phone}
              onChange={handleChange('stakeholder_phone')}
              disabled
            />
          </Col>
        </Row>
        <Divider className={'divider-custom-margins-users'} />
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={24} sm={24} md={24} lg={24}>
            <InventoryMovementProductsList
              dataSource={productsData}
              handleAddDetail={handleAddDetail}
              handleChangeDetail={handleChangeDetail}
              handleRemoveDetail={handleRemoveDetail}
              handleSearchProduct={handleSearchProduct}
              productsOptionsList={productsOptionsList}
              loading={loading}
              forbidEdition={forbidEdition}
            />
          </Col>
        </Row>
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={24} sm={24} md={24} lg={24}>
            <div className={'title-space-field'}>Observaciones</div>
            <TextArea
              rows={4}
              value={data.comments}
              onChange={handleChange('comments')}
              disabled={forbidEdition}
            />
          </Col>
        </Row>
      </div>
      {!forbidEdition && (
        <FooterButtons
          saveData={saveData}
          cancelButton={onCancel}
          edit={true}
          cancelLink=''
        />
      )}
    </Spin>
  )
}

export default InventoryMovementFields
