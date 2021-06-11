import React, { useEffect, useState } from 'react'
import FooterButtons from '../../../../components/FooterButtons'
import { Col, Divider, Input, message, Row, Select, Typography } from 'antd'
import Tag from '../../../../components/Tag'
import { productsStatus } from '../../../../commons/types'
import { Cache } from 'aws-amplify'
const { Title } = Typography
const { Option } = Select

function ServiceFields(props) {
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [status, setStatus] = useState(1)

  const [specialPermission, setSpecialPermission] = useState(false)

  useEffect(() => {
    setCode(props.edit ? props.editData.code : '')
    setDescription(props.edit ? props.editData.description : '')
    setPrice(props.edit ? props.editData.unit_price : '')
    setStatus(props.edit ? props.editData.status : productsStatus.ACTIVE)
    setSpecialPermission(Cache.getItem('currentSession').rol_id !== 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible])

  const saveData = () => {
    const requiredValues = [code, description, price, status]

    if (requiredValues.some(v => !v))
      return message.warning('Todos los campos son obligatorios.')

    const data = {
      id: props?.editData?.id,
      code,
      description,
      unit_price: price,
      status,
    }

    props.saveUserData(data)
  }

  return (
    <>
      <div>
        {props.edit && (
          <>
            <Title>{props.edit ? 'Editar Servicio' : 'Nuevo Servicio'}</Title>
            <Divider className={'divider-custom-margins-users'} />
          </>
        )}
        {/*Fields section*/}
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={8} sm={8} md={8} lg={8}>
            <div className={'title-space-field'}>Codigo</div>
            <Input
              value={code}
              placeholder={'Codigo'}
              size={'large'}
              onChange={value => setCode(value.target.value)}
            />
          </Col>
          <Col xs={16} sm={16} md={16} lg={16}>
            <div className={'title-space-field'}>Descripcion</div>
            <Input
              value={description}
              placeholder={'Descripcion'}
              size={'large'}
              onChange={value => setDescription(value.target.value)}
            />
          </Col>
        </Row>
        <Row gutter={16} className={'section-space-field'}>
          {props.canViewPrice && (
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
          )}
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
              {props.serviceStatusList?.map(value => (
                <Option key={value} value={value}>
                  <Tag type='productStatus' value={value} />
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
        {/*End Fields section*/}
      </div>
      <FooterButtons
        saveData={saveData}
        cancelButton={props.cancelButton}
        edit={props.edit}
        cancelLink='/inventoryServices'
      />
    </>
  )
}
export default ServiceFields
