import React from 'react'
import moment from 'moment'
import {
  Card,
  Col,
  DatePicker,
  Row,
  Select,
  Table,
  Tag as AntTag,
  Button,
  Switch,
  Divider,
  Statistic,
} from 'antd'
import CloseSquareOutlined from '@ant-design/icons/lib/icons/CloseSquareOutlined'
import DownOutlined from '@ant-design/icons/lib/icons/DownOutlined'
import RightOutlined from '@ant-design/icons/lib/icons/RightOutlined'
import Tag from '../../../../components/Tag'
import { numberFormat, formatPhone } from '../../../../utils'

const { Option } = Select

function ReportClientTable(props) {
  const { getFormattedValue } = numberFormat()

  const columns = [
    {
      title: 'Codigo cliente',
      dataIndex: 'id', // Field that is goint to be rendered
      key: 'id',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Nombre o Razón social',
      dataIndex: 'name', // Field that is goint to be rendered
      key: 'name',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Fecha',
      dataIndex: 'created_at', // Field that is goint to be rendered
      key: 'created_at',
      render: text => <span>{moment(text).format('DD-MM-YYYY')}</span>,
    },
    {
      title: 'Tipo',
      dataIndex: 'stakeholder_type', // Field that is goint to be rendered
      key: 'stakeholder_type',
      render: text => <Tag type='stakeholderTypes' value={text} />,
    },
    {
      title: 'Limite de credito',
      dataIndex: 'credit_limit', // Field that is goint to be rendered
      key: 'credit_limit',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Cargos',
      dataIndex: 'total_credit', // Field that is goint to be rendered
      key: 'total_credit',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Pagos',
      dataIndex: 'paid_credit', // Field that is goint to be rendered
      key: 'paid_credit',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Balance',
      dataIndex: 'credit_balance', // Field that is goint to be rendered
      key: 'credit_balance',
      render: text => <span>{text}</span>,
    },
  ]

  return (
    <>
      <Row gutter={16}>
        <Col xs={6} sm={6} md={6} lg={6}>
          <DatePicker
            style={{ width: '100%', height: '40px', borderRadius: '8px' }}
            placeholder='Fecha de creacion'
            format='DD-MM-YYYY'
            onChange={props.handleFiltersChange('created_at')}
          />
        </Col>
        <Col xs={6} sm={6} md={6} lg={6}>
          <Select
            className={'single-select'}
            placeholder={'Tipo de cliente'}
            size={'large'}
            style={{ width: '100%', height: '40px' }}
            getPopupContainer={trigger => trigger.parentNode}
            onChange={props.handleFiltersChange('stakeholder_type')}
            defaultValue=''
          >
            <Option value={''}>
              <AntTag color='gray'>Todo</AntTag>
            </Option>
            {props.stakeholderTypesOptionsList?.map(value => (
              <Option key={value} value={value}>
                <Tag type='stakeholderTypes' value={value} />
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={6} sm={6} md={6} lg={6}>
          <Button
            style={{ height: '100%' }}
            onClick={props.handleFiltersChange('clearFilters')}
            color='danger'
            icon={<CloseSquareOutlined />}
            danger
          >
            Eliminar filtros
          </Button>
        </Col>
        <Col xs={6} sm={6} md={6} lg={6}>
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <b style={{ paddingRight: '1em' }}>Sumatoria Total</b>
            <Switch defaultChecked onChange={props.handleSwitchChange} />
          </div>
        </Col>
      </Row>

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
                          <b>Encargado </b>{' '}
                          {record.address !== null ? record.address : ''}{' '}
                        </p>
                        <p>
                          <b>Direccion: </b>{' '}
                          {record.email !== null ? record.email : ''}{' '}
                        </p>
                        <p>
                          <b>Telefono: </b>{' '}
                          {record.phone ? formatPhone(record.phone) : ''}{' '}
                        </p>
                        <p>
                          <b>Encargado compras: </b>{' '}
                          {record.business_man ? record.business_man : ''}{' '}
                        </p>
                        <p>
                          <b>Encargado pagos: </b>{' '}
                          {record.payments_man ? record.payments_man : ''}{' '}
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

      {props.isSwitchChecked ? (
        <>
          <Divider className={'divider-custom-margins-users'} />

          <Row gutter={16} style={{ textAlign: 'right' }} justify='end'>
            <Col span={6} style={{ textAlign: 'right' }}>
              <div className={'title-space-field'}>
                <Statistic
                  title='Total Cargos :'
                  value={getFormattedValue(props.totals.totalCredit)}
                />
              </div>
            </Col>
            <Col span={6} style={{ textAlign: 'right' }}>
              <div className={'title-space-field'}>
                <Statistic
                  title='Total Pagos :'
                  value={getFormattedValue(props.totals.totalPaidCredit)}
                />
              </div>
            </Col>
            <Col span={6} style={{ textAlign: 'right' }}>
              <div className={'title-space-field'}>
                <Statistic
                  title='Balance de Creditos :'
                  value={getFormattedValue(props.totals.totalCreditBalance)}
                />
              </div>
            </Col>
          </Row>
        </>
      ) : null}
    </>
  )
}

export default ReportClientTable
