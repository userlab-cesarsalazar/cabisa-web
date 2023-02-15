import React,{useState} from 'react'
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
  Input,
} from 'antd'
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import CloseSquareOutlined from '@ant-design/icons/lib/icons/CloseSquareOutlined'
import DownOutlined from '@ant-design/icons/lib/icons/DownOutlined'
import RightOutlined from '@ant-design/icons/lib/icons/RightOutlined'
import Tag from '../../../../components/Tag'
import { numberFormat, formatPhone ,sortColumnString} from '../../../../utils'

const { Search } = Input
const { Option } = Select

function ReportClientTable(props) {
  
  const [sortedInfo,setSortedInfo] = useState(null)
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
      sorter: (a, b) => sortColumnString(a, b, 'name'),
      sortOrder: sortedInfo && sortedInfo.columnKey === 'name' && sortedInfo.order,   
      ellipsis: true,   
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
      title: 'Cargos',
      dataIndex: 'total_credit', // Field that is goint to be rendered
      key: 'total_credit',
      render: text => <span>{ `Q ${getFormattedValue(text ? text.toFixed(2) : (0).toFixed(2))}` }</span>,
    },
    {
      title: 'Pagado',
      dataIndex: 'paid_credit', // Field that is goint to be rendered
      key: 'paid_credit',
      render: text => <span>{ `Q ${getFormattedValue(text ? text.toFixed(2) : (0).toFixed(2))}` }</span>,
    },
    {
      title: 'Balance',      
      render: (_,record) => 
      <span>{ `Q ${getFormattedValue(record.credit_balance)}`}</span>,
    }    
  ]

  const handleChange = (pagination, filters, sorter) =>{    
    setSortedInfo(sorter)
  }

  return (
    <>
      <Row gutter={16}>
        <Col xs={5} sm={5} md={5} lg={5}>
          <DatePicker
            style={{ width: '100%', height: '40px', borderRadius: '8px' }}
            placeholder='Fecha de creacion'
            format='DD-MM-YYYY'
            onChange={props.handleFiltersChange('created_at')}
          />
        </Col>
        <Col xs={5} sm={5} md={5} lg={5}>
          <Search
            size={'large'}
            type='tel'
            prefix={<SearchOutlined className={'cabisa-table-search-icon'} />}
            placeholder={'Buscar por nombre'}
            className={'cabisa-table-search customSearch'}
            onSearch={props.handleFiltersChange('name')}
          />
        </Col>
        <Col xs={5} sm={5} md={5} lg={5}>
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
        <Col xs={4} sm={4} md={4} lg={4}>
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
        <Col xs={5} sm={5} md={5} lg={5}>
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
                  onChange={handleChange}
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
                  value={`Q ${getFormattedValue(props.totals.totalCredit)}`}
                />
              </div>
            </Col>
            <Col span={6} style={{ textAlign: 'right' }}>
              <div className={'title-space-field'}>
                <Statistic
                  title='Total Pagado :'
                  value={`Q ${getFormattedValue(props.totals.totalPaidCredit)}`}
                />
              </div>
            </Col>
            <Col span={6} style={{ textAlign: 'right' }}>
              <div className={'title-space-field'}>
                <Statistic
                  title='Total Balance :'
                  value={`Q ${getFormattedValue ((props.totals.totalCreditBalance ? props.totals.totalCreditBalance : 0))}`}
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
