import React, { useEffect, useState } from 'react'
import FooterButtons from '../../../../components/FooterButtons'
import {
  Col,
  DatePicker,
  Divider,
  Input,
  message,
  Row,
  Select,
  Tag,
  Typography,
} from 'antd'
import moment from 'moment'
import InventorySrc from '../../inventorySrc'
import { Cache } from 'aws-amplify'
const { Title } = Typography
const { Option } = Select

function InventoryMovementFields(props) {
  const [dateCreated, setDateCreated] = useState(null)
  const [description, setDescription] = useState(null)
  const [productCode, setProductCode] = useState('')
  const [provider, setProvider] = useState('')
  const [quantity, setQuantity] = useState(null)
  const [billNumber, setBillNumber] = useState('')
  const [purchaseCost, setPurchaseCost] = useState(null)
  const [createdBy, setCreatedBy] = useState('')
  const [type, setType] = useState(null)
  const [searchProducts, setSearchProducts] = useState([])

  const [loadingSelect, setLoadingSelect] = useState(false)

  useEffect(() => {
    let userDataInfo = Cache.getItem('currentSession')
    setDateCreated(props.edit ? props.editData.dateCreated : '')
    setDescription(props.edit ? props.editData.description : undefined)
    setProductCode(props.edit ? props.editData.productCode : '')
    setProvider(props.edit ? props.editData.provider : '')
    setQuantity(props.edit ? props.editData.quantity : null)
    setBillNumber(props.edit ? props.editData.billNumber : '')
    setPurchaseCost(props.edit ? props.editData.purchaseCost : null)
    setCreatedBy(props.edit ? props.editData.createdBy : userDataInfo.userName)
    setType(props.edit ? props.editData.type : null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible])

  const saveData = () => {
    let validate = false
    if (
      [
        dateCreated,
        description,
        productCode,
        provider,
        quantity,
        billNumber,
        purchaseCost,
        createdBy,
        type,
      ].includes('') ||
      [
        dateCreated,
        description,
        productCode,
        provider,
        quantity,
        billNumber,
        purchaseCost,
        createdBy,
        type,
      ].includes(null)
    ) {
      message.warning('Todos los campos son obligatorios.')
    } else {
      validate = true
    }

    const data = {
      dateCreated,
      description,
      productCode,
      provider,
      quantity,
      billNumber,
      purchaseCost,
      createdBy,
      type,
    }

    if (validate)
      props.saveUserData(
        props.edit,
        data,
        props.edit ? props.editData.id : null
      )
  }

  const searchProductByName = data => {
    setLoadingSelect(true)
    setDescription(data)
    InventorySrc.getProductsFilter(data).then(result => {
      setLoadingSelect(false)
      setSearchProducts(result.message)
    })
  }

  const onchangeProductName = val => {
    setProductCode(val ? val.value : '')
    setDescription(val ? val.children : undefined)
  }

  return (
    <>
      <div>
        {props.edit && (
          <>
            <Title>
              {props.edit
                ? 'Editar Movimiento de inventario'
                : 'Nuevo Movimiento de inventario'}
            </Title>
            <Divider className={'divider-custom-margins-users'} />
          </>
        )}
        {/*Fields section*/}
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Fecha de ingreso</div>
            <DatePicker
              value={dateCreated ? moment(dateCreated, 'DD/MM/YYYY') : moment()}
              format={'DD/MM/YYYY'}
              placeholder={'Fecha de ingreso'}
              style={{ width: '100%', height: '40px', borderRadius: '8px' }}
              onChange={(val, stringVal) => setDateCreated(stringVal)}
            />
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Descripcion</div>

            <Select
              showSearch
              placeholder={'Buscar producto'}
              allowClear
              optionFilterProp='children'
              className={'single-select'}
              size={'large'}
              style={{ width: '100%', height: '40px' }}
              value={description}
              onChange={(val, val2) => onchangeProductName(val2)}
              onSearch={searchProductByName}
              loading={loadingSelect}
            >
              {searchProducts.length > 0 &&
                searchProducts.map(m => (
                  <Select.Option key={m.id} value={m.code}>
                    {m.description}
                  </Select.Option>
                ))}
            </Select>
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Codigo de producto</div>
            <Input
              disabled
              value={productCode}
              placeholder={'No. Serie'}
              size={'large'}
              onChange={value => setProductCode(value.target.value)}
            />
          </Col>
        </Row>
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Proveedor</div>
            <Input
              value={provider}
              placeholder={'Descripcion'}
              size={'large'}
              onChange={value => setProvider(value.target.value)}
            />
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Cantidad</div>
            <Input
              type={'number'}
              value={quantity}
              placeholder={'Costo'}
              size={'large'}
              onChange={value => setQuantity(value.target.value)}
            />
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Nro. de documento</div>
            <Input
              value={billNumber}
              placeholder={'Costo'}
              size={'large'}
              onChange={value => setBillNumber(value.target.value)}
            />
          </Col>
        </Row>
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Costo de compra</div>
            <Input
              type={'number'}
              value={purchaseCost}
              placeholder={'Costo'}
              size={'large'}
              onChange={value => setPurchaseCost(value.target.value)}
            />
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Ingresado por</div>
            <Input
              disabled
              value={createdBy}
              placeholder={'Ingresado por'}
              size={'large'}
              onChange={value => setCreatedBy(value.target.value)}
            />
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Tipo de movimiento</div>
            <Select
              value={type}
              className={'single-select'}
              placeholder={'Tipo de servicio'}
              size={'large'}
              style={{ width: '100%', height: '40px' }}
              getPopupContainer={trigger => trigger.parentNode}
              onChange={value => setType(value)}
            >
              <Option value={1}>
                <Tag color='blue'>Compra</Tag>
              </Option>
              <Option value={2}>
                <Tag color='green'>Ingreso</Tag>
              </Option>
              <Option value={3}>
                <Tag color='red'>Egreso</Tag>
              </Option>
            </Select>
          </Col>
        </Row>
        {/*End Fields section*/}
      </div>
      <FooterButtons
        saveData={saveData}
        cancelButton={props.cancelButton}
        edit={props.edit}
        cancelLink='/inventoryMovements'
      />
    </>
  )
}
export default InventoryMovementFields
