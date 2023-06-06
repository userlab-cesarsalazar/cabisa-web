import React from 'react'
import {
  Card,
  Col,
  DatePicker,  
  Input,
  Row,
  Table,
  Tooltip,
  Button    
} from 'antd'

import Tag from '../../../components/Tag'
import { 
  SearchOutlined
} from '@ant-design/icons'
import moment from 'moment'

const { Search } = Input
const { RangePicker } = DatePicker

function BillingManagementTable(props) {
    
  const columns = [      
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width:50,
      render: text => <span>{text}</span>,
    },
    {
      title: 'Nombre',
      dataIndex: 'stakeholder_name',
      key: 'stakeholder_name',
      render: text => <span>{text}</span>,
    },   
    {
      title: 'Nit',
      dataIndex: 'stakeholder_nit',
      key: 'stakeholder_nit',
      render: text => <span>{text}</span>,
    },             
    {      
      title: '# Documento',
      dataIndex: 'document_number',
      key: 'document_number ',
      render: text => <span>{text}</span>,
    }, 
    {      
      title: 'Tipo',
      dataIndex: 'document_type',
      key: 'document_type ',
      render: text => <Tag type='creditDebitNote' value={text} /> ,
    }, 
    {      
      title: 'Motivo del ajuste',
      dataIndex: 'adjustment_reason',
      key: 'adjustment_reason ',
      render: text => <span>{text}</span>,
    },    
    {      
      title: 'Fecha de Creacion',
      dataIndex: 'created_at',
      key: 'created_at ',
      render: text => (
        <span>{text ? moment.utc(text).format('DD-MM-YYYY') : ''}</span>
      ),
    },      
    {      
      title: 'Referencia # Documento',
      dataIndex: 'related_bill_document_number',
      key: 'related_bill_document_number ',
      render: text => <span>{text}</span>,
    },     
    {      
      width: 100,
      render: (_, data) => (
        <>  
        <Tooltip title={'Ver documento'}>
              <Button
                icon={<SearchOutlined />}
                onClick={() => props.handlerPrintDocument(data)}
              />
        </Tooltip>  
        </>
      ),
    }  
    
  ]
  
  return (
    <>
      <Row gutter={16}>      
      <Col xs={6} sm={6} md={6} lg={6}>
          <Search            
            prefix={<SearchOutlined className={'cabisa-table-search-icon'} />}
            placeholder='Nombre'
            className={'cabisa-table-search customSearch'}
            size={'large'}
            onSearch={props.handleFiltersChange('name')}
          />
        </Col>
        <Col xs={6} sm={6} md={6} lg={6}>
          <Search            
            prefix={<SearchOutlined className={'cabisa-table-search-icon'} />}
            placeholder='Nit'
            className={'cabisa-table-search customSearch'}
            size={'large'}
            onSearch={props.handleFiltersChange('nit')}
          />
        </Col>
        <Col xs={6} sm={6} md={6} lg={6}>          
          <Search            
            prefix={<SearchOutlined className={'cabisa-table-search-icon'} />}
            placeholder='Referencia # Documento'
            className={'cabisa-table-search customSearch'}
            size={'large'}
            onSearch={props.handleFiltersChange('related_bill_document_number')}
          />
        </Col>
        <Col xs={6} sm={6} md={6} lg={6}>                    
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

export default BillingManagementTable