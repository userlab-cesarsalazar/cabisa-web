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

function ReportSalesProductTable(props) {
    
  const columns = [      
    {
      title: 'Codigo de producto',
      dataIndex: 'code',
      key: 'code',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Nombre / Descripcion',
      dataIndex: 'description',
      key: 'description',
      render: text => <span>{text}</span>,
    },    
    {      
      title: 'Cantidad de productos vendidos',
      dataIndex: 'product_quantity',
      key: 'product_quantity ',
      render: text => <span>{text}</span>,
    },    
    {     
      title: 'Total vendido',
      dataIndex: 'total_amount',
      key: 'total_amount ',
      render: text => <span>{ `Q ${getFormattedValue(text.toFixed(2))}` }</span>,      
    }
  ]
  
  return (
    <>
      <Row gutter={16}>      
      <Col xs={8} sm={8} md={8} lg={8}>          
          <Search            
            prefix={<SearchOutlined className={'cabisa-table-search-icon'} />}
            placeholder='Codigo producto'
            className={'cabisa-table-search customSearch'}
            size={'large'}
            onSearch={props.handleFiltersChange('code')}
          />
        </Col>
        <Col xs={8} sm={8} md={8} lg={8}>          
          <Search            
            prefix={<SearchOutlined className={'cabisa-table-search-icon'} />}
            placeholder='Nombre / Descripcion'
            className={'cabisa-table-search customSearch'}
            size={'large'}
            onSearch={props.handleFiltersChange('description')}
          />
        </Col>
        <Col xs={8} sm={8} md={8} lg={8}>                    
          <RangePicker
              style={{ width: '100%', height: '40px', borderRadius: '6px' }}
              format='DD-MM-YYYY'                          
              onChange={props.handleFiltersChange('created_at')}
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
    </>
  )
}

export default ReportSalesProductTable
