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

function ReportManulaCashReceiptsTable(props) {
    
    const columns = [
        {
          width:120,
          title: '# Recibo',
          dataIndex: 'id', // Field that is goint to be rendered
          key: 'id',
          render: text => <span>{text}</span>,
        },           
        {
          width: 115,
          title: 'Fecha',
          dataIndex: 'created_at', // Field that is goint to be rendered
          key: 'created_at ',
          render: text => (
            <span>{text ? moment(text).format('DD-MM-YYYY') : ''}</span>
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
            title: 'Monto Pagado',
            dataIndex: 'due', // Field that is goint to be rendered
            key: 'due',
            render: text => <span>{ `Q ${getFormattedValue(text.toFixed(2))}` }</span>,      
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
        {
          width: 120,
          title: 'Estado',
          dataIndex: 'status', // Field that is goint to be rendered
          key: 'status',
          render: text => <Tag type='creditStatus' value={text} />,
        }      
      ]
       
  return (
    <>
       <Row gutter={16}>      
        <Col xs={6} sm={6} md={6} lg={6}>
          <Search
            prefix={<SearchOutlined className={'cabisa-table-search-icon'} />}
            placeholder='# Recibo'
            className={'cabisa-table-search customSearch'}
            size={'large'}
            onSearch={props.handleFiltersChange('id')}
          />
        </Col>      
        <Col xs={6} sm={6} md={6} lg={6}>
          <Search            
            prefix={<SearchOutlined className={'cabisa-table-search-icon'} />}
            placeholder='Nombre Cliente'
            className={'cabisa-table-search customSearch'}
            size={'large'}
            onSearch={props.handleFiltersChange('name')}
          />
        </Col>
        <Col xs={6} sm={6} md={6} lg={6}>
            <RangePicker
              style={{ width: '100%', height: '40px', borderRadius: '6px' }}
              format='DD-MM-YYYY'                          
              onChange={props.handleFiltersChange('created_at')}
            />
        </Col>                
        <Col xs={6} sm={6} md={6} lg={6}>
          <Select
            className={'single-select'}
            placeholder={'Estado'}
            size={'large'}
            style={{ width: '100%', height: '40px' }}
            getPopupContainer={trigger => trigger.parentNode}
            onChange={props.handleFiltersChange('status')}
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
                value={`Q ${getFormattedValue(props.dataSource.reduce( ( sum, item  ) =>  sum + item.total_amount,0))}`}
              />
              
            </div>            
          </Col>  
          <Col span={6} style={{ textAlign: 'left' }}>
            <div className={'title-space-field'}>
              <Statistic
                title='Total Pagado:'
                value={`Q ${getFormattedValue(props.dataSource.reduce( ( sum, item  ) =>  sum + item.due,0))}`}
              />              
            </div>            
          </Col>
          <Col span={6} style={{ textAlign: 'left' }}>
            <div className={'title-space-field'}>
              <Statistic
                title='Cantidad de Recibos:'
                value ={props.dataSource.length}
              />              
            </div>            
          </Col>                    
        </Row>     
    </>
  )
}

export default ReportManulaCashReceiptsTable
