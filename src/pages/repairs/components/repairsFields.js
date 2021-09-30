import React, { useCallback, useEffect, useState } from 'react'
import debounce from 'lodash/debounce'
import moment from 'moment'
import {
  Statistic,
  Col,
  Divider,
  Input,
  Row,
  Typography,
  DatePicker,
  Select,
} from 'antd'
import FooterButtons from '../../../components/FooterButtons'
import { numberFormat, showErrors } from '../../../utils'
import {
  appConfig,
  productsTypes,
  productsStatus,
  productsCategories,
  documentsStatus,
} from '../../../commons/types'
import { useEditableList } from '../../../hooks'
import RepairsSrc from '../repairsSrc'
import RepairProductsList from './repairProductsList'
import {
  editableListInitRow,
  getOnChangeProductsListCallback,
  getProductSubtotal,
} from '../../billing/components/billingFields'

const { Title } = Typography
const { TextArea } = Input
const { Option } = Select
const { getFormattedValue } = numberFormat()

const getRepairDaysLength = (startDate, endDate) => {
  if (!startDate || !endDate) return null
  else return moment(endDate).diff(moment(startDate), 'days')
}

const getSaveData = (data, products) => ({
  document_id: data.document_id,
  product_id: data.product_id,
  description: data.description,
  start_date: data.start_date ? new Date(data.start_date).toISOString() : null,
  end_date: data.end_date ? new Date(data.end_date).toISOString() : null,
  products: products.map(p => ({
    product_id: Number(p.id),
    product_quantity: Number(p.quantity),
  })),
})

function RepairsFields({ isEditing, editData, setLoading, loading, ...props }) {
  const [data, setData] = useState({})
  const [productsData, setProductsData] = useState([])
  const [partProductsOptionsList, setPartProductsOptionsList] = useState([])
  const [
    equipmentProductsOptionsList,
    setEquipmentProductsOptionsList,
  ] = useState([])
  const [repairDaysLength, setRepairDaysLength] = useState(null)

  const handleSearchEquipmentProduct = useCallback(
    (product_description, additionalParams = {}) => {
      if (product_description === '') return

      const params = {
        status: productsStatus.ACTIVE,
        stock: { $gt: 0 },
        description: { $like: `%25${product_description || ''}%25` },
        product_type: { $ne: productsTypes.SERVICE },
        product_category: productsCategories.EQUIPMENT,
        ...additionalParams,
      }

      setLoading(true)

      RepairsSrc.getProductsOptions(params)
        .then(data => setEquipmentProductsOptionsList(data))
        .catch(error => showErrors(error))
        .finally(() => setLoading(false))
    },
    [setLoading]
  )

  useEffect(() => {
    if (!editData) return

    const products = editData.products.map(p => ({
      ...editableListInitRow,
      ...p,
      base_unit_price: p.unit_price,
      parent_base_unit_price: p.unit_price,
      parent_unit_price: p.unit_price,
      subtotal: p.unit_price * p.quantity,
    }))

    setRepairDaysLength(
      getRepairDaysLength(editData.start_date, editData.end_date)
    )
    setData(editData)
    setProductsData(products)

    return () => {
      setData({})
      setProductsData([])
    }
  }, [editData])

  useEffect(() => {
    if (isEditing) return

    handleSearchEquipmentProduct(null, {
      $limit: appConfig.selectsInitLimit,
      description: { $like: '%25%25' },
    })
  }, [isEditing, handleSearchEquipmentProduct])

  useEffect(
    function updateSaleSubtotal() {
      const subtotal_amount = productsData?.reduce(
        (r, p) => r + getProductSubtotal(p),
        0
      )

      setData(prevState => ({ ...prevState, subtotal_amount }))
    },
    [productsData]
  )

  const handleSearchPartProduct = product_description => {
    if (product_description === '') return

    const params = {
      status: productsStatus.ACTIVE,
      stock: { $gt: 0 },
      description: { $like: `%25${product_description || ''}%25` },
      product_type: { $ne: productsTypes.SERVICE },
      product_category: productsCategories.PART,
    }

    setLoading(true)

    RepairsSrc.getProductsOptions(params)
      .then(data => setPartProductsOptionsList(data))
      .catch(error => showErrors(error))
      .finally(() => setLoading(false))
  }

  const updateTotals = (field, value, rowIndex) => {
    const onChangeListCallback = getOnChangeProductsListCallback({
      productsOptionsList: partProductsOptionsList,
      childProductsOptionsList: [],
      discountValue: 0,
    })

    const setProductsDataCallback = onChangeListCallback(field, value, rowIndex)

    setProductsData(setProductsDataCallback)
  }

  const {
    handleChange: handleChangeDetail,
    handleAdd: handleAddDetail,
    handleRemove: handleRemoveDetail,
  } = useEditableList({
    state: productsData,
    setState: setProductsData,
    initRow: editableListInitRow,
    onChange: updateTotals,
  })

  const handleChange = field => e => {
    const value = e?.target?.value === undefined ? e : e.target.value

    if (field === 'start_date') {
      const repairDaysLength = getRepairDaysLength(value, data.end_date)
      setRepairDaysLength(repairDaysLength)
    }

    if (field === 'end_date') {
      const repairDaysLength = getRepairDaysLength(data.start_date, value)
      setRepairDaysLength(repairDaysLength)
    }

    if (field === 'product_id') {
      const product = equipmentProductsOptionsList.find(
        p => Number(p.id) === Number(value)
      )

      setData(prevState => ({
        ...prevState,
        code: product.code,
        serial_number: product.serial_number,
      }))
    }

    setData(prevState => ({
      ...prevState,
      [field]: value,
    }))
  }

  const validateSaveData = data => {
    const errors = []
    const requiredFields = [
      { key: 'product_id', value: 'Equipo a Reparar' },
      { key: 'start_date', value: 'Fecha Inicial' },
    ]

    const requiredErrors = requiredFields.flatMap(field =>
      !data[field.key] ? field.value : []
    )

    if (requiredErrors.length > 0) {
      requiredErrors.forEach(k => {
        errors.push(`El campo ${k} es obligatorio`)
      })
    }

    const productsRequiredFields = ['product_id', 'product_quantity']

    const productRequiredPositions = data.products.flatMap((p, i) =>
      productsRequiredFields.some(k => !p[k] || p[k] < 0) ? i + 1 : []
    )

    if (productRequiredPositions.length > 0) {
      productRequiredPositions.forEach(p => {
        errors.push(
          `El campo Cantidad del producto ${p} deben ser mayor a cero`
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

  const saveData = () => {
    const saveData = getSaveData(data, productsData)

    const { isInvalid, error } = validateSaveData(saveData)

    if (isInvalid) return showErrors(error)

    props.saveData(saveData)
  }

  return (
    <>
      <div>
        {isEditing && (
          <>
            <Title>Editar Orden de Reparacion</Title>
            <Divider className={'divider-custom-margins-users'} />
          </>
        )}

        <Row gutter={16} className={'section-space-field'}>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Equipo a Reparar</div>
            <Select
              className={'single-select'}
              placeholder={'Equipo a Reparar'}
              size={'large'}
              style={{ width: '100%', height: '40px' }}
              getPopupContainer={trigger => trigger.parentNode}
              showSearch
              onSearch={debounce(handleSearchEquipmentProduct, 400)}
              value={data.product_id}
              onChange={handleChange('product_id')}
              loading={props.loading}
              optionFilterProp='children'
              disabled={isEditing}
            >
              {equipmentProductsOptionsList.length > 0 ? (
                equipmentProductsOptionsList?.map(value => (
                  <Option key={value.id} value={value.id}>
                    {value.description}
                  </Option>
                ))
              ) : (
                <Option value={data.product_id}>
                  {data.product_description}
                </Option>
              )}
            </Select>
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Codigo</div>
            <Input
              style={{ height: '40px' }}
              value={data.code}
              onChange={handleChange('code')}
              disabled
            />
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Nro de Serie</div>
            <Input
              size={'large'}
              style={{ height: '40px' }}
              value={data.serial_number}
              onChange={handleChange('serial_number')}
              disabled
            />
          </Col>
        </Row>

        <Row gutter={16} className={'section-space-field'}>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Fecha Inicial</div>
            <DatePicker
              style={{ width: '100%', height: '40px', borderRadius: '8px' }}
              placeholder='Fecha inicial'
              format='DD-MM-YYYY'
              value={data.start_date ? moment(data.start_date) : ''}
              onChange={handleChange('start_date')}
              disabled={isEditing}
            />
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Fecha Final</div>
            <DatePicker
              style={{ width: '100%', height: '40px', borderRadius: '8px' }}
              placeholder='Fecha final'
              format='DD-MM-YYYY'
              value={data.end_date ? moment(data.end_date) : ''}
              onChange={handleChange('end_date')}
              disabled={isEditing && data.status !== documentsStatus.PENDING}
            />
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>
              Duración de la reparacion (dias)
            </div>
            <Input
              size={'large'}
              style={{ height: '40px' }}
              value={repairDaysLength}
              disabled
            />
          </Col>
        </Row>

        <Row gutter={16} className={'section-space-field'}>
          <Col xs={24} sm={24} md={24} lg={24}>
            <div className={'title-space-field'}>Descripcion</div>
            <TextArea
              rows={4}
              value={data.description}
              onChange={handleChange('description')}
              disabled={isEditing && data.status !== documentsStatus.PENDING}
            />
          </Col>
        </Row>

        <Divider className={'divider-custom-margins-users'} />

        <RepairProductsList
          dataSource={productsData}
          handleAddDetail={handleAddDetail}
          handleChangeDetail={handleChangeDetail}
          handleRemoveDetail={handleRemoveDetail}
          handleSearchProduct={handleSearchPartProduct}
          productsOptionsList={partProductsOptionsList}
          forbidEdition={isEditing && data.status !== documentsStatus.PENDING}
        />

        <Divider className={'divider-custom-margins-users'} />

        <Row gutter={16} style={{ textAlign: 'right' }} justify='end'>
          <Col span={6} style={{ textAlign: 'right' }}>
            <div className={'title-space-field'}>
              <Statistic
                title='Total :'
                value={getFormattedValue(data.subtotal_amount)}
              />
            </div>
          </Col>
        </Row>
      </div>

      {(!isEditing ||
        (isEditing && data.status === documentsStatus.PENDING)) && (
        <FooterButtons
          saveData={saveData}
          cancelButton={props.cancelButton}
          edit={isEditing}
          cancelLink='/repairs'
        />
      )}
    </>
  )
}

export default RepairsFields
