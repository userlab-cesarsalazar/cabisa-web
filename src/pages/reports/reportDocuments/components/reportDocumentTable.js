import React from 'react'
import {
  Card,
  Col,
  DatePicker,  
  Input,
  Row,
  Select,
  Table,  
  Statistic,
  Tag as AntTag,
} from 'antd'
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import Tag from '../../../../components/Tag'
import moment from 'moment'
import {numberFormat} from '../../../../utils'

const { Search } = Input
const { Option } = Select
const { RangePicker } = DatePicker
const { getFormattedValue } = numberFormat()

function ReportDocumentTable(props) {
    
  const columns = [      
    {
      width:120,
      title: '# Nota serv.',
      dataIndex: 'related_internal_document_id', // Field that is goint to be rendered
      key: 'related_internal_document_id',
      render: text => <span>{text}</span>,
    },
    {
      width:125,
      title: '# Documento',
      dataIndex: 'document_number', // Field that is goint to be rendered
      key: 'document_number',
      render: text => <span>{text}</span>,
    },    
    {
      width:300,
      title: 'Cliente',
      dataIndex: 'client', // Field that is goint to be rendered
      key: 'client ',
      render: (_, record) => (
        <>
          <span>{record.stakeholder_name}</span>
          <br />
          <span>Nit: {record.stakeholder_nit}</span>
        </>
      ),
    },
    {
      width:120,
      title: 'Fecha de facturacion',
      dataIndex: 'created_at', // Field that is goint to be rendered
      key: 'created_at ',
      render: text => (
        <span>{text ? moment(text).format('DD-MM-YYYY') : ''}</span>
      ),
    },
    {
      width:120,
      title: 'Total',
      dataIndex: 'total', // Field that is goint to be rendered
      key: 'total ',
      render: text => <span>{ `Q ${getFormattedValue(text.toFixed(2))}` }</span>,      
    },
    {
      width:120,
      title: 'Metodo de pago',
      dataIndex: 'payment_method', // Field that is goint to be rendered
      key: 'payment_method',
      render: text => <Tag type='documentsPaymentMethods' value={text} />,
    },
    {
      title: 'Status',
      dataIndex: 'status', // Field that is goint to be rendered
      key: 'status',
      width: 100,
      render: text => <Tag type='documentStatus' value={text} />,
    }
  ]
  
  return (
    <>
      <Row gutter={16}>
      <Col xs={4} sm={4} md={4} lg={4}>
          <Search
            prefix={<SearchOutlined className={'cabisa-table-search-icon'} />}
            placeholder='# Nota serv.'
            className={'cabisa-table-search customSearch'}
            size={'large'}
            onSearch={props.handleFiltersChange('related_internal_document_id')}
          />
        </Col>
        <Col xs={4} sm={4} md={4} lg={4}>
          <Search
            prefix={<SearchOutlined className={'cabisa-table-search-icon'} />}
            placeholder='# Documento'
            className={'cabisa-table-search customSearch'}
            size={'large'}
            onSearch={props.handleFiltersChange('document_number')}
          />
        </Col>
        <Col xs={4} sm={4} md={4} lg={4}>          
          <Search            
            prefix={<SearchOutlined className={'cabisa-table-search-icon'} />}
            placeholder='Nombre Cliente'
            className={'cabisa-table-search customSearch'}
            size={'large'}
            onSearch={props.handleFiltersChange('name')}
          />
        </Col>
        <Col xs={4} sm={4} md={4} lg={4}>                    
          <RangePicker
              style={{ width: '100%', height: '40px', borderRadius: '6px' }}
              format='DD-MM-YYYY'                          
              onChange={props.handleFiltersChange('created_at')}
            />
        </Col>
        <Col xs={4} sm={4} md={4} lg={4}>
          <Select
            className={'single-select'}
            placeholder={'Metodo de pago'}
            size={'large'}
            style={{ width: '100%', height: '40px' }}
            getPopupContainer={trigger => trigger.parentNode}
            onChange={props.handleFiltersChange('paymentMethods')}
            defaultValue=''
          >
            <Option value={''}>
              <AntTag color='gray'>Todo</AntTag>
            </Option>
            {props.paymentMethodsOptionsList?.map(value => (
              <Option key={value} value={value}>
                <Tag type='documentsPaymentMethods' value={value} />
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={4} sm={4} md={4} lg={4}>
          <Search
            type='tel'
            prefix={<SearchOutlined className={'cabisa-table-search-icon'} />}
            placeholder='Total'
            className={'cabisa-table-search customSearch'}
            onSearch={props.handleFiltersChange('totalInvoice')}
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
                  scroll={{ y: 820 }}
                  className={'CustomTableClass'}
                  dataSource={props.dataSource}
                  columns={columns}
                  pagination={{ pageSize: 5 }}
                  loading={props.loading}
                  rowKey='id'
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <div style={{margin:"25px"}}/>
      <Row gutter={16} style={{ textAlign: 'left' }} justify='start'>
          <Col span={6} style={{ textAlign: 'left' }}>
            <div className={'title-space-field'}>
              <Statistic
                title='Total:'
                value={`Q ${getFormattedValue(props.dataSource.reduce( ( sum, item  ) =>  sum + item.total,0))}`}
              />
              
            </div>            
          </Col>  
          <Col span={6} style={{ textAlign: 'left' }}>
            <div className={'title-space-field'}>
              <Statistic
                title='Cantidad de facturas:'                
                value ={props.dataSource.length}
              />              
            </div>            
          </Col>
          <Col span={6} style={{ textAlign: 'left' }}>
            <div className={'title-space-field'}>
              <Statistic
                title='Facturas Aprobadas:'                
                value ={props.dataSource.filter(item => item.status === "APPROVED").length}
              />              
            </div>            
          </Col>   
          <Col span={6} style={{ textAlign: 'left' }}>
            <div className={'title-space-field'}>
              <Statistic
                title='Facturas Anuladas:'                
                value ={props.dataSource.filter(item => item.status === "CANCELLED").length}
              />              
            </div>            
          </Col>          
        </Row>
    </>
  )
}

export default ReportDocumentTable
