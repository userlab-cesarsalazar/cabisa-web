import React, { useEffect, useState } from 'react'
import FooterButtons from '../../../components/FooterButtons'
import { Col, Divider, Input, message, Row, Typography } from 'antd'
const { Title } = Typography

function InventoryFields(props) {
  const [code, setCode] = useState('')
  const [serie, setSerie] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')

  useEffect(() => {
    setCode(props.edit ? props.editData.code : '')
    setSerie(props.edit ? props.editData.serie : '')
    setDescription(props.edit ? props.editData.description : '')
    setPrice(props.edit ? props.editData.price : '')

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible])

  const saveData = () => {
    let validate = false
    if (
      [code, serie, description, price].includes('') ||
      [code, serie, description, price].includes(undefined)
    ) {
      message.warning('Todos los campos son obligatorios')
    } else {
      validate = true
    }

    const data = {
      code,
      serie,
      description,
      price,
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
          <Col xs={12} sm={12} md={12} lg={12}>
            <div className={'title-space-field'}>Descripcion</div>
            <Input
              value={description}
              placeholder={'Descripcion'}
              size={'large'}
              onChange={value => setDescription(value.target.value)}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12}>
            <div className={'title-space-field'}>Costo</div>
            <Input
              type={'number'}
              value={price}
              placeholder={'Costo'}
              size={'large'}
              onChange={value => setPrice(value.target.value)}
            />
          </Col>
        </Row>
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