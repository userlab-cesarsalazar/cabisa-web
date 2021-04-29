import React from 'react'
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Input,
  Popconfirm,
  Popover,
  Row,
  Select,
  Table,
  Tag,
} from 'antd'
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import MoreOutlined from '@ant-design/icons/lib/icons/MoreOutlined'
import { Cache } from 'aws-amplify'
import { validatePermissions, permissionsButton } from '../../../utils/Utils'

const { Search } = Input
const { Option } = Select

function BillingTable(props) {
  const handlerEditRow = data => {
    props.showDetail(data)
  }

  const columns = [
    {
      title: 'Serie',

      dataIndex: 'serie', // Field that is goint to be rendered
      key: 'serie',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Tipo de servicio',
      dataIndex: 'service_type', // Field that is goint to be rendered
      key: 'service_type',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Cliente',
      dataIndex: 'client', // Field that is goint to be rendered
      key: 'client ',
      render: text => (
        <>
          <span>{text.name}</span>
          <br />
          <span>Nit: {text.nit}</span>
        </>
      ),
    },
    {
      title: 'Fecha de facturacion',
      dataIndex: 'date_created', // Field that is goint to be rendered
      key: 'date_created ',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Total',
      dataIndex: 'total_bill', // Field that is goint to be rendered
      key: 'total_bill ',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Metodo de pago',
      dataIndex: 'payment_method', // Field that is goint to be rendered
      key: 'payment_method',
      render: text => (
        <span>
          {text === 'Transferencia' ? (
            <Tag color='cyan'>{text}</Tag>
          ) : text === 'Efectivo' ? (
            <Tag color='green'>{text}</Tag>
          ) : (
            <Tag color='geekblue'>{text}</Tag>
          )}
        </span>
      ),
    },
    {
      title: '',
      dataIndex: 'id', // Field that is goint to be rendered
      key: 'id',
      render: (row, data) => (
        <span>
          {
            <Popover
              placement='left'
              style={{ zIndex: 'auto' }}
              content={
                <div>
                  {validatePermissions(
                    Cache.getItem('currentSession').userPermissions,
                    4
                  ).permissionsSection[0].edit && (
                    <span
                      className={'user-options-items'}
                      onClick={() => handlerEditRow(data)}
                    >
                      Ver Detalle
                    </span>
                  )}

                  {validatePermissions(
                    Cache.getItem('currentSession').userPermissions,
                    4
                  ).permissionsSection[0].edit &&
                    validatePermissions(
                      Cache.getItem('currentSession').userPermissions,
                      4
                    ).permissionsSection[0].delete && (
                      <Divider
                        className={'divider-enterprise-margins'}
                        type={'horizontal'}
                      />
                    )}
                  {validatePermissions(
                    Cache.getItem('currentSession').userPermissions,
                    4
                  ).permissionsSection[0].delete && (
                    <Popconfirm
                      title='Estas seguro de anular el elemento selccionado?'
                      okText='Si'
                      cancelText='No'
                    >
                      <span className={'user-options-items'}>
                        Anular factura
                      </span>
                    </Popconfirm>
                  )}
                </div>
              }
              trigger='click'
            >
              {permissionsButton(4, Cache.getItem('currentSession')) && (
                <Button
                  shape={'circle'}
                  className={'enterprise-settings-button'}
                >
                  <MoreOutlined />
                </Button>
              )}
            </Popover>
          }
        </span>
      ),
    },
  ]

  return (
    <>
      {/*FIELDS*/}
      <Row gutter={16}>
        <Col xs={4} sm={4} md={4} lg={4}>
          <Search
            prefix={<SearchOutlined className={'cabisa-table-search-icon'} />}
            placeholder='No. serie'
            className={'cabisa-table-search customSearch'}
            size={'large'}
          />
        </Col>
        <Col xs={4} sm={4} md={4} lg={4}>
          <Select
            showSearch
            className={'single-select'}
            placeholder={'Nombre o Nit'}
            size={'large'}
            style={{ width: '100%', height: '40px' }}
            getPopupContainer={trigger => trigger.parentNode}
          />
        </Col>
        <Col xs={4} sm={4} md={4} lg={4}>
          <DatePicker
            style={{ width: '100%', height: '40px', borderRadius: '8px' }}
          />
        </Col>
        <Col xs={4} sm={4} md={4} lg={4}>
          <Select
            className={'single-select'}
            placeholder={'Elegir tipo servicio'}
            size={'large'}
            style={{ width: '100%', height: '40px' }}
            getPopupContainer={trigger => trigger.parentNode}
          >
            <Option value={'MACHINE'}>Maquinaria</Option>
            <Option value={'EQUIPMENT'}>Equipo</Option>
            <Option value={'SERVICE'}>Servicio</Option>
          </Select>
        </Col>
        <Col xs={4} sm={4} md={4} lg={4}>
          <Select
            className={'single-select'}
            placeholder={'Metodo de pago'}
            size={'large'}
            style={{ width: '100%', height: '40px' }}
            getPopupContainer={trigger => trigger.parentNode}
          >
            <Option value={0}>
              <Tag color='geekblue'>Tarjeta debito/credito</Tag>
            </Option>
            <Option value={1}>
              <Tag color='cyan'>Transferencia</Tag>
            </Option>
            <Option value={2}>
              <Tag color='green'>Efectivo</Tag>
            </Option>
          </Select>
        </Col>
        <Col xs={4} sm={4} md={4} lg={4}>
          <Search
            type={'number'}
            prefix={<SearchOutlined className={'cabisa-table-search-icon'} />}
            placeholder='Monto'
            className={'cabisa-table-search customSearch'}
            size={'large'}
          />
        </Col>
      </Row>
      {/*TABLE*/}
      <Row>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Card className={'card-border-radius margin-top-15'}>
            <Row>
              <Col xs={24} sm={24} md={24} lg={24}>
                <Table
                  scroll={{ y: 320 }}
                  className={'CustomTableClass'}
                  dataSource={props.dataSource}
                  columns={columns}
                  pagination={false}
                  loading={props.loading}
                  rowKey='id'
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default BillingTable
