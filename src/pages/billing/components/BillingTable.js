import React from 'react'
import {
  Card,
  Col,
  DatePicker,
  Input,
  Row,
  Select,
  Table,
  Divider,
  Tooltip,
  Button,
  Popconfirm,
  Tag as AntTag,
} from 'antd'
import {
  DeleteOutlined,
  FileSearchOutlined, PrinterOutlined  
} from '@ant-design/icons'
import SearchOutlined from '@ant-design/icons/lib/icons/SearchOutlined'
//import ActionOptions from '../../../components/actionOptions'
import Tag from '../../../components/Tag'
import moment from 'moment'
//import { permissions, documentsStatus } from '../../../commons/types'

const { Search } = Input
const { Option } = Select

function BillingTable(props) {
  //const handlerEditRow = data => props.showDetail(data)

  const handlerDeleteRow = data => props.handlerDeleteRow(data)

  const handlerShowDocument = data => props.handlerShowDocument(data)

  const handlerPrintDocument = data => props.handlerPrintDocument(data)

  const columns = [      
    {
      title: 'Nro. documento',
      dataIndex: 'document_number', // Field that is goint to be rendered
      key: 'document_number',
      render: text => <span>{text}</span>,
    },
    {
      title: 'UUID',
      dataIndex: 'uuid', // Field that is goint to be rendered
      key: 'uuid',
      render: text => <span>{text}</span>,
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
      title: 'Fecha de facturacion',
      dataIndex: 'created_at', // Field that is goint to be rendered
      key: 'created_at ',
      render: text => (
        <span>{text ? moment(text).format('DD-MM-YYYY') : ''}</span>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'total', // Field that is goint to be rendered
      key: 'total ',
      render: text => <span>{text.toFixed(2)}</span>,
    },
    {
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
    },
    {
      title: '',
      dataIndex: 'id', // Field that is goint to be rendered
      key: 'id',
      width: 175,
      render: (_, data) => (
        <>        
        <Tooltip title={'Imprimir documento'}>
              <Button
                icon={<PrinterOutlined />}
                onClick={() => handlerPrintDocument(data)}
              />
            </Tooltip>
        <Divider type={'vertical'} />
        <Tooltip title={'Ver documento'}>
              <Button
                icon={<FileSearchOutlined />}
                onClick={() => handlerShowDocument(data)}
              />
            </Tooltip>
        <Divider type={'vertical'} />
        <Tooltip title={'Anular'}>
        <Popconfirm
                title={`¿Estas seguro de anular la factura?`}
                onConfirm={() => handlerDeleteRow(data)}
                okText='Si'
                cancelText='No'
              >
              <Button
                danger
                icon={<DeleteOutlined />}                
              />
        </Popconfirm>
            </Tooltip>
        </>
      ),
    },
  ]

  return (
    <>
      <Row gutter={16}>
        <Col xs={4} sm={4} md={4} lg={4}>
          <Search
            prefix={<SearchOutlined className={'cabisa-table-search-icon'} />}
            placeholder='No. Documento'
            className={'cabisa-table-search customSearch'}
            size={'large'}
            onSearch={props.handleFiltersChange('document_number')}
          />
        </Col>
        <Col xs={4} sm={4} md={4} lg={4}>
          <Search
            type='tel'
            prefix={<SearchOutlined className={'cabisa-table-search-icon'} />}
            placeholder='Nit'
            className={'cabisa-table-search customSearch'}
            size={'large'}
            onSearch={props.handleFiltersChange('nit')}
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
    </>
  )
}

export default BillingTable
