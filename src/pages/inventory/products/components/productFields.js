import React, { useEffect, useState } from 'react'
import FooterButtons from '../../../../components/FooterButtons'
import {
  Col,
  Divider,
  Input,
  message,
  Row,
  Select,
  Tag,
  Typography,
  Upload,
} from 'antd'

import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { Cache } from 'aws-amplify'
import { getBase64 } from '../../../../utils/Utils'
const { Title } = Typography
const { Option } = Select

function ProductFields(props) {
  const [code, setCode] = useState('')
  const [serie, setSerie] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [serviceCategory, setServiceCategory] = useState(null)
  const [engineNumber, setEngineNumber] = useState('')
  const [specialPermission, setSpecialPermission] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    setCode(props.edit ? props.editData.code : '')
    setSerie(props.edit ? props.editData.serial_number : '')
    setDescription(props.edit ? props.editData.name : '')
    setPrice(props.edit ? props.editData.cost : '')
    setServiceCategory(props.edit ? props.editData.service_type_id : null)
    setEngineNumber(props.edit ? props.editData.engine_number : '')
    setSpecialPermission(Cache.getItem('currentSession').rol_id !== 1)
    setStatus(props.edit ? props.editData.is_active : 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible])

  const saveData = () => {
    let validate = false
    if (
      [code, serie, description, price, serviceCategory].includes('') ||
      [code, serie, description, price, serviceCategory].includes(undefined)
    ) {
      message.warning('Todos los campos son obligatorios.')
    } else {
      validate = true
    }

    const data = {
      code,
      serie,
      description,
      price,
      service: serviceCategory,
      category: 2,
      engine_number: engineNumber,
      is_active: status,
    }

    if (validate)
      props.saveUserData(
        props.edit,
        data,
        props.edit ? props.editData.id : null
      )
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
    // if (info.file.status === 'uploading') {
    //   setLoading(true)
    //   return
    // }
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
            <div className={'title-space-field'}>Precio de venta</div>
            <Input
              disabled={specialPermission}
              type={'number'}
              value={price}
              placeholder={'Costo'}
              size={'large'}
              onChange={value => setPrice(value.target.value)}
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
              <Option value={2}>
                <Tag color='blue'>Equipo</Tag>
              </Option>
              <Option value={3}>
                <Tag color='orange'>Repuesto</Tag>
              </Option>
            </Select>
          </Col>
        </Row>
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Estado</div>
            <Select
              defaultValue={1}
              value={status}
              className={'single-select'}
              placeholder={'Estado'}
              size={'large'}
              style={{ width: '100%', height: '40px' }}
              getPopupContainer={trigger => trigger.parentNode}
              onChange={value => setStatus(value)}
            >
              <Option value={0}>
                <Tag color='#f50'>Inactivo</Tag>
              </Option>
              <Option value={1}>
                <Tag color='#87d068'>Activo</Tag>
              </Option>
              <Option value={2}>
                <Tag color='grey'>Bloqueado</Tag>
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
        cancelLink='/inventoryProducts'
      />
    </>
  )
}
export default ProductFields
