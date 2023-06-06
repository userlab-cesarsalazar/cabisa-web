import React from 'react'
import {
  Card,
  Col,
  DatePicker,
  Input,
  Row,
  Select,
  Table,
  Tooltip,
  Button
} from 'antd'
import {
  DeleteOutlined,
  FileAddOutlined, PrinterOutlined  
} from '@ant-design/icons'
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import Tag from '../../../components/Tag'
import moment from 'moment'

const { Search } = Input
const { Option } = Select

function BillingManagementFelTable(props) {
  
  const handlerShowDocument = data => props.handlerShowDocument(data)
  
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
      render: text => <span>{text.toFixed(2)}</span>,
    },   
    {
      title: 'Status',
      dataIndex: 'status', // Field that is goint to be rendered
      key: 'status',
      width: 100,
      render: text => <Tag type='documentStatus' value={text} />,
    },
    {
      title: '',
      dataIndex: 'id', // Field that is goint to be rendered
      key: 'id',
      width: 50,
      render: (_, data) => (
        <>  {data.status === "APPROVED" &&
        (<Tooltip title={'Seleccionar'}>
              <Button
                icon={<FileAddOutlined />}
                onClick={() => handlerShowDocument(data)}
              />
        </Tooltip>        )
    }
        </>
      ),
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
          <DatePicker
            style={{ width: '100%', height: '40px', borderRadius: '8px' }}
            placeholder='Fecha de facturacion'
            format='DD-MM-YYYY'
            onChange={props.handleFiltersChange('created_at')}
          />
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
    </>
  )
}

export default BillingManagementFelTable
