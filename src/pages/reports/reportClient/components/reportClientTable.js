import React from 'react'
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Popconfirm,
  Popover,
  Row,
  Select,
  Table,
  Tag,
} from 'antd'

import MoreOutlined from '@ant-design/icons/lib/icons/MoreOutlined'
import DownOutlined from '@ant-design/icons/lib/icons/DownOutlined'
import RightOutlined from '@ant-design/icons/lib/icons/RightOutlined'
const { Option } = Select
const columns = [
  {
    title: 'Codigo cliente',
    dataIndex: 'code', // Field that is goint to be rendered
    key: 'code',
    render: text => <span>{text}</span>,
  },
  {
    title: 'Nombre o Razón social',
    dataIndex: 'name', // Field that is goint to be rendered
    key: 'name',
    render: text => <span>{text}</span>,
  },
  {
    title: 'Tipo',
    dataIndex: 'Type', // Field that is goint to be rendered
    key: 'Type',
    render: text => <span>{text}</span>,
  },
  {
    title: 'Referencia',
    dataIndex: 'reference', // Field that is goint to be rendered
    key: 'reference',
    render: text => <span>{text}</span>,
  },
  {
    title: 'Cargos',
    dataIndex: 'charges', // Field that is goint to be rendered
    key: 'charges',
    render: text => <span>{text}</span>,
  },
  {
    title: 'Pagos',
    dataIndex: 'payments', // Field that is goint to be rendered
    key: 'payments',
    render: text => <span>{text}</span>,
  },
  {
    title: 'Balance',
    dataIndex: 'balance', // Field that is goint to be rendered
    key: 'balance',
    render: text => <span>{text}</span>,
  },
  {
    title: 'Estado',
    dataIndex: 'status', // Field that is goint to be rendered
    key: 'status',
    render: text => (
      <span>
        {text === 'Activo' ? (
          <Tag color='#87d068'>ACTIVO</Tag>
        ) : text === 'InActivo' ? (
          <Tag color='#f50'>INACTIVO</Tag>
        ) : (
          ''
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
                <span className={'user-options-items'}>Editar</span>
                <Divider
                  className={'divider-enterprise-margins'}
                  type={'horizontal'}
                />
                <Popconfirm
                  title='Estas seguro de borrar el elemento selccionado?'
                  okText='Si'
                  cancelText='No'
                >
                  <span className={'user-options-items'}>Eliminar</span>
                </Popconfirm>
              </div>
            }
            trigger='click'
          >
            <Button shape={'circle'} className={'enterprise-settings-button'}>
              <MoreOutlined />
            </Button>
          </Popover>
        }
      </span>
    ),
  },
]

function ReportClientTable(props) {
  return (
    <>
      {/*FIELDS*/}
      <Row gutter={16}>
        <Col xs={6} sm={6} md={6} lg={6}>
          <Select
            showSearch
            className={'single-select'}
            placeholder={'Buscar Cliente'}
            size={'large'}
            style={{ width: '100%', height: '40px' }}
            getPopupContainer={trigger => trigger.parentNode}
          />
        </Col>
        <Col xs={6} sm={6} md={6} lg={6}>
          <DatePicker
            style={{ width: '100%', height: '40px', borderRadius: '8px' }}
          />
        </Col>
        <Col xs={6} sm={6} md={6} lg={6}>
          <Select
            showSearch
            className={'single-select'}
            placeholder={'Elegir Tipo'}
            size={'large'}
            style={{ width: '100%', height: '40px' }}
            getPopupContainer={trigger => trigger.parentNode}
          >
            <Option value={0}>Persona Individual</Option>
            <Option value={1}>Empresa</Option>
          </Select>
        </Col>
        <Col xs={6} sm={6} md={6} lg={6}>
          <Select
            showSearch
            className={'single-select'}
            placeholder={'Elegir estatus'}
            size={'large'}
            style={{ width: '100%', height: '40px' }}
            getPopupContainer={trigger => trigger.parentNode}
          >
            <Option value={'active'}>
              <Tag color='#87d068'>ACTIVO</Tag>
            </Option>
            <Option value={'inactive'}>
              <Tag color='#f50'>INACTIVO</Tag>
            </Option>
          </Select>
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
                  expandable={{
                    expandedRowRender: record => (
                      <div className={'text-left'}>
                        <p>
                          <b>Detalle Cliente: </b>{' '}
                        </p>
                      </div>
                    ),
                    expandIcon: ({ expanded, onExpand, record }) =>
                      expanded ? (
                        <DownOutlined onClick={e => onExpand(record, e)} />
                      ) : (
                        <RightOutlined onClick={e => onExpand(record, e)} />
                      ),
                  }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default ReportClientTable
