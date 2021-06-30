import React, { useEffect, useState } from 'react'
import {
  productsStatus,
  productsCategories,
  productsTaxes,
} from '../../../../commons/types'
import FooterButtons from '../../../../components/FooterButtons'
import Tag from '../../../../components/Tag'
import {
  Col,
  Divider,
  Input,
  message,
  Row,
  Select,
  Typography,
  Upload,
} from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { Cache } from 'aws-amplify'
import { getBase64 } from '../../../../utils'
const { Title } = Typography
const { Option } = Select

function ProductFields(props) {
  const [code, setCode] = useState('')
  const [serie, setSerie] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [serviceCategory, setServiceCategory] = useState(null)
  const [specialPermission, setSpecialPermission] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)
  const [status, setStatus] = useState(null)
  const [taxId, setTaxId] = useState(null)

  useEffect(() => {
    setLoading(props.loading)
  }, [props.loading])

  useEffect(() => {
    setImageUrl(props.edit ? props.editData.image_url : '')
    setCode(props.edit ? props.editData.code : '')
    setSerie(props.edit ? props.editData.serial_number : '')
    setDescription(props.edit ? props.editData.description : '')
    setPrice(props.edit ? props.editData.unit_price : '')
    setServiceCategory(
      props.edit
        ? props.editData.product_category
        : productsCategories.EQUIPMENT
    )
    setSpecialPermission(Cache.getItem('currentSession').rol_id !== 1)
    setStatus(props.edit ? props.editData.status : productsStatus.ACTIVE)
    setTaxId(props.edit ? props.editData.tax_id : productsTaxes.IVA)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible])

  const saveData = () => {
    const errors = []
    const requiredValues = [
      code,
      serie,
      description,
      price,
      serviceCategory,
      taxId,
    ]

    if (requiredValues.some(v => !v))
      errors.push('Todos los campos son obligatorios.')
    if (price < 0)
      errors.push('El Precio de venta debe ser mayor o igual a cero.')

    if (errors.length > 0) return errors.forEach(e => message.warning(e))

    const data = {
      id: props?.editData?.id,
      code,
      serial_number: serie,
      description,
      unit_price: price,
      product_category: serviceCategory,
      status,
      tax_id: taxId,
      image_url: imageUrl,
    }

    props.saveUserData(data)
  }

  const beforeUpload = file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!')
    }
    return isJpgOrPng && isLt2M
  }

  const handleChange = info => {
    if (info.file.status === 'uploading') {
      getBase64(info.file.originFileObj, imageUrl => {
        setImageUrl(imageUrl)
        setLoading(false)
      })
    }
  }

  const UploadButton = () => {
    return (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div>Subir foto</div>
      </div>
    )
  }

  return (
    <>
      <div>
        {props.edit && (
          <>
            <Title>{props.edit ? 'Editar Producto' : 'Nuevo Producto'}</Title>
            <Divider className={'divider-custom-margins-users'} />
          </>
        )}
        {/*Fields section*/}
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={10} sm={10} md={10} lg={10}>
            <div className={'title-space-field'}>Codigo</div>
            <Input
              value={code}
              placeholder={'Codigo'}
              size={'large'}
              onChange={value => setCode(value.target.value)}
            />
          </Col>
          <Col xs={10} sm={10} md={10} lg={10}>
            <div className={'title-space-field'}>No. Serie</div>
            <Input
              value={serie}
              placeholder={'No. Serie'}
              size={'large'}
              onChange={value => setSerie(value.target.value)}
            />
          </Col>
          <Col xs={4} sm={4} md={4} lg={4} style={{ textAlign: 'center' }}>
            <Upload
              name='avatar'
              listType='picture-card'
              className='avatar-uploader'
              showUploadList={false}
              onChange={handleChange}
              beforeUpload={beforeUpload}
              maxCount={1}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt='avatar'
                  style={{ width: '102px', height: '102px' }}
                />
              ) : (
                UploadButton()
              )}
            </Upload>
          </Col>
        </Row>
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Descripcion</div>
            <Input
              value={description}
              placeholder={'Descripcion'}
              size={'large'}
              onChange={value => setDescription(value.target.value)}
            />
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Categoria</div>
            <Select
              value={serviceCategory}
              className={'single-select'}
              placeholder={'Tipo de servicio'}
              size={'large'}
              style={{ width: '100%', height: '40px' }}
              getPopupContainer={trigger => trigger.parentNode}
              onChange={value => setServiceCategory(value)}
            >
              {props.productCategoriesList?.map(value => (
                <Option key={value} value={value}>
                  <Tag type='productCategories' value={value} />
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Estado</div>
            <Select
              defaultValue={productsStatus.ACTIVE}
              value={status}
              className={'single-select'}
              placeholder={'Estado'}
              size={'large'}
              style={{ width: '100%', height: '40px' }}
              getPopupContainer={trigger => trigger.parentNode}
              onChange={value => setStatus(value)}
            >
              {props.productStatusList?.map(value => (
                <Option key={value} value={value}>
                  <Tag type='productStatus' value={value} />
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Impuesto</div>
            <Select
              value={taxId}
              className={'single-select'}
              placeholder={'Tipo de impuesto'}
              size={'large'}
              style={{ width: '100%', height: '40px' }}
              getPopupContainer={trigger => trigger.parentNode}
              onChange={value => setTaxId(value)}
            >
              {props.productsTaxesList?.map(t => (
                <Option key={t.id} value={t.id}>
                  {`${t.name} - (${t.fee}%)`}
                </Option>
              ))}
            </Select>
          </Col>
          {props.isAdmin && (
            <Col xs={8} sm={8} md={8} lg={8}>
              <div className={'title-space-field'}>Precio de venta</div>
              <Input
                disabled={specialPermission}
                type={'number'}
                value={price}
                placeholder={'Precio'}
                size={'large'}
                onChange={value => setPrice(value.target.value)}
              />
            </Col>
          )}
        </Row>
        {/*End Fields section*/}
      </div>
      <FooterButtons
        saveData={saveData}
        cancelButton={props.cancelButton}
        edit={props.edit}
        cancelLink='/inventoryProducts'
      />
    </>
  )
}
export default ProductFields
