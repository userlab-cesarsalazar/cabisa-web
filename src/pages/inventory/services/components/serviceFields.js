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
} from 'antd'
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
    setDescription(props.edit ? props.editData.name : '')
    setPrice(props.edit ? props.editData.cost : '')
    setStatus(props.edit ? props.editData.is_active : 1)
    setSpecialPermission(Cache.getItem('currentSession').rol_id !== 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible])

  const saveData = () => {
    let validate = false
    if (
      [code, description, price, status].includes('') ||
      [code, description, price, status].includes(undefined)
    ) {
      message.warning('Todos los campos son obligatorios.')
    } else {
      validate = true
    }

    const data = {
      code,
      description,
      price,
      service: 1,
      category: 1,
      is_active: status,
    }

    if (validate)
      props.saveUserData(
        props.edit,
        data,
        props.edit ? props.editData.id : null
      )
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
        cancelLink='/inventoryServices'
      />
    </>
  )
}
export default ServiceFields
