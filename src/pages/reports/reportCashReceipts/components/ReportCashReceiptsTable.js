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
  Collapse,
  Tag as AntTag,
} from 'antd'
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import Tag from '../../../../components/Tag'
import moment from 'moment'
import {numberFormat} from '../../../../utils'

const { Panel } = Collapse;
const { Search } = Input
const { Option } = Select
const { RangePicker } = DatePicker
const { getFormattedValue } = numberFormat()

function ReportCashReceiptsTable(props) {
    
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
          render: text => text ? <span>{text}</span> : <span>{'Factura del sistema'}</span>,
        },
        {
          width: 115,
          title: 'Fecha',
          dataIndex: 'created_at', // Field that is goint to be rendered
          key: 'created_at ',
          render: text => (
            <span>{text ? moment.utc(text).format('DD-MM-YYYY') : ''}</span>
          ),
        },
        {
          width: 115,
          title: 'Dias de credito',
          dataIndex: 'created_at', // Field that is goint to be rendered
          key: 'created_at ',                
          render: text => (
            <span>{text ? moment.utc().diff(moment(text),'days') : ''}</span>
          ),
        },
        {
          width: 300,
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
            width: 120,
            title: 'Monto pendiente',            
            render: (text,val) => <span>{ `Q ${getFormattedValue(val.total_amount.toFixed(2) - val.due.toFixed(2))}` }</span>,      
        },
        {
          width: 120,
          title: 'Monto Total',
          dataIndex: 'total_amount', // Field that is goint to be rendered
          key: 'total_amount',
          render: text => <span>{ `Q ${getFormattedValue(text.toFixed(2))}` }</span>,      
        },        
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
          <Select
            className={'single-select'}
            placeholder={'Estado de Credito'}
            size={'large'}
            style={{ width: '100%', height: '40px' }}
            getPopupContainer={trigger => trigger.parentNode}
            onChange={props.handleFiltersChange('creditStatus')}
            defaultValue=''
          >
            <Option value={''}>
              <AntTag color='gray'>Todo</AntTag>
            </Option>
            {props.creditStatusOptionsList?.map(value => (
              <Option key={value} value={value}>
                <Tag type='creditStatus' value={value} />
              </Option>
            ))}
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
                  scroll={{ y: 820 }}
                  className={'CustomTableClass'}
                  dataSource={props.dataSource}
                  columns={columns}
                  pagination={{ pageSize: 4 }}
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
                title='Total Facturado:'
                value={`Q ${getFormattedValue(props.dataSource.reduce( ( sum, item  ) =>  sum + item.total_amount,0))}`}
              />
              
            </div>            
          </Col>  
          <Col span={6} style={{ textAlign: 'left' }}>
            <div className={'title-space-field'}>
              <Statistic
                title='Total pagado:'
                value={`Q ${getFormattedValue(props.dataSource.reduce( ( sum, item  ) =>  sum + item.due,0))}`}
              />              
            </div>            
          </Col>
          <Col span={6} style={{ textAlign: 'left' }}>
            <div className={'title-space-field'}>
              <Statistic
                title='Balance:'
                value={`Q ${getFormattedValue(
                  (props.dataSource.reduce( ( sum, item  ) =>  sum + item.total_amount,0)) - 
                  (props.dataSource.reduce( ( sum, item  ) =>  sum + item.due,0))                  
                  )}`}
              />              
            </div>            
          </Col>
          <Col span={6} style={{ textAlign: 'left' }}>
            <div className={'title-space-field'}>
              <Statistic
                title='Cantidad de Facturas:'
                value ={props.dataSource.length}
              />              
            </div>            
          </Col>                    
        </Row>

      {/*DETAILS*/}
      <div style={{margin:"25px"}}/>
      <Collapse>
      <Panel header="Detalle Facturacion eletronica" key="1">
      <div style={{margin:"25px"}}/>
      <Row gutter={16} style={{ textAlign: 'left' }} justify='start'>                                    
          <Col span={6} style={{ textAlign: 'left' }}>
            <div className={'title-space-field'}>
              <Statistic
                title='Total Facturado:'
                value={`Q ${getFormattedValue(props.dataSource.filter(item=>item.document_number !== null).reduce( ( sum, item  ) =>  sum + item.total_amount,0))}`}
              />
              
            </div>            
          </Col>  
          <Col span={6} style={{ textAlign: 'left' }}>
            <div className={'title-space-field'}>
              <Statistic
                title='Total pagado:'
                value={`Q ${getFormattedValue(props.dataSource.filter(item=>item.document_number !== null).reduce( ( sum, item  ) =>  sum + item.due,0))}`}
              />              
            </div>            
          </Col>
          <Col span={6} style={{ textAlign: 'left' }}>
            <div className={'title-space-field'}>
              <Statistic
                title='Balance:'
                value={`Q ${getFormattedValue(
                  (props.dataSource.filter(item=>item.document_number !== null).reduce( ( sum, item  ) =>  sum + item.total_amount,0)) - 
                  (props.dataSource.filter(item=>item.document_number !== null).reduce( ( sum, item  ) =>  sum + item.due,0))
                  )}`}
              />              
            </div>            
          </Col>
          <Col span={6} style={{ textAlign: 'left' }}>
            <div className={'title-space-field'}>
              <Statistic
                title='Cantidad Facturas:'
                value ={props.dataSource.filter(item=>item.document_number !== null).length}
              />              
            </div>            
          </Col>                    
        </Row>
      </Panel>

      <Panel header="Detalle Facturacion del sistema" key="2">
      <div style={{margin:"25px"}}/>
      <Row gutter={16} style={{ textAlign: 'left' }} justify='start'>                              
      
      
          <Col span={6} style={{ textAlign: 'left' }}>
            <div className={'title-space-field'}>
              <Statistic
                title='Total Facturado:'
                value={`Q ${getFormattedValue(props.dataSource.filter(item=>item.document_number === null).reduce( ( sum, item  ) =>  sum + item.total_amount,0))}`}
              />
              
            </div>            
          </Col>  
          <Col span={6} style={{ textAlign: 'left' }}>
            <div className={'title-space-field'}>
              <Statistic
                title='Total pagado:'
                value={`Q ${getFormattedValue(props.dataSource.filter(item=>item.document_number === null).reduce( ( sum, item  ) =>  sum + item.due,0))}`}
              />              
            </div>            
          </Col>
          <Col span={6} style={{ textAlign: 'left' }}>
            <div className={'title-space-field'}>
              <Statistic
                title='Balance:'
                value={`Q ${getFormattedValue(
                  (props.dataSource.filter(item=>item.document_number === null).reduce( ( sum, item  ) =>  sum + item.total_amount,0)) - 
                  (props.dataSource.filter(item=>item.document_number === null).reduce( ( sum, item  ) =>  sum + item.due,0))
                  )}`}
              />              
            </div>            
          </Col>
          <Col span={6} style={{ textAlign: 'left' }}>
            <div className={'title-space-field'}>
              <Statistic
                title='Cantidad Facturas:'
                value ={props.dataSource.filter(item=>item.document_number === null).length}
              />              
            </div>            
          </Col>                    
        </Row>
      </Panel>
      
      </Collapse>
     


       
       
    </>
  )
}

export default ReportCashReceiptsTable
