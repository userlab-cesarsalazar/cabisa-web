import React from 'react'
import {
  Card,
  Col,
  DatePicker,
  Input,
  Row,
  Select,
  Table,
  Tag as AntTag,
} from 'antd'
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
import ActionOptions from '../../../components/actionOptions'
import Tag from '../../../components/Tag'
import moment from 'moment'
import { permissions, documentsStatus } from '../../../commons/types'

const { Search } = Input
const { Option } = Select

function PaymentsTable(props) {
  const handlerEditRow = data => props.handlerEditRow(data)
  const handlerDeleteRow = data =>{props.handlerDeleteRow(data)}

  const columns = [    
    {
      title: '# Recibo',
      dataIndex: 'id', // Field that is goint to be rendered
      key: 'id',
      render: text => text ? <span>{text}</span> : <span>{'Factura del sistema'}</span>,
    },
    {
      title: 'Fecha',
      dataIndex: 'created_at', // Field that is goint to be rendered
      key: 'created_at ',
      render: text => (
        <span>{text ? moment(text).format('DD-MM-YYYY') : ''}</span>
      ),
    },
    {
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
      title: 'Monto',
      dataIndex: 'total_amount', // Field that is goint to be rendered
      key: 'total_amount',
      render: text => (text ? <span>{text.toFixed(2)}</span> : null),
    },    
    {
      title: 'Estado de Credito',
      dataIndex: 'status', // Field that is goint to be rendered
      key: 'status',
      render: text => <Tag type='creditStatus' value={text} />,
    },
    {
      title: '',
      dataIndex: 'id', // Field that is goint to be rendered
      key: 'id',
      render: (_, data) => (
        <ActionOptions
          editPermissions={false}
          data={data}
          permissionId={permissions.PAGOS}
          handlerEditRow={handlerEditRow}
          handlerDeleteRow={handlerDeleteRow}
          showDeleteBtn={true}
          deleteAction='nullify'
          editAction={
            'add_payment'
          }
        />
      ),
    },
  ]

  return (
    <>
      <Row gutter={16}>      
        <Col xs={4} sm={4} md={4} lg={4}>
          <Search
            prefix={<SearchOutlined className={'cabisa-table-search-icon'} />}
            placeholder='# Documento'
            className={'cabisa-table-search customSearch'}
            size={'large'}
            onSearch={props.handleFiltersChange('id')}
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
          <Select
            className={'single-select'}
            placeholder={'Estado de Credito'}
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
                <Tag type='creditStatusManual' value={value} />
              </Option>
            ))}
          </Select>
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

export default PaymentsTable
