import React, { useEffect, useState } from 'react'
import FooterButtons from '../../../components/FooterButtons'
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
const { Title } = Typography
const { Option } = Select

function InventoryFields(props) {
  const [code, setCode] = useState('')
  const [serie, setSerie] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [service, setService] = useState(null)
  const [engineNumber, setEngineNumber] = useState('')

  useEffect(() => {
    let serviceWarehouse = props.warehouse ? 3 : null
    setCode(props.edit ? props.editData.code : '')
    setSerie(props.edit ? props.editData.serial_number : '')
    setDescription(props.edit ? props.editData.name : '')
    setPrice(props.edit ? props.editData.cost : '')
    setService(props.edit ? props.editData.service_type_id : serviceWarehouse)
    setEngineNumber(props.edit ? props.editData.engine_number : '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible])

  const saveData = () => {
    let validate = false
    if (
      [code, serie, description, price,service].includes('') ||
      [code, serie, description, price,service].includes(undefined)
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
      service,
      category: props.warehouse ? 2 : 1,
      engine_number:engineNumber
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
            <Title>{props.edit ? 'Editar Item' : 'Nuevo Item'}</Title>
            <Divider className={'divider-custom-margins-users'} />
          </>
        )}
        {/*Fields section*/}
        <Row gutter={16} className={'section-space-field'}>
          <Col xs={12} sm={12} md={12} lg={12}>
            <div className={'title-space-field'}>Codigo</div>
            <Input
              value={code}
              placeholder={'Codigo'}
              size={'large'}
              onChange={value => setCode(value.target.value)}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <div className={'title-space-field'}>No. Serie</div>
            <Input
              value={serie}
              placeholder={'No. Serie'}
              size={'large'}
              onChange={value => setSerie(value.target.value)}
            />
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
            <div className={'title-space-field'}>Costo</div>
            <Input
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
              defaultValue={props.warehouse && 3}
              value={service}
              disabled={props.warehouse}
              className={'single-select'}
              placeholder={'Tipo de servicio'}
              size={'large'}
              style={{ width: '100%', height: '40px' }}
              getPopupContainer={trigger => trigger.parentNode}
              onChange={value => setService(value)}
            >
              <Option value={1}>
                <Tag color='#87d068'>Servicio</Tag>
              </Option>
              <Option value={2}>
                <Tag color='#f50'>Equipo</Tag>
              </Option>
              {props.warehouse && (
                <Option value={3}>
                  <Tag color='#f50'>Repuesto</Tag>
                </Option>
              )}
            </Select>
          </Col>
        </Row>
        {!props.warehouse && (
            <Row gutter={16} className={'section-space-field'}>
              <Col xs={8} sm={8} md={8} lg={8}>
                <div className={'title-space-field'}>Número de Motor</div>
                <Input
                    value={engineNumber}
                    placeholder={'Número de Motor'}
                    size={'large'}
                    onChange={value => setEngineNumber(value.target.value)}
                />
              </Col>
            </Row>
        )}


        {/*End Fields section*/}
      </div>
      <FooterButtons
        saveData={saveData}
        cancelButton={props.cancelButton}
        edit={props.edit}
        cancelLink='/inventory'
      />
    </>
  )
}
export default InventoryFields
