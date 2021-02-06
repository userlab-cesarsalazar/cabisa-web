import React from 'react'
import { Col, Divider, Input, Row, DatePicker, Table, Card } from 'antd'
import FooterButtons from '../../../../components/FooterButtons'
import HeaderPage from '../../../../components/HeaderPage'
const { TextArea } = Input

const columns = [
  {
    title: 'Codigo',
    dataIndex: '_code', // Field that is goint to be rendered
    key: '_code',
    render: text => <span>{text}</span>,
  },
  {
    title: 'Serie',
    dataIndex: '_serie', // Field that is goint to be rendered
    key: '_serie',
    render: text => <span>{text}</span>,
  },
  {
    title: 'Cantidad',
    dataIndex: '_quantity', // Field that is goint to be rendered
    key: '_quantity',
    render: text => <span>{text}</span>,
  },
  {
    title: 'Equipo',
    dataIndex: '_equipment', // Field that is goint to be rendered
    key: '_equipment',
    render: text => <span>{text}</span>,
  },
  {
    title: 'Estado equipo',
    dataIndex: '_equipmentState', // Field that is goint to be rendered
    key: '_equipmentState',
    render: text => <span>{text}</span>,
  },
  {
    title: 'Combustible / Horometro',
    dataIndex: '_fuel_horometer', // Field that is goint to be rendered
    key: '_fuel_horometer',
    render: text => <span>{text}</span>,
  },
]
function NewNoteView(props) {
  return (
    <>
      <HeaderPage titleButton={''} title={props.title} />
      <Card className={'card-border-radius margin-top-15'}>
        <div>
          <Row gutter={16} className={'section-space-field'}>
            <Col xs={8} sm={8} md={8} lg={8}>
              <div className={'title-space-field'}>Empresa</div>
              <Input placeholder={'Empresa'} size={'large'} />
            </Col>
            <Col xs={8} sm={8} md={8} lg={8}>
              <div className={'title-space-field'}>Dirección</div>
              <Input placeholder={'Dirección'} size={'large'} />
            </Col>
            <Col xs={8} sm={8} md={8} lg={8}>
              <div className={'title-space-field'}>Telefono</div>
              <Input placeholder={'Telefono'} size={'large'} type={'number'} />
            </Col>
          </Row>
          <Row gutter={16} className={'section-space-field'}>
            <Col xs={8} sm={8} md={8} lg={8}>
              <div className={'title-space-field'}>Proyecto</div>
              <Input placeholder={'Proyecto'} size={'large'} type={'number'} />
            </Col>
            <Col xs={8} sm={8} md={8} lg={8}>
              <div className={'title-space-field'}>Encargado</div>
              <Input placeholder={'Encargado'} size={'large'} />
            </Col>
            <Col xs={8} sm={8} md={8} lg={8}>
              <div className={'title-space-field'}>Fecha</div>
              <DatePicker
                style={{ width: '100%', height: '37px', borderRadius: '8px' }}
              />
            </Col>
          </Row>
          <Divider className={'divider-custom-margins-users'} />
          <h2>Detalle Entrega:</h2>
          <Row gutter={16} className={'section-space-field'}>
            <Col xs={24} sm={24} md={24} lg={24}>
              <Table
                scroll={{ y: 250 }}
                loading={false}
                className={'CustomTableClass'}
                dataSource={[]}
                columns={columns}
                pagination={false}
                rowKey='id'
              />
            </Col>
          </Row>
          <Row gutter={16} className={'section-space-field'}>
            <Col xs={24} sm={24} md={24} lg={24}>
              <div className={'title-space-field'}>Observaciones</div>
              <TextArea rows={4} />
            </Col>
          </Row>
          <Row gutter={16} className={'section-space-field'}>
            <Col xs={12} sm={12} md={12} lg={12}>
              <h3>Entrega</h3>
              <Input placeholder={'Entrega'} size={'large'} />
            </Col>
            <Col xs={12} sm={12} md={12} lg={12}>
              <h3>Recibe</h3>
              <Input placeholder={'Recibe'} size={'large'} />
            </Col>
          </Row>
        </div>
        <FooterButtons
          saveData={props.saveData}
          cancelButton={props.cancelButton}
          edit={false}
          cancelLink='/sales'
        />
      </Card>
    </>
  )
}

export default NewNoteView
